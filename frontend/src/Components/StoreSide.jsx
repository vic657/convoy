import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const StoreSide = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${!sidebarOpen ? "hidden" : ""}`}>
          Store Panel
        </h2>
        <button
          className="toggle-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/storedashboard"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaChartLine />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
                to="/storedashboard/donations"
                className={({ isActive }) => (isActive ? "active" : "")}
                >
                <FaBoxOpen />
                {sidebarOpen && <span>Donation Tracking</span>}
                </NavLink>

          </li>
          <li>
            <NavLink
              to="/storedashboard/noncash"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaShoppingCart />
              {sidebarOpen && <span>noncash donations</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/storedashboard/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCog />
              {sidebarOpen && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>

        <button className="logout">
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default StoreSide;
