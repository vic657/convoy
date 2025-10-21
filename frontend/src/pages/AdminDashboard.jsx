import React, { useState } from "react";
import { FaUsers, FaHome, FaBoxOpen, FaChartLine, FaCog, FaBars, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../Components/Navbar";
 // Import your custom styles

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", nationality: "Kenyan", phone: "+254700123456", passport_id: "A1234567" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", nationality: "Ugandan", phone: "+256700123456", passport_id: "B9876543" },
  ];

  const programs = 5;
  const reports = 3;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <Navbar />

      <aside className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2 className={`sidebar-title ${sidebarOpen ? "visible" : "hidden"}`}>Convoy Admin</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-button">
            <FaBars />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><FaHome /> {sidebarOpen && <span>Dashboard</span>}</li>
            <li><FaUsers /> {sidebarOpen && <span>Users</span>}</li>
            <li><FaBoxOpen /> {sidebarOpen && <span>Programs</span>}</li>
            <li><FaChartLine /> {sidebarOpen && <span>Reports</span>}</li>
            <li><FaCog /> {sidebarOpen && <span>Settings</span>}</li>
            <li onClick={handleLogout} className="logout">
              <FaSignOutAlt /> {sidebarOpen && <span>Logout</span>}
            </li>
          </ul>
        </nav>
      </aside>

      <main className={`main-content ${sidebarOpen ? "shifted" : "compact"}`}>
        <h1 className="page-title">Dashboard</h1>

        <div className="stats">
          <div className="card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="card">
            <h3>Total Programs</h3>
            <p>{programs}</p>
          </div>
          <div className="card">
            <h3>Total Reports</h3>
            <p>{reports}</p>
          </div>
        </div>

        <h2 className="section-title">All Registered Users</h2>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Nationality</th>
                <th>Phone</th>
                <th>Passport ID</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6}>No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.nationality}</td>
                    <td>{user.phone}</td>
                    <td>{user.passport_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      
    </div>
  );
};

export default AdminDashboard;
