import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard">
      <Navbar onMenuClick={toggleSidebar} /> {/* Pass toggle to Navbar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <main className={`main-content ${sidebarOpen ? "" : "compact"}`}>

        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;
