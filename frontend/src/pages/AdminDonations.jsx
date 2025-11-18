// src/pages/admin/AdminDonations.jsx
import React, { useEffect, useState } from "react";
import { apiAxios } from "../axios";
import { FaUsers, FaBoxOpen, FaHandHoldingUsd, FaPeopleCarry } from "react-icons/fa";
import "../assets/css/AdminDonations.css";

const AdminDonations = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [donors, setDonors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    fetchDonationsSummary();
  }, []);

  const fetchDonationsSummary = async () => {
    try {
      setLoading(true);
      const res = await apiAxios.get("/admin/donations-summary");
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      setSelectedEvent(eventId);
      const [donorsRes, beneficiariesRes] = await Promise.all([
        apiAxios.get(`/admin/event/${eventId}/donors`),
        apiAxios.get(`/admin/event/${eventId}/beneficiaries`),
      ]);
      setDonors(donorsRes.data.donors || []);
      setBeneficiaries(beneficiariesRes.data.beneficiaries || []);
    } catch (err) {
      console.error("Error loading event details:", err);
    }
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="admin-donations-container">
      <h2>Event Donations Overview</h2>
      <div className="donations-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p><FaHandHoldingUsd /> Cash Donations: <strong>KES {event.cash_total || 0}</strong></p>
            <p><FaBoxOpen /> Non-Cash Donations: <strong>{event.noncash_total || 0} items</strong></p>
            <p>Target: KES {event.target_amount}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${Math.min((event.cash_total / event.target_amount) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <button className="view-btn" onClick={() => fetchEventDetails(event.id)}>
              View Donors & Beneficiaries
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="details-section">
          <h3>Event Details</h3>
          <div className="details-grid">
            <div className="card">
              <h4><FaUsers /> Donors</h4>
              <ul>
                {donors.length > 0 ? (
                  donors.map((d) => (
                    <li key={d.id}>
                      {d.name} – {d.type === "cash" ? `KES ${d.amount}` : d.item}
                    </li>
                  ))
                ) : (
                  <p>No donors yet.</p>
                )}
              </ul>
            </div>
            <div className="card">
              <h4><FaPeopleCarry /> Beneficiaries</h4>
              <ul>
                {beneficiaries.length > 0 ? (
                  beneficiaries.map((b) => (
                    <li key={b.id}>
                      {b.name} – {b.received_item || b.amount_received}
                    </li>
                  ))
                ) : (
                  <p>No beneficiaries yet.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
