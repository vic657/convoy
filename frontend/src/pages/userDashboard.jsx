import React from 'react';
import { FaSignOutAlt, FaUserCircle, FaBell, FaMoneyBill } from 'react-icons/fa';

const UserDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <section className="profile-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaUserCircle style={{ fontSize: '3rem', color: '#9ca3af' }} />
          <div>
            <h2>John Doe</h2>
            <p>john@example.com</p>
          </div>
        </div>

        <div className="profile-info">
          <div>Nationality: Kenya</div>
          <div>Phone: +254700000000</div>
          <div>Passport ID: A1234567</div>
        </div>
      </section>

      <section className="table-card">
        <h3><FaMoneyBill /> Payment History</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Food Drive 2025</td>
              <td>$50</td>
              <td className="status-confirmed">Confirmed</td>
              <td>2025-10-10</td>
            </tr>
            <tr>
              <td>Water Project</td>
              <td>$30</td>
              <td className="status-pending">Pending</td>
              <td>2025-10-12</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="notifications">
        <h3><FaBell /> Notifications</h3>
        <ul>
          <li>Your donation for Food Drive has been confirmed.</li>
          <li>Thank you for supporting the Water Project!</li>
        </ul>
      </section>
    </div>
  );
};

export default UserDashboard;
