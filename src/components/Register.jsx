import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const backgrounds = ['/dresses.jpeg', '/ladies.jpeg', '/rubber.jpeg', '/shoes.jpeg', '/perfume.png'];
  const [bgIndex, setBgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  
  // State to manage email verification step
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Use environment variable if available, fallback to live Render URL (or localhost for local dev if needed)
  const API_URL = import.meta.env.VITE_API_URL || 'https://triple-crown-4a9k.onrender.com';

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const styles = {
    pageContainer: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `url(${backgrounds[bgIndex]})`, backgroundSize: 'auto 120%',
      backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#000000',
      transition: 'background-image 1s ease-in-out', position: 'relative'
    },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    card: {
      position: 'relative', background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: '20px',
      padding: '40px', width: '90%', maxWidth: '400px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#FFF'
    },
    logo: { height: '100px', marginBottom: '20px', objectFit: 'contain' },
    title: { color: '#D4AF37', fontSize: '2rem', marginBottom: '20px' },
    subtitle: { fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px', color: '#ccc' },
    inputGroup: { position: 'relative', width: '100%', marginBottom: '15px' },
    input: {
      padding: '15px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.2)', color: '#FFF', width: '100%', boxSizing: 'border-box'
    },
    eyeIcon: { position: 'absolute', right: '20px', top: '15px', cursor: 'pointer', color: '#FFF' },
    button: {
      padding: '15px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '30px',
      color: '#000', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px'
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

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
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <img src="/logo.jpeg" alt="Logo" style={styles.logo} />
        
        {!isVerifying ? (
          <>
            <h2 style={styles.title}>Sign Up</h2>
            <form onSubmit={handleRegister} style={{ width: '100%' }}>
              <input type="text" placeholder="Full Name" style={styles.input} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" style={styles.input} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone Number" style={styles.input} required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              
              <div style={styles.inputGroup}>
                <input type={showPassword ? "text" : "password"} placeholder="Password" style={styles.input} required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              
              <input type="password" placeholder="Confirm Password" style={styles.input} required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
              <button type="submit" style={styles.button}>Register</button>
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
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem' }} 
                required 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
              <button type="submit" style={styles.button}>Verify Code</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;