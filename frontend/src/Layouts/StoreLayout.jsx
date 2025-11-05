import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StoreSide from "../Components/StoreSide"; // ✅ Make sure this path is correct
import "../assets/css/storelayout.css";
import Navbar from "../Components/Navbar";

const StoreLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">
        <Navbar />
      {/* ✅ Use the new StoreSide only */}
      <StoreSide sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "" : "collapsed"}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default StoreLayout;
