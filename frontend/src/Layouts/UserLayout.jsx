import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaTachometerAlt, FaMoneyBill, FaBell, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import Navbar from "../Components/Navbar"; // import your existing top navbar
import "../assets/css/UserDashboard.css"; // your shared sidebar CSS

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <span className={`sidebar-title ${collapsed ? "hidden" : ""}`}>User Panel</span>
          <button
            className="toggle-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard/home" end>
                <FaTachometerAlt /> {!collapsed && "Dashboard"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/payments">
                <FaMoneyBill /> {!collapsed && "Payments"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/notifications">
                <FaBell /> {!collapsed && "Notifications"}
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile">
                <FaUser /> {!collapsed && "Profile"}
              </NavLink>
            </li>
          </ul>
          <div
            className="logout"
            style={{ marginTop: "20px", color: "white" }}
            onClick={handleLogout}
          >
            <FaSignOutAlt /> {!collapsed && "Logout"}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
