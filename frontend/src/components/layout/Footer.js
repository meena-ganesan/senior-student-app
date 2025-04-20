import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Student-Senior Connect</h3>
          <p className="footer-description">
            Connecting high school students with seniors in the community to help with daily chores and foster intergenerational relationships.
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/register" className="footer-link">Sign Up</Link></li>
            <li><Link to="/login" className="footer-link">Login</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <p className="contact-info">Email: info@studentseniorconnect.org</p>
          <p className="contact-info">Phone: (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; {currentYear} Student-Senior Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
