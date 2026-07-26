import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle sticky blur effect on scroll & read session storage
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check session storage for logged in user state
    const checkUserSession = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser({ name: storedUser });
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkUserSession();

    // Listen to storage changes across tabs/components
    window.addEventListener('storage', checkUserSession);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkUserSession);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    closeMenu();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-brand-wrapper">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            {/* Integrated the uploaded custom logo image file */}
            <div className="logo-image-container">
              <img src="/logo.jpeg" alt="Triple Crown Fragrance and Design Logo" className="brand-logo-img" />
            </div>
          </Link>
        </div>
        
        {/* Desktop Links with Luxury Hover Indicators & Session State */}
        <div className="link-container">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`}>
            <span>Home</span>
            <div className="link-glint"></div>
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active-link' : ''}`}>
            <span>About</span>
            <div className="link-glint"></div>
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link nav-dashboard-pill ${isActive('/dashboard') ? 'active-pill' : ''}`}>
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="nav-auth-btn nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active-link' : ''}`}>
                <span>Login</span>
                <div className="link-glint"></div>
              </Link>
              <Link to="/register" className="nav-auth-btn nav-register-btn">
                <span>Register</span>
                <div className="btn-shimmer"></div>
              </Link>
            </>
          )}
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
          <div className="drawer-brand">
            <img src="/logo.jpeg" alt="Logo" className="drawer-logo-img" />
            <span>TRIPLE CROWN</span>
          </div>
          <button className="close-btn" onClick={closeMenu}>&times;</button>
        </div>
        <div className="drawer-links">
          <Link to="/" className={`drawer-link ${isActive('/') ? 'drawer-highlight' : ''}`} onClick={closeMenu}>
            <span className="drawer-icon">🏠</span> Home
          </Link>
          <Link to="/about" className={`drawer-link ${isActive('/about') ? 'drawer-highlight' : ''}`} onClick={closeMenu}>
            <span className="drawer-icon">ℹ️</span> About
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={`drawer-link ${isActive('/dashboard') ? 'drawer-highlight' : ''}`} onClick={closeMenu}>
                <span className="drawer-icon">📊</span> Dashboard
              </Link>
              <button onClick={handleLogout} className="drawer-auth-action logout-action">
                Logout Session
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`drawer-link ${isActive('/login') ? 'drawer-highlight' : ''}`} onClick={closeMenu}>
                <span className="drawer-icon">🔑</span> Login
              </Link>
              <Link to="/register" className={`drawer-link drawer-highlight`} onClick={closeMenu}>
                <span className="drawer-icon">✨</span> Register Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Ultra-Modern iOS/Android Inspired Floating Bottom Dock with Minimalist SVG Icons & Pill Active Indicator */}
      <div className="mobile-bottom-nav-container">
        <div className="mobile-bottom-nav">
          <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active-bottom-item' : ''}`} onClick={closeMenu}>
            <div className="bottom-icon-bubble">
              <svg className="bottom-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className="bottom-label">Home</span>
          </Link>

          <Link to="/about" className={`bottom-nav-item ${isActive('/about') ? 'active-bottom-item' : ''}`} onClick={closeMenu}>
            <div className="bottom-icon-bubble">
              <svg className="bottom-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <span className="bottom-label">About</span>
          </Link>

          {user ? (
            <Link to="/dashboard" className={`bottom-nav-item ${isActive('/dashboard') ? 'active-bottom-item' : ''}`} onClick={closeMenu}>
              <div className="bottom-icon-bubble">
                <svg className="bottom-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <span className="bottom-label">Dashboard</span>
            </Link>
          ) : (
            <Link to="/login" className={`bottom-nav-item ${isActive('/login') ? 'active-bottom-item' : ''}`} onClick={closeMenu}>
              <div className="bottom-icon-bubble">
                <svg className="bottom-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="bottom-label">Account</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 6%;
          background-color: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          color: #FFFFFF;
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-scrolled {
          padding: 10px 6%;
          background-color: rgba(2, 2, 2, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.45);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        }

        .nav-brand-wrapper {
          display: flex;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.02);
        }

        .logo-image-container {
          height: 48px;
          display: flex;
          align-items: center;
        }

        .brand-logo-img {
          height: 100%;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.35));
          border-radius: 6px;
        }

        .drawer-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          border-radius: 4px;
        }

        .link-container {
          display: none;
        }

        .hamburger-btn {
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          gap: 5px;
          padding: 0;
          transition: all 0.3s ease;
        }

        .hamburger-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
        }

        .bar {
          width: 20px;
          height: 2px;
          background-color: #D4AF37;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .bar.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .bar.open:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .bar.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          visibility: hidden;
          opacity: 0;
          transition: all 0.4s ease-in-out;
          z-index: 1001;
          backdrop-filter: blur(5px);
        }

        .mobile-overlay.active {
          visibility: visible;
          opacity: 1;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -320px;
          width: 300px;
          height: 100%;
          background-color: #0b0b0b;
          border-left: 1px solid rgba(212, 175, 55, 0.35);
          transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1002;
          display: flex;
          flex-direction: column;
          box-shadow: -15px 0 40px rgba(0,0,0,0.8);
        }

        .mobile-drawer.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #D4AF37;
          font-weight: 700;
          font-size: 1rem;
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 1px;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #D4AF37;
          font-size: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        .drawer-links {
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 12px;
        }

        .drawer-link {
          color: #E0E0E0;
          text-decoration: none;
          font-size: 1.05rem;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .drawer-link:hover {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateX(4px);
        }

        .drawer-highlight {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(158, 129, 37, 0.1) 100%);
          border-color: rgba(212, 175, 55, 0.4);
          color: #f7e2a0;
        }

        .drawer-auth-action {
          margin-top: 10px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          text-align: center;
          background: rgba(255, 50, 50, 0.15);
          color: #ff6b6b;
          border: 1px solid rgba(255, 50, 50, 0.3);
          transition: all 0.3s;
        }

        .drawer-auth-action:hover {
          background: rgba(255, 50, 50, 0.25);
        }

        /* Ultra-Modern Floating Bottom Nav Bar */
        .mobile-bottom-nav-container {
          position: fixed;
          bottom: 18px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 999;
          pointer-events: none;
          padding: 0 16px;
        }

        .mobile-bottom-nav {
          pointer-events: auto;
          background: rgba(12, 12, 12, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          max-width: 360px;
          padding: 6px 8px;
          border-radius: 40px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.12);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #8c8c8c;
          text-decoration: none;
          gap: 2px;
          padding: 6px 12px;
          border-radius: 30px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .bottom-icon-bubble {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .bottom-svg-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .bottom-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          opacity: 0.85;
          transition: opacity 0.3s ease;
        }

        .bottom-nav-item:hover {
          color: #D4AF37;
        }

        .active-bottom-item {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.14);
        }

        .active-bottom-item .bottom-icon-bubble {
          background: rgba(212, 175, 55, 0.2);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
        }

        .active-bottom-item .bottom-svg-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.6));
        }

        @media (min-width: 768px) {
          .hamburger-btn, .mobile-drawer, .mobile-overlay, .mobile-bottom-nav-container {
            display: none !important;
          }
          
          .link-container {
            display: flex;
            align-items: center;
            gap: 28px;
          }

          .nav-link {
            position: relative;
            color: #d0d0d0;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            padding: 6px 0;
            transition: color 0.3s ease;
          }

          .nav-link:hover, .active-link {
            color: #D4AF37;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #D4AF37;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 8px #D4AF37;
          }

          .nav-link:hover::after, .active-link::after {
            width: 100%;
          }

          .nav-dashboard-pill {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.4);
            padding: 8px 18px;
            border-radius: 30px;
            color: #f7e2a0 !important;
            transition: all 0.3s ease;
          }

          .nav-dashboard-pill::after {
            display: none;
          }

          .nav-dashboard-pill:hover, .active-pill {
            background: rgba(212, 175, 55, 0.22) !important;
            border-color: #D4AF37 !important;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.25);
          }

          .nav-auth-btn {
            position: relative;
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            letter-spacing: 0.5px;
            overflow: hidden;
          }

          .nav-register-btn {
            background: linear-gradient(135deg, #f3c643 0%, #D4AF37 50%, #9e8125 100%);
            color: #050505;
            border: 1px solid #D4AF37;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          }

          .nav-register-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            filter: brightness(1.05);
          }

          .btn-shimmer {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              to right,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.35) 50%,
              rgba(255,255,255,0) 100%
            );
            transform: rotate(30deg) translateX(-100%);
            transition: transform 0.6s ease-in-out;
          }

          .nav-register-btn:hover .btn-shimmer {
            transform: rotate(30deg) translateX(100%);
          }

          .nav-logout-btn {
            background: rgba(255, 50, 50, 0.1);
            color: #ff6b6b;
            border: 1px solid rgba(255, 50, 50, 0.3);
          }

          .nav-logout-btn:hover {
            background: rgba(255, 50, 50, 0.25);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 50, 50, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;