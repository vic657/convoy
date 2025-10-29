import React, { useEffect, useState, useRef } from "react";
import { apiAxios } from "../axios";
import "../assets/css/UserDashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPast, setShowPast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [donateEvent, setDonateEvent] = useState(null);
  const [donationType, setDonationType] = useState("money");
  const [donatedEvents, setDonatedEvents] = useState([]);
  const [donationData, setDonationData] = useState({
    amount: "",
    item_category: "",
    item_description: "",
    pickup_location: "",
    contact: "",
  });

  const slideInterval = useRef(null);

  useEffect(() => {
    fetchEvents();
    fetchUserDonations();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiAxios.get("/events");
      if (Array.isArray(res.data)) {
        setEvents(res.data);
        setPastEvents([]);
      } else if (res.data.upcoming || res.data.past) {
        setEvents(res.data.upcoming || []);
        setPastEvents(res.data.past || []);
      } else {
        setEvents([]);
        setPastEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchUserDonations = async () => {
    try {
      const res = await apiAxios.get("/donations/user");
      if (res.data && Array.isArray(res.data.donated_event_ids)) {
        setDonatedEvents(res.data.donated_event_ids);
      }
    } catch (error) {
      console.error("Error fetching user donations:", error);
    }
  };

  useEffect(() => {
    if (events.length > 0) startAutoSlide();
    return () => stopAutoSlide();
  }, [events]);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + events.length) % events.length);

  const handleEventClick = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const openDonateModal = (event) => setDonateEvent(event);

  const closeDonateModal = () => {
    setDonateEvent(null);
    setDonationType("money");
    setDonationData({
      amount: "",
      item_category: "",
      item_description: "",
      pickup_location: "",
      contact: "",
    });
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        event_id: donateEvent.id,
        type: donationType,
        amount: donationData.amount,
        item_category: donationData.item_category,
        item_description: donationData.item_description,
        pickup_location: donationData.pickup_location,
        contact: donationData.contact,
      };

      await apiAxios.post("/donations", payload);

      setDonatedEvents((prev) => [...prev, donateEvent.id]);

      toast.success("Thank you for your donation!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
      });

      closeDonateModal();
    } catch (error) {
      console.error("Donation error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit donation. Please try again.";

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
      });
    }
  };

  const currentEvents = showPast ? pastEvents : events;

  return (
    <div className="user-dashboard">
      {/* === Hero Slider === */}
      <div className="hero-slider">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={event.id}
              className={`slide ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleEventClick(event)}
            >
              <img
                src={`http://127.0.0.1:8000/storage/${event.image.replace(/^storage\//, "")}`}
                alt={event.title}
              />
              <div className="overlay"></div>
              <div className="event-info">
                <h2>{event.title}</h2>
                <p>{event.date} • {event.venue}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">No upcoming events yet.</div>
        )}

        {events.length > 1 && (
          <>
            <button onClick={prevSlide} className="slide-btn prev-btn">‹</button>
            <button onClick={nextSlide} className="slide-btn next-btn">›</button>
          </>
        )}
      </div>

      {/* === Event Table === */}
      <div className="event-table-section">
        <div className="event-table-header">
          <h3>{showPast ? "Past Events" : "Upcoming Events"}</h3>
          <button onClick={() => setShowPast(!showPast)} className="toggle-btn">
            {showPast ? "Show Upcoming" : "Show Past"}
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Target</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr key={event.id} className="event-row">
                    <td onClick={() => handleEventClick(event)}>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>
                      {event.target_amount
                        ? `Ksh ${Number(event.target_amount).toLocaleString()}`
                        : "-"}
                    </td>
                    <td>
                      {donatedEvents.includes(event.id) ? (
                        <button className="donated-btn" disabled>Donated</button>
                      ) : (
                        <button className="donate-btn" onClick={() => openDonateModal(event)}>
                          Donate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-events-row">
                    No {showPast ? "past" : "upcoming"} events available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Event Modal === */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <img
              src={`http://127.0.0.1:8000/storage/${selectedEvent.image.replace(/^storage\//, "")}`}
              alt={selectedEvent.title}
              className="modal-image"
            />
            <h2 className="modal-title">{selectedEvent.title}</h2>
            <p className="modal-meta">{selectedEvent.date} • {selectedEvent.venue}</p>
            <p className="modal-target">Target: Ksh {Number(selectedEvent.target_amount).toLocaleString()}</p>
            <p className="modal-description">{selectedEvent.description}</p>

            {donatedEvents.includes(selectedEvent.id) ? (
              <button className="donated-btn" disabled>Donated</button>
            ) : (
              <button className="donate-btn" onClick={() => openDonateModal(selectedEvent)}>
                Donate
              </button>
            )}
          </div>
        </div>
      )}

      {/* === Donation Modal === */}
      {donateEvent && (
        <div className="modal-overlay" onClick={closeDonateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDonateModal}>✕</button>
            <h2>Donate to: {donateEvent.title}</h2>

            <div className="donation-toggle">
              <label>
                <input
                  type="radio"
                  name="donationType"
                  value="money"
                  checked={donationType === "money"}
                  onChange={(e) => setDonationType(e.target.value)}
                />
                Money
              </label>
              <label>
                <input
                  type="radio"
                  name="donationType"
                  value="other"
                  checked={donationType === "other"}
                  onChange={(e) => setDonationType(e.target.value)}
                />
                Other
              </label>
            </div>

            <form onSubmit={handleDonationSubmit} className="donation-form">
              {donationType === "money" ? (
                <input
                  type="number"
                  placeholder="Enter amount (Ksh)"
                  value={donationData.amount}
                  onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                  required
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Donation category (e.g., Clothes, Food)"
                    value={donationData.item_category}
                    onChange={(e) =>
                      setDonationData({ ...donationData, item_category: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={donationData.pickup_location}
                    onChange={(e) =>
                      setDonationData({ ...donationData, pickup_location: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact number"
                    value={donationData.contact}
                    onChange={(e) =>
                      setDonationData({ ...donationData, contact: e.target.value })
                    }
                    required
                  />
                  <textarea
                    placeholder="Description of items"
                    value={donationData.item_description}
                    onChange={(e) =>
                      setDonationData({ ...donationData, item_description: e.target.value })
                    }
                    required
                  ></textarea>
                </>
              )}
              <button type="submit" className="submit-donation">
                Submit Donation
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
