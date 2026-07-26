import React, { useState, useEffect } from 'react';

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
    '/rubber.jpeg'
  ];

  const getRandomIndex = (currentIndex) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * allImages.length);
    } while (newIndex === currentIndex);
    return newIndex;
  };

  const [windowIndices, setWindowIndices] = useState([0, 1, 2, 3]);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const intervals = windowIndices.map((_, i) => {
      return setInterval(() => {
        setWindowIndices((prev) => {
          const next = [...prev];
          next[i] = getRandomIndex(next[i]);
          return next;
        });
      }, 3000 + (i * 1000));
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

  return (
    <section className="hero-section">
      {/* Decorative ambient background glows */}
      <div className="hero-glow-bg glow-1"></div>
      <div className="hero-glow-bg glow-2"></div>

      <div className="hero-content">
        <span className="hero-badge">Exclusive Luxury Collection</span>
        <h1 className="hero-title">Triple Crown Fragrance and Design</h1>
        <p className="hero-tagline">{tagline}</p>
        <p className="hero-description">{description}</p>
        
        <div className="hero-cta-group">
          <a href="#collection" className="hero-btn primary-btn">Explore Collection</a>
          <a href="#fragrances" className="hero-btn secondary-btn">Discover Fragrances</a>
        </div>
      </div>
      
      <div className="hero-grid">
        {windowIndices.map((imgIndex, i) => (
          <div key={i} className="hero-window" style={{ animationDelay: `${i * 0.5}s` }}>
            <div className="hero-img-overlay"></div>
            <img src={allImages[imgIndex]} alt="Product showcase" className="hero-img" loading="lazy" />
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

      <style>{`
        .hero-section {
          padding: 50px 15px;
          background: linear-gradient(135deg, #050505 0%, #000000 50%, #0a0a0a 100%);
          color: #FFFFFF;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background lighting effects */
        .hero-glow-bg {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0, 0, 0, 0) 70%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }

        .glow-1 {
          top: -100px;
          left: -100px;
        }

        .glow-2 {
          bottom: -100px;
          right: -100px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        /* High-end luxury badge */
        .hero-badge {
          display: inline-block;
          padding: 6px 16px;
          margin-bottom: 15px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
        }

        .hero-title {
          color: #D4AF37;
          font-size: clamp(2rem, 5vw, 3.8rem);
          margin: 0 0 10px 0;
          line-height: 1.15;
          font-weight: 700;
          text-shadow: 0 2px 20px rgba(212, 175, 55, 0.2);
        }

        .hero-tagline {
          font-style: italic;
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: #f3f3f3;
          letter-spacing: 0.5px;
        }

        .hero-description {
          max-width: 750px;
          margin: 0 auto 25px auto;
          line-height: 1.6;
          font-size: 1rem;
          opacity: 0.85;
          padding: 0 10px;
        }

        .hero-cta-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 13px 30px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          letter-spacing: 0.8px;
        }

        .primary-btn {
          background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
          color: #000000;
          border: 2px solid #D4AF37;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .primary-btn:hover {
          background: linear-gradient(135deg, #f3c643 0%, #D4AF37 100%);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
        }

        .secondary-btn {
          background-color: rgba(0, 0, 0, 0.6);
          color: #FFFFFF;
          border: 2px solid rgba(212, 175, 55, 0.5);
          backdrop-filter: blur(5px);
        }

        .secondary-btn:hover {
          border-color: #D4AF37;
          background-color: rgba(212, 175, 55, 0.12);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 15px 0;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-window {
          height: 180px;
          border-radius: 14px;
          border: 2px solid rgba(212, 175, 55, 0.6);
          overflow: hidden;
          position: relative;
          animation: floatTranslate 4s ease-in-out infinite;
          background: #111;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-window:hover {
          border-color: #D4AF37;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        /* Subtle image lighting gradient overlay */
        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%);
          z-index: 1;
          pointer-events: none;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-window:hover .hero-img {
          transform: scale(1.05);
        }

        @keyframes floatTranslate { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-8px); } 
        }

        .org-details-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin: 35px auto 10px auto;
          max-width: 950px;
          padding: 18px 20px;
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: relative;
          z-index: 2;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .org-detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 12px;
        }

        .org-detail-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #D4AF37;
          opacity: 0.9;
          margin-bottom: 3px;
        }

        .org-detail-value {
          font-size: 0.95rem;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        /* Glapgosirimm algorithmic rhythm visual effect */
        .glapgosirimm-pulse {
          border-color: #ffffff;
          background: rgba(30, 30, 30, 0.85);
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.5), inset 0 0 15px rgba(212, 175, 55, 0.2);
          transform: scale(1.015);
        }

        @media (min-width: 768px) {
          .hero-section {
            padding: 70px 5%;
          }
          .org-details-bar {
            gap: 35px;
            margin-top: 45px;
          }
          .hero-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .hero-window {
            height: 300px;
          }
          .hero-tagline {
            font-size: 1.25rem;
          }
          .hero-description {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;