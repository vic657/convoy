import React, { useState, useRef } from 'react';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaPhoneAlt, FaEnvelope, FaEye, FaEyeSlash
} from 'react-icons/fa';
import CountryList from 'country-list-with-dial-code-and-flag';
import axios from '../axios';
import ReCAPTCHA from 'react-google-recaptcha';

const API_BASE = import.meta.env.VITE_API_BASE;
const countries = CountryList.getAll().sort((a, b) => a.name.localeCompare(b.name));

const Navbar = ({ navigate }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState([]);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', nationality: '', phone: '',
    passportId: '', password: '', confirmPassword: '',
  });

  const registerRef = useRef();
  // login modal refs/state (were missing and caused runtime ReferenceError)
  const loginRef = useRef();
  const [showLogin, setShowLogin] = useState(false);

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
        alert('OTP sent to your email. It will expire in 5 minutes.');
        setShowOtpModal(true);
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
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    alert(`Welcome back, ${user.name}`);
    setShowLogin(false);
    setLoginData({ email: '', password: '' });
    setRecaptchaToken(''); // optional: reset token
    navigate('/userdashboard');
  } catch (err) {
    console.error(err);
    setLoginError(err.response?.data?.error || 'Login failed');
  }
};


  return (
    <header>
      {/* Top contact strip */}
      {/* contact strip */}
      <div className="contact-strip">
        <div className="contact-left">
          <span><FaPhoneAlt /> +254 705 798 382</span>
          <span><FaEnvelope /> support@convoyofhope.com</span>
        </div>
        <div className="contact-right">
          <FaFacebookF /><FaTwitter /><FaInstagram /><FaLinkedinIn />
        </div>
      </div>

      {/* Navbar main section */}
      <nav className="main-nav">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <div className="logo" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h1 style={{ margin: 0, color: '#EA580C', fontWeight: '800' }}>Convoy of Hope</h1>
            <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>
              Delivering food, supplies, and hope to communities in need.
            </p>
          </div>

          {/* Hamburger menu */}
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Nav Links */}
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <li><a href="#home">Home</a></li>
            <li><a href="#impact">Impact</a></li>
            <li><a href="#programs">Programs</a></li>
            <li><a href="#volunteer">Volunteer</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>

            {/* Buttons neatly aligned with hover effects */}
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Donate Button */}
              <a
                href="#donate"
                className="btn-donate"
                style={{
                  background: '#EA580C',
                  color: 'white',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f97316'; // lighter orange
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
              </a>

              {/* Register Button */}
              <button
                className="btn-register"
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
          </ul>
        </div>
      </nav>

      {/* Register Modal */}
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
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" style={{ background: '#EA580C', color: 'white', padding: '0.6rem', borderRadius: '6px', width: '100%', fontWeight: '600' }}>
                Send OTP
              </button>
            </form>
            
            <button className="close-btn" onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}
{showLogin && (
  <div className="modal-overlay">
    <div className="modal-content" ref={loginRef}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      {loginError && <div className="alert-danger">{loginError}</div>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
      />

      <ReCAPTCHA
        sitekey="6LdSJO4rAAAAANyIPzklLXiG0HP6RF_Giktqt1pb"

        onChange={(token) => setRecaptchaToken(token)}
      />

      <button type="submit">Login</button>
    </form>
      <button className="close-btn" onClick={() => setShowLogin(false)}>Close</button>
    </div>
  </div>
)}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verify OTP</h3>
            <p>Enter the 6-digit code sent to your email.</p>
            <form onSubmit={handleVerifyOtp}>
              <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
              <button type="submit" style={{ background: '#EA580C', color: 'white', padding: '0.6rem', borderRadius: '6px', width: '100%', fontWeight: '600' }}>
                Verify & Register
              </button>
            </form>
            <button onClick={() => setShowOtpModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
