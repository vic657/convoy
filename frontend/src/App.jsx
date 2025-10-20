import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import "@fortawesome/fontawesome-free/css/all.min.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
