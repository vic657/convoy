import React from "react";

const PaymentHistory = () => {
  return (
    <div>
      <h2>Payment History</h2>
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
            <td>Food Drive</td>
            <td>$50</td>
            <td>Confirmed</td>
            <td>2025-10-10</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
