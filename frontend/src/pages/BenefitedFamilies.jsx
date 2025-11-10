import React, { useState, useEffect } from "react";
import { apiAxios } from "../axios";
import "../assets/css/BenefitedFamilies.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BenefitedFamilies = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [families, setFamilies] = useState([]);
  const [formData, setFormData] = useState({
    rep_name: "",
    members: "",
    occupation: "",
    address: "",
    contact: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await apiAxios.get("/events");
      const eventsArray = [...(res.data.upcoming || []), ...(res.data.past || [])];
      setEvents(eventsArray);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events.");
    }
  };

  // Fetch families
  const fetchFamilies = async () => {
    try {
      const res = await apiAxios.get("/families");
      if (res.data.success) {
        setFamilies(res.data.families);
      }
    } catch (err) {
      console.error("Error fetching families:", err);
      toast.error("Failed to fetch families.");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFamilies();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleEventChange = (e) => setSelectedEvent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      toast.warn("Please select an event first.");
      return;
    }
    try {
      const payload = {
        ...formData,
        event_id: selectedEvent,
        members: parseInt(formData.members, 10),
      };
      const res = await apiAxios.post("/families", payload);
      if (res.data.success) {
        setFamilies([res.data.family, ...families]);
        setFormData({ rep_name: "", members: "", occupation: "", address: "", contact: "" });
        setSelectedEvent("");
        toast.success("Family added successfully!");
      }
    } catch (err) {
      console.error("Error saving family:", err);
      const msg =
        err.response?.data?.message || "Failed to save family. Please check your input.";
      toast.error(msg);
    }
  };

  // Filter families based on search
  const filteredFamilies = families.filter((f) =>
    [f.rep_name, f.address, f.occupation, f.event?.title]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sort families
  const sortedFamilies = [...filteredFamilies].sort((a, b) => {
    if (!sortKey) return 0;
    let valA = sortKey === "event" ? a.event?.title || "" : a[sortKey];
    let valB = sortKey === "event" ? b.event?.title || "" : b[sortKey];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = sortedFamilies.slice(firstRecordIndex, lastRecordIndex);
  const totalPages = Math.ceil(sortedFamilies.length / recordsPerPage);

  return (
    <div className="families-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Benefited Families</h2>

      {/* Event Selection */}
      <div className="form-row">
        <select
          name="event_id"
          value={selectedEvent}
          onChange={handleEventChange}
          required
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      <form className="family-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="rep_name"
            placeholder="Family Representative Name"
            value={formData.rep_name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="members"
            placeholder="Number of Family Members"
            value={formData.members}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="contact"
            placeholder="Contact Information"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-submit">
          Add Family
        </button>
      </form>

      {/* Search & Sort */}
      <div className="form-row" style={{ marginTop: "15px", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search families..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="rep_name">Representative</option>
          <option value="members">Members</option>
          <option value="event">Event</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="families-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Representative</th>
              <th>Members</th>
              <th>Occupation</th>
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((f, i) => (
                <tr key={f.id}>
                  <td>{firstRecordIndex + i + 1}</td>
                  <td>{f.event?.title || "N/A"}</td>
                  <td>{f.rep_name}</td>
                  <td>{f.members}</td>
                  <td>{f.occupation}</td>
                  <td>{f.address}</td>
                  <td>{f.contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No family data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BenefitedFamilies;
