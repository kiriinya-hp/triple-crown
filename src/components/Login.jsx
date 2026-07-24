import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const backgrounds = ['/dresses.jpeg', '/ladies.jpeg', '/rubber.jpeg', '/shoes.jpeg', '/perfume.png'];
  const [bgIndex, setBgIndex] = useState(0);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Flow states: 'login' | 'verify' | 'forgot' | 'reset'
  const [viewMode, setViewMode] = useState('login'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const API_URL = 'https://triple-crown-4a9k.onrender.com';

  // Auto-cycle background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // 1. Handle Regular Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        const safeUser = { ...data.user };
        delete safeUser.password;
        localStorage.setItem('user', JSON.stringify(safeUser));
        navigate('/dashboard');
      } else {
        const errorText = await response.text();
        if (response.status === 403) {
          setViewMode('verify');
          setErrorMsg("Please verify your email to continue.");
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

  // 2. Handle Verification Code Submission from Login
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: verificationCode })
      });

      if (response.ok) {
        setSuccessMsg("Email verified successfully! You can now log in.");
        setViewMode('login');
        setVerificationCode('');
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || "Invalid verification code.");
      }
    } catch (err) {
      setErrorMsg("Server error during verification.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Request Password Reset Code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (response.ok) {
        setSuccessMsg("Password reset code sent to your email!");
        setViewMode('reset');
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || "Email not found.");
      }
    } catch (err) {
      setErrorMsg("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit New Password with Code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: verificationCode, newPassword })
      });

      if (response.ok) {
        setSuccessMsg("Password reset successfully! Please log in.");
        setViewMode('login');
        setVerificationCode('');
        setNewPassword('');
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || "Invalid code or expired.");
      }
    } catch (err) {
      setErrorMsg("Server error during password reset.");
    } finally {
      setLoading(false);
    }
  };

  // Resend Code Utility
  const handleResendCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const text = await response.text();
      setSuccessMsg(text);
    } catch (err) {
      setErrorMsg("Failed to resend code.");
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
      backgroundColor: '#000000', 
      transition: 'background-image 1s ease-in-out', 
      position: 'relative', 
      padding: '16px', 
      boxSizing: 'border-box'
    },
    overlay: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      zIndex: 1 
    },
    loginCard: {
      position: 'relative', 
      zIndex: 2, 
      background: 'rgba(20, 20, 20, 0.75)', 
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)', 
      border: '1px solid rgba(255, 255, 255, 0.15)', 
      borderRadius: '24px',
      padding: 'clamp(24px, 5vw, 40px)', 
      width: '100%', 
      maxWidth: '400px', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      color: '#FFF', 
      boxSizing: 'border-box', 
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    },
    logo: { 
      height: 'clamp(60px, 12vw, 85px)', 
      marginBottom: '12px', 
      objectFit: 'contain' 
    },
    title: { 
      color: '#D4AF37', 
      fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', 
      marginBottom: '15px', 
      textAlign: 'center',
      fontWeight: '700'
    },
    subtitle: { 
      fontSize: '0.85rem', 
      textAlign: 'center', 
      marginBottom: '15px', 
      color: '#ccc',
      lineHeight: '1.4'
    },
    input: {
      padding: '12px 16px', 
      borderRadius: '12px', 
      border: '1px solid rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      color: '#FFF', 
      width: '100%', 
      marginBottom: '14px',
      boxSizing: 'border-box', 
      fontSize: '16px', // Prevents iOS auto-zoom on input focus
      outline: 'none'
    },
    button: {
      padding: '14px', 
      backgroundColor: '#D4AF37', 
      border: 'none', 
      borderRadius: '12px',
      color: '#000', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      width: '100%', 
      fontSize: '1rem',
      marginTop: '4px', 
      opacity: loading ? 0.7 : 1,
      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
    },
    linkText: { 
      color: '#D4AF37', 
      fontSize: '0.85rem', 
      cursor: 'pointer', 
      marginTop: '14px', 
      textAlign: 'center', 
      background: 'none', 
      border: 'none',
      textDecoration: 'underline'
    },
    errorText: { 
      color: '#ff6b6b', 
      fontSize: '0.85rem', 
      marginBottom: '14px', 
      textAlign: 'center', 
      fontWeight: '600',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      padding: '8px',
      borderRadius: '8px',
      width: '100%',
      boxSizing: 'border-box'
    },
    successText: { 
      color: '#4cd137', 
      fontSize: '0.85rem', 
      marginBottom: '14px', 
      textAlign: 'center', 
      fontWeight: '600',
      backgroundColor: 'rgba(76, 209, 55, 0.1)',
      padding: '8px',
      borderRadius: '8px',
      width: '100%',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.loginCard}>
        <img src="/logo.jpeg" alt="Triple Crown Logo" style={styles.logo} />
        
        {/* VIEW 1: LOGIN */}
        {viewMode === 'login' && (
          <>
            <h2 style={styles.title}>Sign In</h2>
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
            {successMsg && <p style={styles.successText}>{successMsg}</p>}

            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <input type="email" placeholder="Email Address" style={styles.input} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" style={styles.input} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Signing In...' : 'Log In'}</button>
            </form>

            <button onClick={() => { setViewMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }} style={styles.linkText}>
              Forgot Password?
            </button>
          </>
        )}

        {/* VIEW 2: UNVERIFIED -> ENTER CODE */}
        {viewMode === 'verify' && (
          <>
            <h2 style={styles.title}>Verify Email</h2>
            <p style={styles.subtitle}>Account unverified. Enter the code sent to <strong>{formData.email}</strong></p>
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
            {successMsg && <p style={styles.successText}>{successMsg}</p>}

            <form onSubmit={handleVerifyCode} style={{ width: '100%' }}>
              <input type="text" placeholder="Enter 6-digit Code" style={{ ...styles.input, textAlign: 'center', letterSpacing: '3px', fontSize: '1.2rem' }} required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Proceed'}</button>
            </form>

            <button onClick={handleResendCode} style={styles.linkText}>Resend Code</button>
            <button onClick={() => setViewMode('login')} style={{ ...styles.linkText, color: '#ccc', marginTop: '8px', textDecoration: 'none' }}>Back to Login</button>
          </>
        )}

        {/* VIEW 3: FORGOT PASSWORD -> REQUEST RESET CODE */}
        {viewMode === 'forgot' && (
          <>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your account email to receive a password reset code.</p>
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

            <form onSubmit={handleForgotPassword} style={{ width: '100%' }}>
              <input type="email" placeholder="Email Address" style={styles.input} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Sending Code...' : 'Send Reset Code'}</button>
            </form>

            <button onClick={() => setViewMode('login')} style={styles.linkText}>Back to Login</button>
          </>
        )}

        {/* VIEW 4: RESET PASSWORD -> ENTER CODE & NEW PASSWORD */}
        {viewMode === 'reset' && (
          <>
            <h2 style={styles.title}>New Password</h2>
            <p style={styles.subtitle}>Enter the code sent to your email and choose a new password.</p>
            {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}
            {successMsg && <p style={styles.successText}>{successMsg}</p>}

            <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
              <input type="text" placeholder="6-digit Reset Code" style={{ ...styles.input, textAlign: 'center', letterSpacing: '3px' }} required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              <input type="password" placeholder="New Password" style={styles.input} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
            </form>

            <button onClick={() => setViewMode('login')} style={styles.linkText}>Back to Login</button>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;