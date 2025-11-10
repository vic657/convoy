import React, { useEffect, useState } from "react";
import { apiAxios } from "../axios";
import "../assets/css/donationtracking.css";
import { FaPlusCircle, FaMoneyBillWave, FaChartPie } from "react-icons/fa";

const DonationTracking = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await apiAxios.get("/donations");

        if (response.data && response.data.success) {
          const donations = response.data.donations;

          // 🧩 Group donations by event
          const grouped = donations.reduce((acc, d) => {
            const eventId = d.event?.id || "unknown";
            if (!acc[eventId]) {
              acc[eventId] = {
                id: eventId,
                title: d.event?.title || "Unnamed Event",
                target: Number(d.event?.target_amount || 0),
                totalReceived: 0,
                lastDonation: d.created_at,
                nonCash: 0,
              };
            }

            // 🧮 Add money or non-cash donation count/value
            if (d.type === "money") {
              acc[eventId].totalReceived += Number(d.amount || 0);
            } else {
              // Count or treat non-cash as number of items received
              acc[eventId].nonCash += 1;
            }

            // Update latest donation date if newer
            if (new Date(d.created_at) > new Date(acc[eventId].lastDonation)) {
              acc[eventId].lastDonation = d.created_at;
            }

            return acc;
          }, {});

          setEvents(Object.values(grouped));
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

  if (loading) return <div className="page-loader">Loading donation data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donation-tracking">
      <h2>Donation Tracking</h2>

      <div className="donation-grid">
        {events.map((event) => {
          const progress = event.target
            ? Math.min(Math.round((event.totalReceived / event.target) * 100), 100)
            : 0;

          return (
            <div className="donation-card" key={event.id}>
              <div className="card-header">
                <h3>{event.title}</h3>
                <button className="add-btn">
                  <FaPlusCircle /> Add Donation
                </button>
              </div>

              <div className="card-body">
                <p>
                  <FaMoneyBillWave /> Total Cash Received:{" "}
                  <strong>Ksh {event.totalReceived.toLocaleString()}</strong>
                </p>
                <p>
                  🧺 Non-cash Donations:{" "}
                  <strong>{event.nonCash}</strong>
                </p>
                <p>
                  <FaChartPie /> Target:{" "}
                  <strong>Ksh {event.target.toLocaleString()}</strong>
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <small>Progress: {progress}%</small>
                <p className="last-donation">
                  Last donation: {new Date(event.lastDonation).toLocaleString()}
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
