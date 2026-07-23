import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const backgrounds = ['/dresses.jpeg', '/ladies.jpeg', '/rubber.jpeg', '/shoes.jpeg', '/perfume.png'];
  const [bgIndex, setBgIndex] = useState(0);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-cycle background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Pointing directly to your Render backend deployment
      const response = await fetch('https://triple-crown-4a9k.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Strip out the password before saving user details locally
        const safeUser = { ...data.user };
        delete safeUser.password;

        localStorage.setItem('user', JSON.stringify(safeUser));
        navigate('/dashboard');
      } else {
        const errorText = await response.text();
        
        if (response.status === 403) {
          setErrorMsg("Please verify your email first.");
        } else {
          setErrorMsg(errorText || "No account found");
        }
      }
    } catch (err) {
      console.error("Connection error:", err);
      setErrorMsg("Server connection failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${backgrounds[bgIndex]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000000',
      transition: 'background-image 1s ease-in-out',
      position: 'relative',
      boxSizing: 'border-box',
      padding: '20px'
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      zIndex: 1
    },
    loginCard: {
      position: 'relative',
      zIndex: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '20px',
      padding: 'clamp(25px, 5vw, 50px)',
      width: '100%',
      maxWidth: '420px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#FFF',
      boxSizing: 'border-box',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    },
    logo: { 
      height: 'clamp(70px, 15vw, 100px)', 
      marginBottom: '15px', 
      objectFit: 'contain' 
    },
    title: { 
      color: '#D4AF37', 
      fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
      marginBottom: '20px',
      textAlign: 'center'
    },
    input: { 
      padding: '14px 18px', 
      borderRadius: '30px', 
      border: '1px solid rgba(255, 255, 255, 0.3)', 
      backgroundColor: 'rgba(0, 0, 0, 0.3)', 
      color: '#FFF', 
      width: '100%', 
      marginBottom: '15px', 
      boxSizing: 'border-box',
      fontSize: '1rem',
      outline: 'none'
    },
    button: { 
      padding: '14px', 
      backgroundColor: '#D4AF37', 
      border: 'none', 
      borderRadius: '30px', 
      color: '#000', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      width: '100%',
      fontSize: '1rem',
      transition: 'opacity 0.2s',
      opacity: loading ? 0.7 : 1
    },
    errorText: { 
      color: '#ff6b6b', 
      fontSize: '0.9rem', 
      marginBottom: '15px', 
      textAlign: 'center', 
      fontWeight: 'bold' 
    }
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
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.input} 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;