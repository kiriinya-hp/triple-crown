import React, { useState, useEffect } from 'react';

const Hero = () => {
  const tagline = "Style that empowers. Beauty that lasts.";
  const description = "Experience the pinnacle of sophistication. From our Effortless Chic romper collection to our curated selection of Premium Arabic and Luxury perfumes, we bring you timeless elegance for the modern individual.";
  
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

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Triple Crown Fragrance and Design</h1>
        <p className="hero-tagline">{tagline}</p>
        <p className="hero-description">{description}</p>
      </div>
      
      <div className="hero-grid">
        {windowIndices.map((imgIndex, i) => (
          <div key={i} className="hero-window" style={{ animationDelay: `${i * 0.5}s` }}>
            <img src={allImages[imgIndex]} alt="Product showcase" className="hero-img" loading="lazy" />
          </div>
        ))}
      </div>

      <style>{`
        .hero-section {
          padding: 30px 15px;
          background-color: #000000;
          color: #FFFFFF;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }

        .hero-title {
          color: #D4AF37;
          font-size: clamp(1.8rem, 5vw, 3.5rem);
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .hero-tagline {
          font-style: italic;
          font-size: 1rem;
          margin-bottom: 12px;
          color: #f3f3f3;
        }

        .hero-description {
          max-width: 800px;
          margin: 0 auto 20px auto;
          line-height: 1.5;
          font-size: 0.95rem;
          opacity: 0.9;
          padding: 0 10px;
        }

        /* Mobile-First Grid: Strict 2 columns on phones, scaling up for tablets/desktops */
        .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 10px 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-window {
          height: 180px;
          border-radius: 12px;
          border: 2px solid #D4AF37;
          overflow: hidden;
          position: relative;
          animation: floatTranslate 4s ease-in-out infinite;
          background: #111;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes floatTranslate { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-8px); } 
        }

        /* Media queries for larger screens (Tablets and Desktops) */
        @media (min-width: 768px) {
          .hero-section {
            padding: 50px 5%;
          }
          .hero-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .hero-window {
            height: 300px;
          }
          .hero-tagline {
            font-size: 1.2rem;
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