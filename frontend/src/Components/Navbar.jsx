import React, { useState, useRef, useEffect } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import CountryList from 'country-list-with-dial-code-and-flag';

const API_BASE = import.meta.env.VITE_API_BASE;
const countries = CountryList.getAll().sort((a, b) => a.name.localeCompare(b.name));

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    phone: '',
    passportId: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);

  const registerRef = useRef();
  const loginRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showRegister && registerRef.current && !registerRef.current.contains(e.target)) {
        setShowRegister(false);
      }
      if (showLogin && loginRef.current && !loginRef.current.contains(e.target)) {
        setShowLogin(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRegister, showLogin]);

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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!formData.name.trim()) newErrors.push("Name is required.");
    if (!formData.email.includes('@')) newErrors.push("Valid email is required.");
    if (!formData.nationality) newErrors.push("Nationality is required.");
    if (!formData.phone.trim()) newErrors.push("Phone number is required.");
    if (formData.password.length < 8) newErrors.push("Password must be at least 8 characters.");
    if (formData.password !== formData.confirmPassword) newErrors.push("Passwords do not match.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          nationality: formData.nationality,
          phone: `${countryCode}${formData.phone}`,
          passportId: formData.passportId,
          password: formData.password,
        }),
      });

      if (res.ok) {
        alert("Registration successful!");
        setShowRegister(false);
        setFormData({
          fullName: '',
          email: '',
          nationality: '',
          phone: '',
          passportId: '', 
          password: '',
          confirmPassword: '',
        });
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (res.ok) {
        alert("Login successful!");
        setShowLogin(false);
        setLoginData({ email: '', password: '' });
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  return (
    <header>
      <div className="contact-strip">
        <div className="contact-left">
          <span><FaPhoneAlt /> +254 705 798 382</span>
          <span><FaEnvelope /> support@convoyofhope.com</span>
        </div>
        <div className="contact-right">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaLinkedinIn />
        </div>
      </div>

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

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content" ref={registerRef}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              {errors.length > 0 && (
                <div className="alert-danger">
                  <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                </div>
              )}
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input
                type="text"
                name="passportId"
                placeholder="Passport ID"
                value={formData.passportId}
                onChange={handleChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />

              <select name="nationality" value={formData.nationality} onChange={handleNationalityChange}>
                <option value="">Select Nationality</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.flag} {country.name}
                  </option>
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
              <button type="submit">Register</button>
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
              <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
                            <button type="submit">Login</button>
            </form>
            <button className="close-btn" onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
