import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const backgrounds = ['/dresses.jpeg', '/ladies.jpeg', '/rubber.jpeg', '/shoes.jpeg', '/perfume.png'];
  const [bgIndex, setBgIndex] = useState(0);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-cycle background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Optional: Save user info if needed
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        // Parse the error message sent from the backend (/api/login)
        const errorText = await response.text();
        
        if (response.status === 403) {
          setErrorMsg("Please verify your email first.");
        } else {
          // If credentials don't match or user doesn't exist in users.json
          setErrorMsg("no account found");
        }
      }
    } catch (err) {
      console.error("Connection error:", err);
      setErrorMsg("Server connection failed. Ensure backend is running.");
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${backgrounds[bgIndex]})`,
      backgroundSize: 'auto 120%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000000',
      transition: 'background-image 1s ease-in-out',
      position: 'relative'
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    loginCard: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '20px',
      padding: '50px',
      width: '90%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#FFF'
    },
    logo: { 
      height: '100px', 
      marginBottom: '20px', 
      objectFit: 'contain' 
    },
    title: { color: '#D4AF37', fontSize: '2rem', marginBottom: '20px' },
    input: { 
        padding: '15px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.3)', 
        backgroundColor: 'rgba(0, 0, 0, 0.2)', color: '#FFF', width: '100%', marginBottom: '15px', boxSizing: 'border-box' 
    },
    button: { 
        padding: '15px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '30px', 
        color: '#000', fontWeight: 'bold', cursor: 'pointer', width: '100%' 
    },
    errorText: { color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.loginCard}>
        <img src="/logo.jpeg" alt="Triple Crown Logo" style={styles.logo} />
        
        <h2 style={styles.title}>Sign In</h2>
        
        {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input 
            type="email" 
            placeholder="Email" 
            style={styles.input} 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.input} 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" style={styles.button}>Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;