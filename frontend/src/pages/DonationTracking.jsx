import React, { useEffect, useState } from "react";
import { apiAxios } from "../axios"; // ✅ use your configured instance
import "../assets/css/donationtracking.css";
import { FaPlusCircle, FaMoneyBillWave, FaChartPie } from "react-icons/fa";

const DonationTracking = () => {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await apiAxios.get("/donations");
        if (response.data && response.data.success) {
          const formatted = response.data.donations.map((d) => ({
            id: d.id,
            event: d.event?.title || "Unnamed Event",
            target: d.event?.target_amount || 0, // ensure backend includes target_amount in Event
            received: d.amount || 0,
            lastDonation: d.created_at,
          }));
          setDonations(formatted);
        } else {
          setError("No donations found.");
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading)
    return <div className="page-loader">Loading donation data...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donation-tracking">
      <h2>Donation Tracking</h2>

      <div className="donation-grid">
        {donations.map((donation) => {
          const progress = donation.target
            ? Math.round((donation.received / donation.target) * 100)
            : 0;

          return (
            <div className="donation-card" key={donation.id}>
              <div className="card-header">
                <h3>{donation.event}</h3>
                <button className="add-btn">
                  <FaPlusCircle /> Add Donation
                </button>
              </div>

              <div className="card-body">
                <p>
                  <FaMoneyBillWave /> Received:{" "}
                  <strong>Ksh {donation.received.toLocaleString()}</strong>
                </p>
                <p>
                  <FaChartPie /> Target:{" "}
                  <strong>Ksh {donation.target.toLocaleString()}</strong>
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <small>Progress: {progress}%</small>
                <p className="last-donation">
                  Last donation: {donation.lastDonation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonationTracking;
