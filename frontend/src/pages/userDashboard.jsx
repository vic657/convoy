import React, { useEffect, useState, useRef } from "react";
import { apiAxios } from "../axios";
import "../assets/css/UserDashboard.css";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPast, setShowPast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const slideInterval = useRef(null);

  useEffect(() => {
    fetchEvents();
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
      setEvents([]);
      setPastEvents([]);
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

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
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
                <p>
                  {event.date} • {event.venue}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">No upcoming events yet.</div>
        )}

        {events.length > 1 && (
          <>
            <button onClick={prevSlide} className="slide-btn prev-btn">
              ‹
            </button>
            <button onClick={nextSlide} className="slide-btn next-btn">
              ›
            </button>
          </>
        )}
      </div>

      {/* === Event Table Section === */}
      <div className="event-table-section">
        <div className="event-table-header">
          <h3>{showPast ? "Past Events" : "Upcoming Events"}</h3>
          <button
            onClick={() => setShowPast(!showPast)}
            className="toggle-btn"
          >
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
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="event-row"
                  >
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>
                      {event.target_amount
                        ? `$${Number(event.target_amount).toLocaleString()}`
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-events-row">
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
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <img
              src={`http://127.0.0.1:8000/storage/${selectedEvent.image.replace(/^storage\//, "")}`}
              alt={selectedEvent.title}
              className="modal-image"
            />
            <h2 className="modal-title">{selectedEvent.title}</h2>
            <p className="modal-meta">
               {selectedEvent.date} •  {selectedEvent.venue}
            </p>
            <p className="modal-target">
               Target: ${Number(selectedEvent.target_amount).toLocaleString()}
            </p>
            <p className="modal-description">{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
