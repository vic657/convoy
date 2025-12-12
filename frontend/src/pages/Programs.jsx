import React, { useState, useEffect } from "react";
import { apiAxios } from "../axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/programs.css";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";

const Programs = () => {
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showUpcoming, setShowUpcoming] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    target_amount: "",
    audience: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await apiAxios.get("/events");

      setUpcoming(res.data.upcoming || []);
      setPast(res.data.past || []);

      setEvents([
        ...(res.data.upcoming || []),
        ...(res.data.past || []),
      ]);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // === Slider auto change ===
  useEffect(() => {
    if (upcoming.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % upcoming.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [upcoming]);

  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + upcoming.length) % upcoming.length);
  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % upcoming.length);

  // === Form Handling ===
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      if (editEvent) {
        await apiAxios.post(`/events/${editEvent.id}?_method=PUT`, payload);
        toast.success("Event updated successfully!");
      } else {
        await apiAxios.post(`/events`, payload);
        toast.success("Event created successfully!");
      }

      setShowForm(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await apiAxios.delete(`/events/${id}`);
      toast.success("Event deleted!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  // === Filters ===
  const filtered =
    (showUpcoming ? upcoming : past).filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDate = filterDate ? e.date === filterDate : true;
      return matchSearch && matchDate;
    });

  return (
    <div className="programs-container">
      <ToastContainer />

      {/* ===== HERO SLIDER ===== */}
      <section id="events-hero">
        <div className="events-container">
          <h2>Upcoming Events</h2>

          <div className="event-slider">
            {upcoming.length > 0 ? (
              upcoming.map((event, index) => (
                <div
                  key={event.id}
                  className={`event-slide ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-slide-image"
                  />

                  <div className="overlay">
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>
                        {event.date} • {event.venue}
                      </p>
                      <p className="desc">
                        {event.description?.length > 150
                          ? event.description.slice(0, 150) + "..."
                          : event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">No upcoming events yet.</div>
            )}

            {upcoming.length > 1 && (
              <>
                <button className="nav-btn prev" onClick={prevSlide}>
                  ‹
                </button>
                <button className="nav-btn next" onClick={nextSlide}>
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <div className="search-filter">
        <div className="search-box">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FaCalendarAlt className="icon" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* === TOGGLE UPCOMING / PAST === */}
      <div className="toggle-container">
        <button
          className={showUpcoming ? "active-toggle" : ""}
          onClick={() => setShowUpcoming(true)}
        >
          Upcoming Events
        </button>
        <button
          className={!showUpcoming ? "active-toggle" : ""}
          onClick={() => setShowUpcoming(false)}
        >
          Past Events
        </button>
      </div>

      {/* === EVENTS LIST === */}
      <div className="events-grid">
        {filtered.length > 0 ? (
          filtered.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} className="event-image" />

              <div className="event-content">
                <h3>{event.title}</h3>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Venue:</strong> {event.venue}
                </p>
              </div>

              <div className="event-actions">
                <button onClick={() => handleDelete(event.id)}>
                  <FaTrash /> Delete
                </button>
                <button onClick={() => setEditEvent(event)}>
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>

      {/* === FORM (Add/Edit) === */}
      {showForm && (
        <div className="event-form">
          <h3>{editEvent ? "Edit Event" : "Add Event"}</h3>
          <form onSubmit={handleSave}>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <input
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="Venue"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            ></textarea>

            <input type="file" name="image" onChange={handleInputChange} />

            <button type="submit">Save</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Programs;
