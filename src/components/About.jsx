import React from 'react';

const About = () => {
  const styles = {
    section: { padding: '80px 5%', backgroundColor: '#000000', color: '#FFFFFF', textAlign: 'center' },
    title: { color: '#D4AF37', fontSize: '2.5rem', marginBottom: '20px' },
    text: { maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.2rem', opacity: '0.9' }
  };

  return (
    <section id="about" style={styles.section}>
      <h2 style={styles.title}>About Us</h2>
      <p style={styles.text}>
        At Triple Crown Fragrance and Design, we believe in merging luxury with personal style. 
        Our mission is to provide high-quality, curated products that empower individuals 
        to express their unique essence with confidence and sophistication.
      </p>
    </section>
  );
};

export default About;