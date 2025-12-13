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
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    target_amount: "",
    audience: "",
    description: "",
    image: null,
  });

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    try {
      const res = await apiAxios.get("/events");
      setUpcoming(res.data.upcoming || []);
      setPast(res.data.past || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= SLIDER ================= */
  useEffect(() => {
    if (!upcoming.length) return;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % upcoming.length),
      4000
    );
    return () => clearInterval(timer);
  }, [upcoming]);

  const prevSlide = () =>
    setActiveIndex((i) => (i - 1 + upcoming.length) % upcoming.length);
  const nextSlide = () =>
    setActiveIndex((i) => (i + 1) % upcoming.length);

  /* ================= EDIT PRE-FILL ================= */
  useEffect(() => {
    if (!editEvent) return;

    setFormData({
      title: editEvent.title || "",
      date: editEvent.date || "",
      venue: editEvent.venue || "",
      target_amount: editEvent.target_amount || "",
      audience: editEvent.audience || "",
      description: editEvent.description || "",
      image: null,
    });
  }, [editEvent]);

  /* ================= FORM HANDLING ================= */
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

  Object.entries(formData).forEach(([key, value]) => {
    // ✅ Handle image separately
    if (key === "image") {
      if (value instanceof File) {
        payload.append("image", value);
      }
      return;
    }

    // ✅ DO NOT send empty strings or nulls
    if (value !== null && value !== "") {
      payload.append(key, value);
    }
  });

  try {
    if (editEvent) {
      await apiAxios.post(
        `/events/${editEvent.id}?_method=PUT`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Event updated successfully!");
    } else {
      await apiAxios.post("/events", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created successfully!");
    }

    setShowForm(false);
    setEditEvent(null);
    fetchEvents();
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to save event");
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await apiAxios.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ================= FILTER ================= */
  const filtered = (showUpcoming ? upcoming : past).filter((e) => {
    const s = searchTerm.toLowerCase();
    return (
      (e.title?.toLowerCase().includes(s) ||
        e.venue?.toLowerCase().includes(s)) &&
      (!filterDate || e.date === filterDate)
    );
  });

  /* ================= RENDER ================= */
  return (
    <div className="programs-container">
      <ToastContainer />

      {/* ===== HERO ===== */}
      <section id="events-hero">
        <h2>Upcoming Events</h2>
        <div className="event-slider">
          {upcoming.length ? (
            upcoming.map((event, index) => (
              <div
                key={event.id}
                className={`event-slide ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="event-slide-image"
                />
                <div className="overlay">
                  <h3>{event.title}</h3>
                  <p>{event.date} • {event.venue}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No upcoming events</p>
          )}

          {upcoming.length > 1 && (
            <>
              <button className="nav-btn prev" onClick={prevSlide}>‹</button>
              <button className="nav-btn next" onClick={nextSlide}>›</button>
            </>
          )}
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <div className="search-filter">
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Add Event
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div className="events-grid">
        {filtered.length ? (
          filtered.map((event) => (
            <div className="event-card" key={event.id}>
              <img src={event.image_url} alt="" />
              <h3>{event.title}</h3>
              <p>{event.date}</p>
              <div className="event-actions">
                <button
                  onClick={() => {
                    setEditEvent(event);
                    setShowForm(true);
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(event.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events found</p>
        )}
      </div>

      {/* ===== FORM ===== */}
      {showForm && (
        <div className="event-form">
          <h3>{editEvent ? "Edit Event" : "Add Event"}</h3>
          <form onSubmit={handleSave}>
            <input name="title" value={formData.title} onChange={handleInputChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            <input name="venue" value={formData.venue} onChange={handleInputChange} required />
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
            <input type="file" name="image" onChange={handleInputChange} />

            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditEvent(null);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Programs;
