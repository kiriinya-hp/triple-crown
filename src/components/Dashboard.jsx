import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [productsData, setProductsData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [clientProfile, setClientProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Read secure session tokens from sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');
    const userEmail = sessionStorage.getItem('userEmail');

    // 1. Fetch products catalog from backend (public or verified)
    fetch('https://triple-crown-4a9k.onrender.com/api/products-catalog', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

    // 2. Fetch secure client profile details directly from database via backend API
    if (token) {
      fetch('https://triple-crown-4a9k.onrender.com/api/client-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch secure client profile");
          }
          return res.json();
        })
        .then((data) => {
          setClientProfile(data);
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
        });
    }
  }, []);

  // Handler for WhatsApp inquiry with restricted access check using sessionStorage
  const handleWhatsAppInquiry = (e, inquiryText) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const isEmailVerified = sessionStorage.getItem('isVerified') === 'true'; 
    const targetUrl = `https://wa.me/254799394055?text=${encodeURIComponent(inquiryText)}`;

    // Limit access if the user lacks a valid token or is unverified
    if (!token || !isEmailVerified) {
      setShowAuthModal(true); 
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAuthRedirect = (isRegistering) => {
    setShowAuthModal(false);
    window.location.href = isRegistering ? '/register' : '/login';
  };

  // Handler for logging out the user from sessionStorage
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('isVerified');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (errorMsg) return <div className="error-text">Access Error: {errorMsg}</div>;
  if (!productsData) return <div className="loading-text">Loading Dashboard...</div>;

  const categoriesToDisplay = activeCategory === 'all' 
    ? Object.keys(productsData) 
    : [activeCategory];

  return (
    <div className="dashboard-container">
      {/* Top Bar with Profile and Logout Icons */}
      <div className="top-bar">
        <div className="top-bar-actions">
          <button 
            className="profile-icon-btn" 
            onClick={() => setShowProfileModal(true)}
            title="View Client Profile"
          >
            👤
          </button>
          <button 
            className="logout-icon-btn" 
            onClick={handleLogout}
            title="Log Out"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Client Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            <h2 className="modal-title">Client Profile</h2>
            {clientProfile ? (
              <div className="profile-details">
                <p><strong>Name:</strong> {clientProfile.name || 'N/A'}</p>
                <p><strong>Email:</strong> {clientProfile.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {clientProfile.phone || 'N/A'}</p>
              </div>
            ) : (
              <p>Loading secure profile details from database...</p>
            )}
          </div>
        </div>
      )}

      {/* Authentication / Registration Restriction Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setShowAuthModal(false)}>✕</button>
            <h3 className="modal-title">Email Verification Required</h3>
            <p className="modal-text">You must verify your email or log into an authorized account to place orders or make WhatsApp inquiries.</p>
            <div className="modal-actions">
              <button className="hero-btn primary-btn" onClick={() => handleAuthRedirect(true)}>Register / Verify Account</button>
              <button className="hero-btn secondary-btn" onClick={() => handleAuthRedirect(false)}>Login to Existing Account</button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1 className="main-title">Client Dashboard</h1>
        <p className="sub-title">Explore our signature collections, check specifications, and place orders directly.</p>
        
        {/* Main Category Navigation Tabs */}
        <div className="nav-tabs">
          <button className={`tab-button ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>All</button>
          <button className={`tab-button ${activeCategory === 'perfumes' ? 'active' : ''}`} onClick={() => setActiveCategory('perfumes')}>Perfumes</button>
          <button className={`tab-button ${activeCategory === 'clothes' ? 'active' : ''}`} onClick={() => setActiveCategory('clothes')}>Clothes</button>
          <button className={`tab-button ${activeCategory === 'shoes' ? 'active' : ''}`} onClick={() => setActiveCategory('shoes')}>Shoes</button>
        </div>
      </div>

      {/* Render Filtered Categories & Sub-titles */}
      {categoriesToDisplay.map((catKey) => {
        const category = productsData[catKey];
        if (!category) return null;
        return (
          <div key={catKey} className="section-container">
            {activeCategory === 'all' && <h2 className="main-category-heading">{category.title || catKey}</h2>}
            <p className="section-sub-heading">{category.subtitle}</p>

            {/* Loop through Sub-titles / Sub-categories */}
            {Object.keys(category.subCategories).map((subKey) => (
              <div key={subKey}>
                <h3 className="sub-category-heading">{subKey}</h3>
                <div className="product-grid">
                  {category.subCategories[subKey].map((item, index) => (
                    <div key={index} className="product-card">
                      <div className="image-container">
                        <img src={item.image} alt={item.name} className="product-image" loading="lazy" />
                      </div>
                      <div className="card-content">
                        <div>
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-type">{item.type}</p>
                          <p className="item-price">{item.price !== "Inquire" ? item.price : ""}</p>
                        </div>
                        <a 
                          href="#whatsapp" 
                          onClick={(e) => handleWhatsAppInquiry(e, `Hello, I would like to inquire about ${item.name}`)}
                          className="order-button"
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
      <div className="contact-banner">
        <h3 className="banner-title">Need Assistance with Pricing or Deliveries?</h3>
        <p className="banner-text">Contact our agents directly:</p>
        <p className="banner-contacts">Dirham: 0799394055 | Adhie: 0740250038</p>
        <p className="banner-footer">We deliver across Nairobi and beyond.</p>
      </div>

      <style>{`
        .dashboard-container {
          background-color: #000000;
          color: #FFFFFF;
          min-height: 100vh;
          padding: 20px 10px;
          position: relative;
          box-sizing: border-box;
          padding-bottom: 80px;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .top-bar-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .profile-icon-btn, .logout-icon-btn {
          background-color: transparent;
          border: 1px solid #D4AF37;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: #D4AF37;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .logout-icon-btn {
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .logout-icon-btn:hover {
          background-color: rgba(255, 107, 107, 0.1);
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
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background-color: #111111;
          border: 1px solid #D4AF37;
          border-radius: 15px;
          padding: 30px 20px;
          width: 90%;
          max-width: 420px;
          text-align: center;
          position: relative;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
        }

        .close-modal-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          color: #D4AF37;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .modal-title {
          color: #D4AF37;
          margin-bottom: 12px;
          font-size: 1.3rem;
        }

        .modal-text {
          font-size: 0.95rem;
          opacity: 0.85;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-details {
          text-align: left;
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .header {
          text-align: center;
          margin-bottom: 25px;
        }

        .main-title {
          color: #D4AF37;
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          margin-bottom: 8px;
        }

        .sub-title {
          font-size: 0.95rem;
          opacity: 0.8;
          margin-bottom: 20px;
          padding: 0 10px;
          line-height: 1.4;
        }

        .nav-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .tab-button {
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid #D4AF37;
          background-color: transparent;
          color: #FFFFFF;
          font-weight: bold;
          cursor: pointer;
          text-transform: capitalize;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          background-color: #D4AF37;
          color: #000000;
        }

        .section-container {
          margin-bottom: 40px;
        }

        .main-category-heading {
          color: #D4AF37;
          font-size: 1.5rem;
          margin-bottom: 8px;
          text-transform: capitalize;
        }

        .sub-category-heading {
          color: #D4AF37;
          font-size: 1.2rem;
          margin: 20px 0 12px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          padding-bottom: 6px;
        }

        .section-sub-heading {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-bottom: 15px;
          font-style: italic;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .product-card {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .image-container {
          height: 150px;
          overflow: hidden;
          position: relative;
          background-color: #121212;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .card-content {
          padding: 10px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
        }

        .item-name {
          font-size: 0.85rem;
          font-weight: bold;
          margin-bottom: 4px;
          color: #FFF;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-type {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-bottom: 6px;
          color: #D4AF37;
        }

        .item-price {
          font-size: 0.85rem;
          font-weight: bold;
          margin-bottom: 8px;
          color: #FFF;
        }

        .order-button {
          padding: 6px 4px;
          background-color: transparent;
          border: 1px solid #D4AF37;
          border-radius: 15px;
          color: #D4AF37;
          font-weight: bold;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          font-size: 0.7rem;
          transition: background-color 0.2s;
        }

        .contact-banner {
          margin-top: 40px;
          padding: 20px 15px;
          background-color: rgba(212, 175, 55, 0.05);
          border: 1px dashed #D4AF37;
          border-radius: 12px;
          text-align: center;
        }

        .banner-title {
          color: #D4AF37;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .banner-text {
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .banner-contacts {
          font-weight: bold;
          font-size: 0.9rem;
        }

        .banner-footer {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-top: 4px;
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
          width: 100%;
        }

        .primary-btn {
          background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
          color: #000000;
          border: 2px solid #D4AF37;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .secondary-btn {
          background-color: rgba(0, 0, 0, 0.6);
          color: #FFFFFF;
          border: 2px solid rgba(212, 175, 55, 0.5);
          backdrop-filter: blur(5px);
        }

        .error-text, .loading-text {
          color: #FFF;
          text-align: center;
          padding: 100px 20px;
          font-size: 1.1rem;
        }
        
        .error-text {
          color: #ff6b6b;
        }

        @media (min-width: 768px) {
          .dashboard-container {
            padding: 40px 5%;
            padding-bottom: 40px;
          }
          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 25px;
          }
          .image-container {
            height: 240px;
            padding: 10px;
          }
          .card-content {
            padding: 20px;
          }
          .item-name {
            font-size: 1.1rem;
            -webkit-line-clamp: unset;
          }
          .item-type {
            font-size: 0.9rem;
          }
          .item-price {
            font-size: 1rem;
          }
          .order-button {
            padding: 10px;
            font-size: 0.9rem;
          }
          .main-category-heading {
            font-size: 2rem;
          }
          .sub-category-heading {
            font-size: 1.4rem;
          }
          .contact-banner {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;