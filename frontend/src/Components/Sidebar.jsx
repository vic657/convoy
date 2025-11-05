import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaHome,FaBell, FaBoxOpen, FaChartLine, FaCog, FaBars, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${sidebarOpen ? "visible" : "hidden"}`}>Convoy Admin</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-button">
          <FaBars />
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard">
              <FaHome /> {sidebarOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <FaUsers /> {sidebarOpen && <span>Users</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/programs">
              <FaBoxOpen /> {sidebarOpen && <span>Programs</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reports">
              <FaChartLine /> {sidebarOpen && <span>Reports</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reports">
              <FaBell /> {sidebarOpen && <span>Notifications</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">
              <FaCog /> {sidebarOpen && <span>Settings</span>}
            </NavLink>
          </li>
          <li onClick={handleLogout} className="logout">
            <FaSignOutAlt /> {sidebarOpen && <span>Logout</span>}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
