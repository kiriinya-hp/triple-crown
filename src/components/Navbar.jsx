import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 5%',
      backgroundColor: '#000000',
      borderBottom: '2px solid #D4AF37',
      color: '#FFFFFF'
    },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: '#D4AF37' },
    linkContainer: { display: 'flex', gap: '20px' },
    link: { color: '#FFFFFF', textDecoration: 'none', fontSize: '1rem' }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>TRIPLE CROWN</div>
      <div style={styles.linkContainer}>
        {/* Correctly mapped to routes in App.jsx */}
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;