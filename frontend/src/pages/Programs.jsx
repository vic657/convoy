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
  FaBell,
} from "react-icons/fa";

const Programs = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);


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
    fetchNotifications();

    // Simulate live updates every 15s (later can be WebSocket)
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await apiAxios.get("/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await apiAxios.get("/event-notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.venue) {
      toast.warn("Please fill all required fields!");
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      if (editEvent) {
        await apiAxios.post(`/events/${editEvent.id}?_method=PUT`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated successfully!");
      } else {
        await apiAxios.post("/events", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFormData({
            title: "",
            date: "",
            venue: "",
            target_amount: "",
            audience: "",
            description: "",
            image: null,
            });


      }

      setShowForm(false);
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error("Failed to save event.");
    }
  };

  const handleDelete = async (id) => {
  toast.info(
    <div>
      <p>Are you sure you want to delete this event?</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={async () => {
            try {
              await apiAxios.delete(`/events/${id}`);
              setEvents(events.filter((e) => e.id !== id));
              toast.dismiss();
              toast.success("Event deleted successfully!");
            } catch (err) {
              console.error("Error deleting event:", err);
              toast.dismiss();
              toast.error("Failed to delete event.");
            }
          }}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          style={{
            background: "#999",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          No
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  );
};


  const handleEdit = (event) => {
    setEditEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      venue: event.venue,
      target_amount: event.target_amount,
      audience: event.audience,
      description: event.description,
      image: null,
    });
    setShowForm(true);
  };

  const filteredEvents = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = filterDate ? e.date === filterDate : true;
    return matchSearch && matchDate;
  });

  return (
    <div className="programs-container">
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />

      <div className="programs-header">
        <h2>Programs & Events</h2>

        <div className="header-actions">
          {/* Notification Bell */}
          <div className="notification-container">
            <button
              className="notif-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="notif-badge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <h4>Recent Contributions</h4>
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div key={i} className="notif-item">
                      <p>
                        <strong>{n.user_name}</strong> contributed to{" "}
                        <span>{n.event_title}</span>
                      </p>
                      <small>{n.created_at}</small>
                    </div>
                  ))
                ) : (
                  <p className="no-notif">No new contributions</p>
                )}
              </div>
            )}
          </div>

          {/* Add Event Button */}
          <button
            className="add-btn"
            onClick={() => {
                setEditEvent(null);
                setFormData({
                title: "",
                date: "",
                venue: "",
                target_amount: "",
                audience: "",
                description: "",
                image: null,
                });
                setShowForm(true);
            }}
            >

            <FaPlus /> Add Event
          </button>
        </div>
      </div>

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

      {loading ? (
        <p className="loading">Loading events...</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p>
                    <strong>Target:</strong> Ksh {event.target_amount}
                  </p>
                  <p>
                    <strong>Audience:</strong> {event.audience}
                  </p>
                  <p
                    className={`desc ${expandedEventId === event.id ? "expanded" : ""}`}
                    onClick={() =>
                        setExpandedEventId(expandedEventId === event.id ? null : event.id)
                    }
                    >
                    {event.description}
                    </p>

                </div>
                <div className="event-actions">
                  <button
                    onClick={() => handleEdit(event)}
                    className="edit-btn"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No events found.</p>
          )}
        </div>
      )}

      {showForm && (
  <div className="event-form">
    <h3>{editEvent ? "Edit Event" : "Add New Event"}</h3>
    <form onSubmit={handleSave}>
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />

      {/* Prevent past dates */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        min={new Date().toISOString().split("T")[0]} // this sets today as minimum date
        required
      />

      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="target_amount"
        placeholder="Target Amount"
        value={formData.target_amount}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="audience"
        placeholder="Target beneficiaries (families)"
        value={formData.audience}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        rows={4}
      ></textarea>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleInputChange}
      />

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {editEvent ? "Update" : "Save"}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            setShowForm(false);
            setEditEvent(null);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
};

export default Programs;
