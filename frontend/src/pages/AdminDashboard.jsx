import React from "react";

const Dashboard = () => {
  const users = 12;
  const programs = 5;
  const reports = 3;

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats">
        <div className="card"><h3>Users</h3><p>{users}</p></div>
        <div className="card"><h3>Programs</h3><p>{programs}</p></div>
        <div className="card"><h3>Reports</h3><p>{reports}</p></div>
      </div>
    </div>
  );
};

export default Dashboard;
