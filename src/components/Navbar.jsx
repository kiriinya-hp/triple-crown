import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">TRIPLE CROWN</div>
        
        {/* Desktop Links */}
        <div className="link-container">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Slide-out Menu Overlay & Drawer */}
      <div className={`mobile-overlay ${isOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span>Menu</span>
          <button className="close-btn" onClick={closeMenu}>&times;</button>
        </div>
        <div className="drawer-links">
          <Link to="/" className="drawer-link" onClick={closeMenu}>Home</Link>
          <Link to="/about" className="drawer-link" onClick={closeMenu}>About</Link>
          <Link to="/login" className="drawer-link" onClick={closeMenu}>Login</Link>
          <Link to="/register" className="drawer-link" onClick={closeMenu}>Register</Link>
        </div>
      </div>

      {/* Mobile App-like Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link to="/" className="bottom-nav-item" onClick={closeMenu}>
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/about" className="bottom-nav-item" onClick={closeMenu}>
          <span>ℹ️</span>
          <span>About</span>
        </Link>
        <Link to="/login" className="bottom-nav-item" onClick={closeMenu}>
          <span>👤</span>
          <span>Account</span>
        </Link>
      </div>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 5%;
          backgroundColor: #000000;
          borderBottom: 2px solid #D4AF37;
          color: #FFFFFF;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-logo {
          font-size: 1.2rem;
          font-weight: bold;
          letter-spacing: 2px;
          color: #D4AF37;
        }

        /* Hide desktop links by default on mobile */
        .link-container {
          display: none;
        }

        /* Hamburger button styling */
        .hamburger-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 5px;
        }

        .bar {
          width: 25px;
          height: 3px;
          background-color: #D4AF37;
          transition: 0.3s;
          border-radius: 2px;
        }

        /* Hamburger animation states */
        .bar.open:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .bar.open:nth-child(2) {
          opacity: 0;
        }
        .bar.open:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Slide-out Drawer for Mobile */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          visibility: hidden;
          opacity: 0;
          transition: 0.3s ease-in-out;
          z-index: 1001;
        }

        .mobile-overlay.active {
          visibility: visible;
          opacity: 1;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -280px;
          width: 280px;
          height: 100%;
          background-color: #111111;
          border-left: 2px solid #D4AF37;
          transition: 0.3s ease-in-out;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 15px rgba(0,0,0,0.5);
        }

        .mobile-drawer.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
          color: #D4AF37;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: #D4AF37;
          font-size: 1.8rem;
          cursor: pointer;
        }

        .drawer-links {
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 15px;
        }

        .drawer-link {
          color: #FFFFFF;
          text-decoration: none;
          font-size: 1.1rem;
          padding: 10px 0;
          border-bottom: 1px solid #222;
        }

        .drawer-link:hover {
          color: #D4AF37;
        }

        /* App-like Fixed Bottom Bar for Mobile */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #000000;
          border-top: 1px solid #333;
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          z-index: 999;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #FFFFFF;
          text-decoration: none;
          font-size: 0.75rem;
          gap: 2px;
        }

        .bottom-nav-item span:first-child {
          font-size: 1.2rem;
        }

        .bottom-nav-item:hover {
          color: #D4AF37;
        }

        {/* Desktop Media Query */}
        @media (min-width: 768px) {
          .navbar {
            padding: 20px 5%;
          }
          .nav-logo {
            font-size: 1.5rem;
          }
          .hamburger-btn, .mobile-drawer, .mobile-overlay, .mobile-bottom-nav {
            display: none !important;
          }
          .link-container {
            display: flex;
            gap: 25px;
          }
          .nav-link {
            color: #FFFFFF;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.2s;
          }
          .nav-link:hover {
            color: #D4AF37;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;