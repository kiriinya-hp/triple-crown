import React from 'react';

const About = () => {
  const styles = {
    section: {
      position: 'relative',
      padding: '100px 5%',
      background: 'radial-gradient(circle at center, rgba(30, 30, 30, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop") no-repeat center center/cover',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      color: '#FFFFFF',
      textAlign: 'center',
      /* Edge-to-edge layout styling to prevent white borders/gaps */
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      boxSizing: 'border-box',
      overflow: 'hidden',
      marginTop: '60px',
      marginBottom: '60px'
    },
    innerWrapper: {
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      zIndex: '2'
    },
    glowOrb1: {
      position: 'absolute',
      top: '-50px',
      left: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(212, 175, 55, 0.15)',
      filter: 'blur(60px)',
      borderRadius: '50%',
      zIndex: '1',
      pointerEvents: 'none'
    },
    glowOrb2: {
      position: 'absolute',
      bottom: '-50px',
      right: '10%',
      width: '200px',
      height: '200px',
      background: 'rgba(212, 175, 55, 0.1)',
      filter: 'blur(60px)',
      borderRadius: '50%',
      zIndex: '1',
      pointerEvents: 'none'
    },
    contentContainer: {
      position: 'relative',
      zIndex: '2'
    },
    title: {
      color: '#D4AF37',
      fontSize: '3rem',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontWeight: '700',
      textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
    },
    text: {
      maxWidth: '750px',
      margin: '0 auto 40px',
      lineHeight: '1.9',
      fontSize: '1.25rem',
      opacity: '0.9',
      fontWeight: '300',
      color: '#E5E5E5'
    },
    divider: {
      width: '80px',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
      margin: '0 auto 40px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginTop: '30px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '30px 20px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
    },
    cardTitle: {
      color: '#D4AF37',
      fontSize: '1.3rem',
      marginBottom: '20px',
      fontWeight: '600',
      letterSpacing: '1px'
    },
    socialList: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    socialIconLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'rgba(212, 175, 55, 0.1)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      color: '#D4AF37',
      fontSize: '1.3rem',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    contactList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '12px 18px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    nameText: {
      fontWeight: '500',
      fontSize: '1.05rem',
      color: '#FFFFFF'
    },
    phoneLink: {
      color: '#D4AF37',
      textDecoration: 'none',
      fontWeight: '600',
      letterSpacing: '0.5px',
      transition: 'color 0.2s ease'
    },
    whatsappBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#25D366',
      fontSize: '0.9rem',
      fontWeight: '500'
    }
  };

  return (
    <section id="about" style={styles.section}>
      {/* Ambient background lighting elements for premium look */}
      <div style={styles.glowOrb1}></div>
      <div style={styles.glowOrb2}></div>

      <div style={styles.innerWrapper}>
        <div style={styles.contentContainer}>
          <h2 style={styles.title}>About Us</h2>
          <div style={styles.divider}></div>
          
          <p style={styles.text}>
            At Triple Crown Fragrance and Design, we believe in merging luxury with personal style. 
            Our mission is to provide high-quality, curated products that empower individuals 
            to express their unique essence with confidence and sophistication.
          </p>

          <div style={styles.gridContainer}>
            {/* Social Media Card with built-in Lucide/SVG Icons */}
            <div style={styles.card} className="glass-card">
              <h3 style={styles.cardTitle}>Follow Our Journey</h3>
              <ul style={styles.socialList}>
                <li>
                  <a href="https://www.instagram.com/triplecrown" target="_blank" rel="noopener noreferrer" style={styles.socialIconLink} className="social-icon" aria-label="Instagram">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@triplecrown" target="_blank" rel="noopener noreferrer" style={styles.socialIconLink} className="social-icon" aria-label="TikTok">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/triplecrown" target="_blank" rel="noopener noreferrer" style={styles.socialIconLink} className="social-icon" aria-label="Facebook">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Ordering / WhatsApp Contact Card */}
            <div style={styles.card} className="glass-card">
              <h3 style={styles.cardTitle}>Prices & Orders</h3>
              <ul style={styles.contactList}>
                <li style={styles.contactItem}>
                  <span style={styles.nameText}>Dirham</span>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <a href="tel:0799394055" style={styles.phoneLink}>0799394055</a>
                    <span style={styles.whatsappBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      WhatsApp
                    </span>
                  </div>
                </li>
                <li style={styles.contactItem}>
                  <span style={styles.nameText}>Adhie</span>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <a href="tel:0740250038" style={styles.phoneLink}>0740250038</a>
                    <span style={styles.whatsappBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      WhatsApp
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modern UI Interaction Styles */}
      <style>
        {`
          .glass-card:hover {
            transform: translateY(-5px);
            border-color: rgba(212, 175, 55, 0.4);
            box-shadow: 0 15px 35px rgba(212, 175, 55, 0.1);
          }
          .social-icon:hover {
            background: #D4AF37 !important;
            color: #000000 !important;
            transform: scale(1.1);
            border-color: #D4AF37 !important;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
          }
        `}
      </style>
    </section>
  );
};

export default About;