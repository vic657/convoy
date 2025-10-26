import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => (
  <div>
    <h2>Profile Information</h2>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <FaUserCircle style={{ fontSize: "3rem", color: "#9ca3af" }} />
      <div>
        <h3>John Doe</h3>
        <p>john@example.com</p>
      </div>
    </div>
  </div>
);

export default Profile;
