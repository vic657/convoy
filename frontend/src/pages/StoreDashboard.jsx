import React, { useEffect, useState } from "react";
import { FaUsers, FaBox, FaMoneyBillWave, FaChartBar } from "react-icons/fa";
import "../assets/css/storeDashboard.css";


const StoreDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalItems: 0,
    eventsHandled: 0,
    totalValue: 0,
  });

  useEffect(() => {
    // Fetch sample stats from backend (replace with actual API later)
    setTimeout(() => {
      setStats({
        totalDonations: 142,
        totalItems: 79,
        eventsHandled: 12,
        totalValue: 15800,
      });
    }, 600);
  }, []);

  return (
    <div className="store-dashboard">
       
      <header className="store-header">
        <h1>Store Dashboard</h1>
        <p>Welcome back, </p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon money" />
          <div>
            <h3>${stats.totalValue.toLocaleString()}</h3>
            <p>Total Donation Value</p>
          </div>
        </div>
        <div className="stat-card">
          <FaBox className="stat-icon box" />
          <div>
            <h3>{stats.totalItems}</h3>
            <p>Donated Items</p>
          </div>
        </div>
        <div className="stat-card">
          <FaChartBar className="stat-icon chart" />
          <div>
            <h3>{stats.eventsHandled}</h3>
            <p>Events Handled</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon users" />
          <div>
            <h3>{stats.totalDonations}</h3>
            <p>Donors Participated</p>
          </div>
        </div>
      </section>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-badge new">New</span>
            <p>Received 20 bags of rice from John Doe</p>
            <span className="time">5 mins ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-badge success">Success</span>
            <p>Delivered 10 boxes of water to Nairobi Event</p>
            <span className="time">1 hr ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-badge pending">Pending</span>
            <p>Awaiting pickup confirmation from Mombasa</p>
            <span className="time">2 hrs ago</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreDashboard;
