import React, { useState, useRef, useEffect } from 'react';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaPhoneAlt, FaEnvelope, FaEye, FaEyeSlash
} from 'react-icons/fa';
import CountryList from 'country-list-with-dial-code-and-flag';

const API_BASE = import.meta.env.VITE_API_BASE;
const countries = CountryList.getAll().sort((a, b) => a.name.localeCompare(b.name));

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    phone: '',
    passportId: '',
    password: '',
    confirmPassword: '',
  });

  const registerRef = useRef();
  const loginRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNationalityChange = (e) => {
    const selected = e.target.value;
    setFormData((prev) => ({ ...prev, nationality: selected }));
    const selectedCountry = countries.find((c) => c.name === selected);
    setCountryCode(selectedCountry?.dialCode || '');
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.name.trim()) newErrors.push("Name is required.");
    if (!formData.email.includes('@')) newErrors.push("Valid email is required.");
    if (!formData.nationality) newErrors.push("Nationality is required.");
    if (!formData.phone.trim()) newErrors.push("Phone number is required.");
    if (formData.password.length < 8) newErrors.push("Password must be at least 8 characters.");
    if (formData.password !== formData.confirmPassword) newErrors.push("Passwords do not match.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`${API_BASE}/v1/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setShowOtpModal(true);
        alert('OTP sent to your email. It will expire in 5 minutes.');
      } else {
        alert(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  // Step 2: Verify OTP and register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/v1/auth/verify-otp-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          email: formData.email,
          fullName: formData.name,
          nationality: formData.nationality,
          phone: `${countryCode}${formData.phone}`,
          passportId: formData.passportId,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        setShowOtpModal(false);
        setShowRegister(false);
        setOtp('');
        setFormData({
          name: '', email: '', nationality: '', phone: '',
          passportId: '', password: '', confirmPassword: ''
        });
      } else {
        alert(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <header>
      {/* top contact strip */}
      <div className="contact-strip">
        <div className="contact-left">
          <span><FaPhoneAlt /> +254 705 798 382</span>
          <span><FaEnvelope /> support@convoyofhope.com</span>
        </div>
        <div className="contact-right">
          <FaFacebookF /><FaTwitter /><FaInstagram /><FaLinkedinIn />
        </div>
      </div>

      {/* navbar */}
      <nav className="main-nav">
        <div className="logo">
          <h1>convoy of hope</h1>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">About us</a></li>
          <li><button onClick={() => setShowRegister(true)}>Register</button></li>
          <li><button onClick={() => setShowLogin(true)}>Login</button></li>
        </ul>
      </nav>

      {/* Registration Modal */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content" ref={registerRef}>
            <h2>Register</h2>
            <form onSubmit={handleSendOtp}>
              {errors.length > 0 && (
                <div className="alert-danger">
                  <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                </div>
              )}
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input type="text" name="passportId" placeholder="Passport ID" value={formData.passportId} onChange={handleChange} />

              <select name="nationality" value={formData.nationality} onChange={handleNationalityChange}>
                <option value="">Select Nationality</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>{country.flag} {country.name}</option>
                ))}
              </select>

              <input type="text" name="phone" placeholder={`Phone (${countryCode})`} value={formData.phone} onChange={handleChange} />

              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
                  value={formData.password} onChange={handleChange} />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password"
                  value={formData.confirmPassword} onChange={handleChange} />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit">Send OTP</button>
            </form>
            <button className="close-btn" onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verify OTP</h3>
            <p>Enter the 6-digit code sent to your email.</p>
            <form onSubmit={handleVerifyOtp}>
              <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
              <button type="submit">Verify & Register</button>
            </form>
            <button onClick={() => setShowOtpModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
