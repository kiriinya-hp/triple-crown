import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const tagline = "Style that empowers. Beauty that lasts.";
  const description = "Experience the pinnacle of sophistication. From our Effortless Chic romper collection to our curated selection of Premium Arabic and Luxury perfumes, we bring you timeless elegance for the modern individual.";
  
  const orgDetails = [
    { label: "Established", value: "2026" },
    { label: "Specialty", value: "Luxury Fragrances & Designer Fashion" },
    { label: "Craftsmanship", value: "Curated Excellence" },
    { label: "Client Satisfaction", value: "100% Verified" }
  ];

  const allImages = [
    '/ladies.jpeg', 
    '/shoes.jpeg', 
    '/dresses.jpeg',
    '/perfume.png', 
    '/rubber.jpeg',
    '/club.jpg',
    '/brown r.jpeg',
    '/ameerat.jpeg',
    '/kali.jpg',
    '/lime.jpeg',
    '/yum.jpg',
    '/yara.jpeg'
  ];

  const getRandomIndex = (currentIndex) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * allImages.length);
    } while (newIndex === currentIndex);
    return newIndex;
  };

  const [windowIndices, setWindowIndices] = useState([0, 1, 2, 3, 4, 0]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const intervals = windowIndices.map((_, i) => {
      return setInterval(() => {
        setWindowIndices((prev) => {
          const next = [...prev];
          next[i] = getRandomIndex(next[i]);
          return next;
        });
      }, 3000 + (i * 800));
    });

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 800);
    }, 5000);

    return () => {
      intervals.forEach(clearInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleWhatsAppInquiry = (e, inquiryText) => {
    e.preventDefault();
    const loggedInUser = sessionStorage.getItem('user');
    const targetUrl = `https://wa.me/254799394055?text=${encodeURIComponent(inquiryText)}`;

    if (!loggedInUser) {
      setWhatsappUrl(targetUrl);
      setShowAuthModal(true);
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAuthRedirect = (isRegistering) => {
    setShowAuthModal(false);
    window.location.href = isRegistering ? '/register' : '/dashboard';
  };

  const handleDashboardAccess = (e) => {
    e.preventDefault();
    window.location.href = '/dashboard';
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="hero-section"
    >
      <div 
        className="hero-interactive-cursor-glow"
        style={{
          transform: `translate(${mousePos.x * 400}px, ${mousePos.y * 400}px)`
        }}
      ></div>

      <div className="hero-glow-bg glow-1"></div>
      <div className="hero-glow-bg glow-2"></div>
      <div className="hero-glow-bg glow-3"></div>

      <div className="hero-content">
        <span className="hero-badge">
          <span className="badge-pulse-dot"></span>
          Exclusive Luxury Collection
        </span>
        <h1 className="hero-title">Triple Crown Fragrance and Design</h1>
        <p className="hero-tagline">{tagline}</p>
        <p className="hero-description">{description}</p>
        
        <div className="hero-cta-group">
          <button onClick={handleDashboardAccess} className="hero-btn primary-btn">
            <span>Explore Collection</span>
            <div className="btn-shimmer"></div>
          </button>
          <button onClick={handleDashboardAccess} className="hero-btn secondary-btn">
            <span>Discover Fragrances</span>
          </button>
        </div>
      </div>
      
      <div className="hero-grid">
        {windowIndices.map((imgIndex, i) => (
          <div 
            key={i} 
            className={`hero-window window-card-${i + 1} ${isHovered === i ? 'window-active-hover' : ''}`}
            onMouseEnter={() => setIsHovered(i)}
            onMouseLeave={() => setIsHovered(null)}
            style={{ 
              animationDelay: `${i * 0.4}s`,
              transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`
            }}
          >
            <div className="hero-img-overlay"></div>
            <img src={allImages[imgIndex]} alt="Product showcase" className="hero-img" loading="lazy" />
            <div className="window-glint"></div>
            <div className="window-badge-tag">Featured 0{i + 1}</div>
          </div>
        ))}
      </div>

      <div className={`org-details-bar ${glitchActive ? 'glapgosirimm-pulse' : ''}`}>
        {orgDetails.map((item, idx) => (
          <div key={idx} className="org-detail-item">
            <span className="org-detail-label">{item.label}</span>
            <span className="org-detail-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="hero-general-inquiry">
        <a 
          href="#whatsapp" 
          onClick={(e) => handleWhatsAppInquiry(e, "Hello, I would like to inquire for more information regarding Triple Crown Fragrance and Design.")}
          className="hero-whatsapp-btn"
        >
          <span className="whatsapp-icon-wrapper">💬</span> Inquire for More Information via WhatsApp
        </a>
      </div>

      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setShowAuthModal(false)}>✕</button>
            <h3 className="modal-title">Account Registration Required</h3>
            <p className="modal-text">You must be registered and logged into an account to proceed with WhatsApp inquiries.</p>
            <div className="modal-actions">
              <button className="hero-btn primary-btn" onClick={() => handleAuthRedirect(true)}>Register Account</button>
              <button className="hero-btn secondary-btn" onClick={() => handleAuthRedirect(false)}>Already have an account? Login</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-section {
          min-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 80px 20px;
          background: radial-gradient(circle at 50% 20%, #1a1a1a 0%, #080808 55%, #000000 100%);
          color: #FFFFFF;
          text-align: center;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          perspective: 1200px;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        .hero-interactive-cursor-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1);
          z-index: 1;
          margin-left: -300px;
          margin-top: -300px;
        }

        .hero-glow-bg {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0, 0, 0, 0) 70%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
          filter: blur(50px);
        }

        .glow-1 { top: -150px; left: -100px; animation: pulseGlow 8s ease-in-out infinite alternate; }
        .glow-2 { bottom: -150px; right: -100px; animation: pulseGlow 8s ease-in-out infinite alternate-reverse; }
        .glow-3 { top: 40%; left: 30%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(0,0,0,0) 70%); }

        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0.9; }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          margin-bottom: 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #f7e2a0;
          background: rgba(212, 175, 55, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 30px;
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.12);
          backdrop-filter: blur(10px);
        }

        .badge-pulse-dot {
          width: 6px;
          height: 6px;
          background-color: #D4AF37;
          border-radius: 50%;
          box-shadow: 0 0 8px #D4AF37;
          animation: dotPulse 2s infinite;
        }

        @keyframes dotPulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 12px #D4AF37; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }

        .hero-title {
          background: linear-gradient(135deg, #fff 20%, #D4AF37 70%, #aa8c2c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          margin: 0 0 12px 0;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.5px;
          filter: drop-shadow(0 4px 25px rgba(212, 175, 55, 0.25));
        }

        .hero-tagline {
          font-style: italic;
          font-size: 1.2rem;
          margin-bottom: 18px;
          color: #e5e5e5;
          letter-spacing: 0.8px;
          font-weight: 300;
        }

        .hero-description {
          max-width: 780px;
          margin: 0 auto 35px auto;
          line-height: 1.7;
          font-size: 1.08rem;
          opacity: 0.85;
          padding: 0 15px;
          color: #cccccc;
        }

        .hero-cta-group {
          display: flex;
          justify-content: center;
          gap: 18px;
          margin-bottom: 35px;
          flex-wrap: wrap;
        }

        .hero-general-inquiry {
          margin-top: 35px;
          position: relative;
          z-index: 2;
        }

        .hero-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background-color: #25D366;
          color: #FFFFFF;
          border-radius: 35px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-whatsapp-btn:hover {
          background-color: #20ba5a;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.55);
        }

        .hero-btn {
          position: relative;
          padding: 14px 32px;
          border-radius: 35px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          letter-spacing: 0.8px;
          overflow: hidden;
        }

        .primary-btn {
          background: linear-gradient(135deg, #f3c643 0%, #D4AF37 50%, #9e8125 100%);
          color: #050505;
          border: 2px solid #D4AF37;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
        }

        .primary-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.55);
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
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: rotate(30deg) translateX(-100%);
          transition: transform 0.6s ease-in-out;
        }

        .primary-btn:hover .btn-shimmer {
          transform: rotate(30deg) translateX(100%);
        }

        .secondary-btn {
          background-color: rgba(15, 15, 15, 0.7);
          color: #FFFFFF;
          border: 2px solid rgba(212, 175, 55, 0.4);
          backdrop-filter: blur(10px);
        }

        .secondary-btn:hover {
          border-color: #D4AF37;
          background-color: rgba(212, 175, 55, 0.15);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.25);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 25px 0;
          max-width: 1250px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-window {
          height: 210px;
          border-radius: 18px;
          border: 2px solid rgba(212, 175, 55, 0.4);
          overflow: hidden;
          position: relative;
          animation: floatTranslate 6s ease-in-out infinite;
          background: #111;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.75);
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease-out;
          transform-style: preserve-3d;
        }

        .window-card-2 { animation-delay: 0.8s; }
        .window-card-3 { animation-delay: 1.6s; }
        .window-card-4 { animation-delay: 2.4s; }
        .window-card-5 { animation-delay: 3.2s; }
        .window-card-6 { animation-delay: 4.0s; }

        .hero-window:hover {
          border-color: #D4AF37;
          box-shadow: 0 20px 45px rgba(212, 175, 55, 0.45);
          z-index: 10;
        }

        .window-glint {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .hero-window:hover .window-glint {
          opacity: 1;
        }

        .window-badge-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(10, 10, 10, 0.75);
          border: 1px solid rgba(212, 175, 55, 0.5);
          color: #f7e2a0;
          font-size: 0.65rem;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 1px;
          z-index: 3;
          backdrop-filter: blur(5px);
          text-transform: uppercase;
        }

        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
          z-index: 1;
          pointer-events: none;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-window:hover .hero-img {
          transform: scale(1.1);
        }

        @keyframes floatTranslate { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-10px) rotate(0.4deg); } 
        }

        .org-details-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin: 45px auto 10px auto;
          max-width: 950px;
          padding: 20px 24px;
          background: rgba(12, 12, 12, 0.8);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(212, 175, 55, 0.35);
          border-bottom: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          position: relative;
          z-index: 2;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .org-detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 14px;
          position: relative;
        }

        .org-detail-item:not(:last-child):after {
          content: '';
          position: absolute;
          right: -12px;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(212, 175, 55, 0.2);
        }

        .org-detail-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #D4AF37;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .org-detail-value {
          font-size: 1rem;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .glapgosirimm-pulse {
          border-color: #ffffff;
          background: rgba(25, 25, 25, 0.9);
          box-shadow: 0 0 35px rgba(212, 175, 55, 0.6), inset 0 0 20px rgba(212, 175, 55, 0.25);
          transform: scale(1.02);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(8px);
          animation: fadeInModal 0.3s ease;
        }

        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background-color: #121212;
          border: 1px solid #D4AF37;
          border-radius: 18px;
          padding: 35px 25px;
          width: 90%;
          max-width: 440px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.25);
          animation: scaleUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUpModal {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .close-modal-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #D4AF37;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-modal-btn:hover {
          background: rgba(212, 175, 55, 0.2);
        }

        .modal-title {
          color: #D4AF37;
          margin-bottom: 12px;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .modal-text {
          font-size: 0.95rem;
          opacity: 0.85;
          margin-bottom: 25px;
          line-height: 1.6;
          color: #e0e0e0;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 768px) {
          .hero-section {
            padding: 90px 5%;
          }
          .org-details-bar {
            gap: 35px;
            margin-top: 55px;
          }
          .hero-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
          }
          .hero-window {
            height: 260px;
          }
          .hero-tagline {
            font-size: 1.3rem;
          }
          .hero-description {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;