import React, { useEffect, useState } from "react";
import { apiAxios } from "../axios";
import "../assets/css/NonCashDonations.css";

const NonCashDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [receivedData, setReceivedData] = useState({
    item_name: "",
    quantity: "",
    unit: "",
    condition: "",
    remarks: "",
  });

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await apiAxios.get("/donations");
      const items = res.data.donations
  .filter((d) => d.type !== "money")
  .map((d) => ({
    ...d,
    status: d.status, // use status as it is from backend
  }));

setDonations(items);

    } catch (err) {
      console.error("Failed to load donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (donation) => {
    if (donation.status === "received") {
      alert("This donation has already been marked as received.");
      return;
    }
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setReceivedData({
      item_name: "",
      quantity: "",
      unit: "",
      condition: "",
      remarks: "",
    });
    setSelectedDonation(null);
  };

  const handleChange = (e) => {
    setReceivedData({ ...receivedData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!receivedData.item_name || !receivedData.quantity) {
      alert("Please fill in item name and quantity.");
      return;
    }

    setUpdating(selectedDonation.id);
    try {
      const res = await apiAxios.put(`/donations/${selectedDonation.id}/status`, {
        status: "received",
        ...receivedData,
      });

      // 🧩 Instantly update the specific donation locally
      setDonations((prev) =>
        prev.map((d) =>
          d.id === selectedDonation.id
            ? { ...d, ...res.data.donation, status: "received" }
            : d
        )
      );

      // 🧩 Also ensure local selectedDonation reflects new status
      setSelectedDonation((prev) => ({ ...prev, status: "received" }));

      closeModal();
    } catch (err) {
      console.error("Error updating donation:", err);
      alert("Failed to update donation. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading non-cash donations...</p>
      </div>
    );
  }

  return (
    <div className="noncash-container">
      <h2 className="page-title">Non-Cash Donations</h2>

      {donations.length === 0 ? (
        <p className="empty-text">No non-cash donations found.</p>
      ) : (
        <div className="donation-list">
          {donations.map((d) => (
            <div key={d.id} className="donation-card">
              <div className="donation-info">
                <h3>{d.item_category || "General Item"}</h3>
                <p><strong>Donor:</strong> {d.donor_name}</p>
                <p><strong>Event:</strong> {d.event?.title}</p>
                <p><strong>Description:</strong> {d.item_description}</p>
                <p><strong>Pickup:</strong> {d.pickup_location}</p>
                <p><strong>Contact:</strong> {d.contact}</p>
                <p><strong>Date:</strong> {new Date(d.created_at).toLocaleDateString()}</p>
              </div>

              <div className="donation-status">
                {/* 🧩 Disable button + show badge immediately */}
                {d.status === "received" ? (
                  <span className="status received">Received</span>
                ) : (
                  <button
                    className="mark-btn"
                    onClick={() => openModal(d)}
                    disabled={updating === d.id || d.status === "received"}
                  >
                    {updating === d.id ? "Updating..." : "Mark as Received"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Record Received Item</h3>
            <p><strong>Donation:</strong> {selectedDonation?.item_category}</p>

            <label>Item Name</label>
            <input
              type="text"
              name="item_name"
              value={receivedData.item_name}
              onChange={handleChange}
              placeholder="Enter item name"
            />

            <div className="quantity-row">
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={receivedData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label>Unit</label>
                <select name="unit" value={receivedData.unit} onChange={handleChange}>
                  <option value="">Select Unit</option>
                  <option value="kgs">Kgs</option>
                  <option value="litres">Litres</option>
                  <option value="bales">Bales</option>
                  <option value="bundles">Bundles</option>
                  <option value="sacks">Sacks</option>
                  <option value="rolls">Rolls</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>
            </div>

            <label>Condition</label>
            <select
              name="condition"
              value={receivedData.condition}
              onChange={handleChange}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Used - Good">Used - Good</option>
              <option value="Damaged">Damaged</option>
            </select>

            <label>Remarks</label>
            <textarea
              name="remarks"
              value={receivedData.remarks}
              onChange={handleChange}
              placeholder="Any additional notes"
            ></textarea>

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button
                onClick={handleSubmit}
                className="submit-btn"
                disabled={updating}
              >
                {updating ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonCashDonations;
