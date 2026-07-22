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

  const styles = {
    section: { padding: '50px 5%', backgroundColor: '#000000', color: '#FFFFFF', textAlign: 'center' },
    title: { color: '#D4AF37', fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0 0 10px 0' },
    tagline: { fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '15px' },
    description: { maxWidth: '800px', margin: '0 auto 30px auto', lineHeight: '1.6', fontSize: '1.1rem', opacity: '0.9' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '20px' },
    window: {
      height: '300px',
      borderRadius: '15px',
      border: '2px solid #D4AF37',
      overflow: 'hidden',
      position: 'relative',
      animation: 'floatTranslate 4s ease-in-out infinite'
    },
    img: { width: '100%', height: '100%', objectFit: 'cover' }
  };

  return (
    <section style={styles.section}>
      <h1 style={styles.title}>Triple Crown Fragrance and Design</h1>
      <p style={styles.tagline}>{tagline}</p>
      <p style={styles.description}>{description}</p>
      
      <div style={styles.grid}>
        {windowIndices.map((imgIndex, i) => (
          <div key={i} style={{ ...styles.window, animationDelay: `${i * 0.5}s` }}>
            <img src={allImages[imgIndex]} alt="Ad" style={styles.img} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes floatTranslate { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
      `}</style>
    </section>
  );
};

export default Hero;