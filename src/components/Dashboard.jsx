import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [productsData, setProductsData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [clientProfile, setClientProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Retrieve the logged-in user details to pass email header for verification & profile info
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userEmail = loggedInUser ? loggedInUser.email : '';
    
    if (loggedInUser) {
      setClientProfile(loggedInUser);
    }

    // Pointing directly to your Render backend deployment (with localhost fallback option)
    fetch('https://triple-crown-4a9k.onrender.com/api/products-catalog', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-email': userEmail
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch products catalog");
        }
        return res.json();
      })
      .then((data) => setProductsData(data))
      .catch((err) => {
        console.error("Error loading products data:", err);
        setErrorMsg(err.message);
      });
  }, []);

  const styles = {
    dashboard: { backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', padding: '40px 5%', position: 'relative' },
    topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
    profileIconBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #D4AF37',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      color: '#D4AF37',
      fontSize: '1.2rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#111111',
      border: '1px solid #D4AF37',
      borderRadius: '15px',
      padding: '30px',
      width: '90%',
      maxWidth: '400px',
      textAlign: 'center',
      position: 'relative'
    },
    closeModalBtn: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'transparent',
      border: 'none',
      color: '#D4AF37',
      fontSize: '1.2rem',
      cursor: 'pointer'
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    mainTitle: { color: '#D4AF37', fontSize: '2.5rem', marginBottom: '10px' },
    subTitle: { fontSize: '1.1rem', opacity: '0.8', marginBottom: '30px' },
    navTabs: { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '40px' },
    tabButton: (isActive) => ({
      padding: '12px 28px',
      borderRadius: '30px',
      border: '1px solid #D4AF37',
      backgroundColor: isActive ? '#D4AF37' : 'transparent',
      color: isActive ? '#000000' : '#FFFFFF',
      fontWeight: 'bold',
      cursor: 'pointer',
      textTransform: 'capitalize',
      transition: 'all 0.3s ease'
    }),
    sectionContainer: { marginBottom: '50px' },
    mainCategoryHeading: { color: '#D4AF37', fontSize: '2rem', marginBottom: '10px', textTransform: 'capitalize' },
    subCategoryHeading: { color: '#D4AF37', fontSize: '1.4rem', margin: '30px 0 15px 0', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '8px' },
    sectionSubHeading: { fontSize: '1rem', opacity: '0.7', marginBottom: '25px', fontStyle: 'italic' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, border-color 0.3s ease'
    },
    imageContainer: { 
      height: '240px', 
      overflow: 'hidden', 
      position: 'relative', 
      backgroundColor: '#121212', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '10px'
    },
    image: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'contain',
      transition: 'transform 0.3s ease'
    },
    cardContent: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'space-between' },
    itemName: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#FFF' },
    itemType: { fontSize: '0.9rem', opacity: '0.8', marginBottom: '10px', color: '#D4AF37' },
    itemPrice: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: '#FFF' },
    orderButton: {
      padding: '10px',
      backgroundColor: 'transparent',
      border: '1px solid #D4AF37',
      borderRadius: '20px',
      color: '#D4AF37',
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
      transition: 'background-color 0.2s'
    },
    contactBanner: {
      marginTop: '60px',
      padding: '30px',
      backgroundColor: 'rgba(212, 175, 55, 0.05)',
      border: '1px dashed #D4AF37',
      borderRadius: '15px',
      textAlign: 'center'
    },
    errorText: { color: '#ff6b6b', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }
  };

  if (errorMsg) return <div style={styles.errorText}>Access Error: {errorMsg}</div>;
  if (!productsData) return <div style={{ color: '#FFF', textAlign: 'center', padding: '100px' }}>Loading Dashboard...</div>;

  const categoriesToDisplay = activeCategory === 'all' 
    ? Object.keys(productsData) 
    : [activeCategory];

  return (
    <div style={styles.dashboard}>
      {/* Top Bar with Profile Icon */}
      <div style={styles.topBar}>
        <button 
          style={styles.profileIconBtn} 
          onClick={() => setShowProfileModal(true)}
          title="View Client Profile"
        >
          👤
        </button>
      </div>

      {/* Client Profile Modal */}
      {showProfileModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalBtn} onClick={() => setShowProfileModal(false)}>✕</button>
            <h2 style={{ color: '#D4AF37', marginBottom: '20px' }}>Client Profile</h2>
            {clientProfile ? (
              <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
                <p><strong>Name:</strong> {clientProfile.name || clientProfile.username || 'N/A'}</p>
                <p><strong>Email:</strong> {clientProfile.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {clientProfile.phone || 'N/A'}</p>
              </div>
            ) : (
              <p>No client details found in local storage.</p>
            )}
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Client Dashboard</h1>
        <p style={styles.subTitle}>Explore our signature collections, check specifications, and place orders directly.</p>
        
        {/* Main Category Navigation Tabs */}
        <div style={styles.navTabs}>
          <button style={styles.tabButton(activeCategory === 'all')} onClick={() => setActiveCategory('all')}>All</button>
          <button style={styles.tabButton(activeCategory === 'perfumes')} onClick={() => setActiveCategory('perfumes')}>Perfumes</button>
          <button style={styles.tabButton(activeCategory === 'clothes')} onClick={() => setActiveCategory('clothes')}>Clothes</button>
          <button style={styles.tabButton(activeCategory === 'shoes')} onClick={() => setActiveCategory('shoes')}>Shoes</button>
        </div>
      </div>

      {/* Render Filtered Categories & Sub-titles */}
      {categoriesToDisplay.map((catKey) => {
        const category = productsData[catKey];
        if (!category) return null;
        return (
          <div key={catKey} style={styles.sectionContainer}>
            {activeCategory === 'all' && <h2 style={styles.mainCategoryHeading}>{category.title || catKey}</h2>}
            <p style={styles.sectionSubHeading}>{category.subtitle}</p>

            {/* Loop through Sub-titles / Sub-categories */}
            {Object.keys(category.subCategories).map((subKey) => (
              <div key={subKey}>
                <h3 style={styles.subCategoryHeading}>{subKey}</h3>
                <div style={styles.grid}>
                  {category.subCategories[subKey].map((item, index) => (
                    <div key={index} style={styles.card}>
                      <div style={styles.imageContainer}>
                        <img src={item.image} alt={item.name} style={styles.image} />
                      </div>
                      <div style={styles.cardContent}>
                        <div>
                          <h4 style={styles.itemName}>{item.name}</h4>
                          <p style={styles.itemType}>{item.type}</p>
                          <p style={styles.itemPrice}>{item.price !== "Inquire" ? item.price : ""}</p>
                        </div>
                        <a 
                          href={`https://wa.me/254799394055?text=Hello,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(item.name)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={styles.orderButton}
                        >
                          Inquire / Order via WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Direct Order Help Banner */}
      <div style={styles.contactBanner}>
        <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>Need Assistance with Pricing or Deliveries?</h3>
        <p style={{ marginBottom: '15px' }}>Contact our agents directly:</p>
        <p style={{ fontWeight: 'bold' }}>Dirham: 0799394055 | Adhie: 0740250038</p>
        <p style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '5px' }}>We deliver across Nairobi and beyond.</p>
      </div>
    </div>
  );
};

export default Dashboard;