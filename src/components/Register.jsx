import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const backgrounds = ['/dresses.jpeg', '/ladies.jpeg', '/rubber.jpeg', '/shoes.jpeg', '/perfume.png'];
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://triple-crown-4a9k.onrender.com';

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const styles = {
    pageContainer: {
      minHeight: 'calc(100vh - 70px)', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundImage: `url(${backgrounds[bgIndex]})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundColor: '#000000', 
      transition: 'background-image 1s ease-in-out', 
      position: 'relative', 
      padding: '20px 16px', 
      boxSizing: 'border-box',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw'
    },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1 },
    cardContainer: {
      position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px',
      background: 'rgba(20, 20, 20, 0.85)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
      display: 'flex', flexDirection: 'column', color: '#FFF', boxSizing: 'border-box'
    },
    topHeaderPanel: {
      background: 'linear-gradient(135deg, #0b2531 0%, #000000 100%)',
      padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px'
    },
    logo: { height: '50px', marginBottom: '10px', objectFit: 'contain' },
    headerTitle: { color: '#FFF', fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' },
    headerSubtitle: { color: '#ccc', fontSize: '0.85rem', marginBottom: '15px' },
    switchButtonOutline: {
      backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37',
      padding: '8px 24px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer'
    },
    formBody: { padding: '25px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    title: { color: '#D4AF37', fontSize: '1.4rem', marginBottom: '15px', fontWeight: '700' },
    subtitle: { fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px', color: '#ccc' },
    inputGroup: { position: 'relative', width: '100%', marginBottom: '14px' },
    input: {
      padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)', color: '#FFF', width: '100%', boxSizing: 'border-box',
      fontSize: '15px', outline: 'none'
    },
    eyeIcon: { position: 'absolute', right: '16px', top: '14px', cursor: 'pointer', color: '#ccc' },
    button: {
      padding: '14px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '12px',
      color: '#000', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '6px',
      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          password: formData.password 
        })
      });

      if (response.ok) {
        alert("Registration successful! Please check your email for the verification code.");
        setIsVerifying(true);
      } else {
        const errorText = await response.text();
        alert(errorText || "Registration failed. Please try again.");
      }
    } catch (err) { 
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: verificationCode 
        })
      });

      if (response.ok) {
        alert("Email verified successfully! You can now log in.");
        navigate('/login');
      } else {
        const errorText = await response.text();
        alert(errorText || "Invalid or expired verification code.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.cardContainer}>
        
        <div style={styles.topHeaderPanel}>
          <img src="/logo.jpeg" alt="Logo" style={styles.logo} />
          <h3 style={styles.headerTitle}>Welcome Back!</h3>
          <p style={styles.headerSubtitle}>Already have an account?</p>
          <button style={styles.switchButtonOutline} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>

        <div style={styles.formBody}>
          {!isVerifying ? (
            <>
              <h2 style={styles.title}>Create Account</h2>
              <form onSubmit={handleRegister} style={{ width: '100%' }}>
                <div style={styles.inputGroup}>
                  <input type="text" placeholder="Full Name" style={styles.input} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                  <input type="email" placeholder="Email Address" style={styles.input} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div style={styles.inputGroup}>
                  <input type="tel" placeholder="Phone Number" style={styles.input} required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div style={styles.inputGroup}>
                  <input type={showPassword ? "text" : "password"} placeholder="Password" style={styles.input} required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
                
                <div style={styles.inputGroup}>
                  <input type="password" placeholder="Confirm Password" style={styles.input} required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
                
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? "Connecting to server..." : "Sign Up"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Verify Email</h2>
              <p style={styles.subtitle}>Enter the verification code sent to <strong>{formData.email}</strong></p>
              <form onSubmit={handleVerifyCode} style={{ width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Enter Verification Code" 
                  style={{ ...styles.input, textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem', marginBottom: '14px' }} 
                  required 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)} 
                />
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Register;
