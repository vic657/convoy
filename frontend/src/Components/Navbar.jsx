import React, { useState } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      {/* Top Contact Strip */}
      <div className="contact-strip">
        <div className="contact-left">
          <span><FaPhoneAlt /> +254 705 798 382</span>
          <span><FaEnvelope /> support@convoyofhope.com</span>
          <span><FaPhoneAlt /> +254 705 798 382</span>
        </div>
        <div className="contact-right">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaLinkedinIn />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="logo">
          <h1>convoy of hope</h1>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </div>

        {/* Toggle Button */}
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Register</a></li>
          <li><a href="#">Login</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
