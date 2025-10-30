import React, { useState, useEffect } from "react";
import { apiAxios } from "../axios";
import "../assets/css/UserDashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donateEvent, setDonateEvent] = useState(null);
  const [donationType, setDonationType] = useState("money");
  const [donationData, setDonationData] = useState({
    amount: "",
    item_category: "",
    item_description: "",
    pickup_location: "",
    contact: "",
  });

  useEffect(() => {
    fetchUserDonations();
  }, []);

  const fetchUserDonations = async () => {
    try {
      const res = await apiAxios.get("/donations/user");
      if (res.data.success) {
        setDonations(res.data.donations);
      }
    } catch (error) {
      console.error("Error fetching user donations:", error);
    } finally {
      setLoading(false);
    }
  };

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

      toast.success("Thank you for your donation!", {
        position: "top-center",
        autoClose: 3000,
      });

      closeDonateModal();
      fetchUserDonations();
    } catch (error) {
      console.error("Donation error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit donation. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="user-dashboard">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading your donations...</p>
        </div>
      ) : (
        <>
          <h2 className="dashboard-title">Your Donation History</h2>

          <div className="table-wrapper scrollable">
            <table className="donation-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Amount / Item</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{donation.event?.title || "Unknown Event"}</td>
                      <td>{donation.type}</td>
                      <td>
                        {donation.type === "money"
                          ? `Ksh ${Number(donation.amount).toLocaleString()}`
                          : `${donation.item_category || "—"} (${donation.item_description || ""})`}
                      </td>
                      <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                      <td>
                        {donation.event ? (
                          <button
                            className="donate-btn"
                            onClick={() => openDonateModal(donation.event)}
                          >
                            Donate Again
                          </button>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-events-row">
                      You haven’t made any donations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === Donation Modal === */}
      {donateEvent && (
        <div className="modal-overlay" onClick={closeDonateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDonateModal}>
              ✕
            </button>
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
                  onChange={(e) =>
                    setDonationData({ ...donationData, amount: e.target.value })
                  }
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
                      setDonationData({
                        ...donationData,
                        pickup_location: e.target.value,
                      })
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
                      setDonationData({
                        ...donationData,
                        item_description: e.target.value,
                      })
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

export default PaymentHistory;
