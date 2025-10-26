// src/Components/UserSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaMoneyBill, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../assets/css/UserSidebar.css";

const UserSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="user-sidebar">
      <h2 className="sidebar-title">User Panel</h2>
      <nav className="sidebar-nav">
        <NavLink to="/user/dashboard" className="sidebar-link">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/user/payments" className="sidebar-link">
          <FaMoneyBill /> Payments
        </NavLink>
        <NavLink to="/user/notifications" className="sidebar-link">
          <FaBell /> Notifications
        </NavLink>
        <NavLink to="/user/profile" className="sidebar-link">
          <FaUserCircle /> Profile
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default UserSidebar;
