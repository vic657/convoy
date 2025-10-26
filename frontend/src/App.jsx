import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";

// Admin
import AdminLayout from "./Layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Users from "./pages/Users.jsx";
import Programs from "./pages/Programs.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

// User
import UserLayout from "./Layouts/UserLayout.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import PaymentHistory from "./pages/PaymentHistory.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* === Public Homepage === */}
        <Route path="/" element={<Homepage />} />

        {/* === Admin Layout with Nested Routes === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="programs" element={<Programs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect legacy admin path */}
        <Route
          path="/admindashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* === User Layout with Nested Routes === */}
        <Route path="/dashboard" element={<UserLayout />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<UserDashboard />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Redirect old user path */}
        <Route
  path="/userdashboard/*"
  element={<Navigate to="/dashboard/home" replace />}
/>

      </Routes>
    </Router>
  );
}

export default App;
