import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaPhoneAlt, FaEnvelope, FaEye, FaEyeSlash, FaUserCircle
} from 'react-icons/fa';
import CountryList from 'country-list-with-dial-code-and-flag';
import axios from '../axios';
import ReCAPTCHA from 'react-google-recaptcha';

const API_BASE = import.meta.env.VITE_API_BASE;
const countries = CountryList.getAll().sort((a, b) => a.name.localeCompare(b.name));

const Navbar = () => {
  const navigate = useNavigate();

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
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', nationality: '', phone: '',
    passportId: '', password: '', confirmPassword: ''
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!recaptchaToken) {
      setLoginError('Please complete the CAPTCHA.');
      return;
    }
    try {
      const res = await axios.post('/login', {
        email: loginData.email,
        password: loginData.password,
        recaptcha_token: recaptchaToken,
      });
      const { token, user } = res.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user)); // Save user info
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      alert(`Welcome back, ${user.name}`);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
      setRecaptchaToken('');

      if (user.role === 'admin') navigate('/admindashboard');
      else navigate('/userdashboard');

    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/');
    window.location.reload(); // optional: reload to reset navbar state
  };

  const user = JSON.parse(localStorage.getItem('auth_user')); // Detect logged-in user

  return (
    <header>
      {/* Contact strip */}
      <div className="contact-strip">
        <div className="contact-left">
          <span><FaPhoneAlt /> +254 705 798 382</span>
          <span><FaEnvelope /> support@convoyofhope.com</span>
        </div>
        <div className="contact-right">
          <FaFacebookF /><FaTwitter /><FaInstagram /><FaLinkedinIn />
        </div>
      </div>

      {/* Navbar */}
      <nav className="main-nav">
        <div className="logo">
          <h1 style={{ margin: 0, color: '#EA580C', fontWeight: '800' }}>convoy of hope</h1>
          <p>Delivering food, supplies, and hope to communities in need.</p>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#impact">Impact</a></li>
          <li><a href="#programs">Programs</a></li>
          <li><a href="#volunteer">Volunteer</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>

          {/* Conditional Buttons */}
          {!user ? (
            <>
              <li style={{ listStyle: 'none' }}>
                <button
                  onClick={() => setShowLogin(true)}
                  style={{
                    background: '#EA580C',
                    color: 'white',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f97316';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 10px rgba(234,88,12,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#EA580C';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Donate
                </button>
              </li>

              <li style={{ listStyle: 'none' }}>
                <button
                  onClick={() => setShowRegister(true)}
                  style={{
                    background: 'transparent',
                    color: '#EA580C',
                    border: '2px solid #EA580C',
                    padding: '0.45rem 1.1rem',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#EA580C';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 10px rgba(234,88,12,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#EA580C';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Register
                </button>
              </li>
            </>
          ) : (
            <li style={{ listStyle: 'none', marginLeft: 'auto' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                }}
              >
                <FaUserCircle size={24} />
                <span>{user.name}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#EA580C',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>
      </nav>

      {/* Registration Modal */}
      {showRegister && (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && setShowRegister(false)} tabIndex={0}>
          <div className="modal-content" ref={registerRef}>
            <button onClick={() => setShowRegister(false)} className="close-circle">✕</button>
            <h2 className="modal-title">Register</h2>
            <form onSubmit={handleSendOtp}>
              {errors.length > 0 && <div className="alert-danger"><ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul></div>}
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input type="text" name="passportId" placeholder="Passport ID" value={formData.passportId} onChange={handleChange} />
              <select name="nationality" value={formData.nationality} onChange={handleNationalityChange}>
                <option value="">Select Nationality</option>
                {countries.map((country) => <option key={country.name} value={country.name}>{country.flag} {country.name}</option>)}
              </select>
              <input type="text" name="phone" placeholder={`Phone (${countryCode})`} value={formData.phone} onChange={handleChange} />
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              <button type="submit" className="primary-btn">Send OTP</button>
            </form>
            <p className="switch-text">
              Already have an account?{" "}
              <span className="switch-link" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</span>
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && setShowLogin(false)} tabIndex={0}>
          <div className="modal-content" ref={loginRef}>
            <button onClick={() => setShowLogin(false)} className="close-circle">✕</button>
            <h2 className="modal-title">Login</h2>
            <form onSubmit={handleLogin}>
              {loginError && <div className="alert-danger">{loginError}</div>}
              <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              <ReCAPTCHA sitekey="6LdSJO4rAAAAANyIPzklLXiG0HP6RF_Giktqt1pb" onChange={(token) => setRecaptchaToken(token)} />
              <button type="submit" className="primary-btn">Login</button>
            </form>
            <p className="switch-text">
              Don’t have an account?{" "}
              <span className="switch-link" onClick={() => { setShowLogin(false); setShowRegister(true); }}>Register</span>
            </p>
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
