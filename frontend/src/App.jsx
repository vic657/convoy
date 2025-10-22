import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Users from "./pages/Users.jsx";
import Programs from "./pages/Programs.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/userdashboard" element={<UserDashboard />} />

        {/* Admin layout with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="programs" element={<Programs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect old /admindashboard path to new structure */}
        <Route path="/admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
