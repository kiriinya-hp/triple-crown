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

  const [viewMode, setViewMode] = useState('login'); 
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://triple-crown-4a9k.onrender.com';

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

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
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userEmail', data.user.email);
        sessionStorage.setItem('isVerified', data.user.verified ? 'true' : 'false');
        
        const safeUser = { ...data.user };
        delete safeUser.password;
        sessionStorage.setItem('user', JSON.stringify(safeUser));
        
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
      setErrorMsg("Server connection failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

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
    title: { color: '#D4AF37', fontSize: '1.4rem', marginBottom: '15px', fontWeight: '700', textAlign: 'center' },
    subtitle: { fontSize: '0.85rem', textAlign: 'center', marginBottom: '15px', color: '#ccc', lineHeight: '1.4' },
    input: {
      padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.25)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)', color: '#FFF', width: '100%', marginBottom: '14px',
      boxSizing: 'border-box', fontSize: '16px', outline: 'none'
    },
    button: {
      padding: '14px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '12px',
      color: '#000', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1rem',
      marginTop: '4px', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
    },
    linkText: { 
      color: '#D4AF37', fontSize: '0.85rem', cursor: 'pointer', marginTop: '14px', 
      textAlign: 'center', background: 'none', border: 'none', textDecoration: 'underline' 
    },
    errorText: { 
      color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '14px', textAlign: 'center', 
      fontWeight: '600', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '8px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' 
    },
    successText: { 
      color: '#4cd137', fontSize: '0.85rem', marginBottom: '14px', textAlign: 'center', 
      fontWeight: '600', backgroundColor: 'rgba(76, 209, 55, 0.1)', padding: '8px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' 
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.cardContainer}>
        
        <div style={styles.topHeaderPanel}>
          <img src="/logo.jpeg" alt="Logo" style={styles.logo} />
          <h3 style={styles.headerTitle}>Hello, Welcome</h3>
          <p style={styles.headerSubtitle}>Don't have an Account?</p>
          <button style={styles.switchButtonOutline} onClick={() => navigate('/register')}>
            Register
          </button>
        </div>

        <div style={styles.formBody}>
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
    </div>
  );
};

export default Login;