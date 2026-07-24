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

  if (errorMsg) return <div className="error-text">Access Error: {errorMsg}</div>;
  if (!productsData) return <div className="loading-text">Loading Dashboard...</div>;

  const categoriesToDisplay = activeCategory === 'all' 
    ? Object.keys(productsData) 
    : [activeCategory];

  return (
    <div className="dashboard-container">
      {/* Top Bar with Profile Icon */}
      <div className="top-bar">
        <button 
          className="profile-icon-btn" 
          onClick={() => setShowProfileModal(true)}
          title="View Client Profile"
        >
          👤
        </button>
      </div>

      {/* Client Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            <h2 className="modal-title">Client Profile</h2>
            {clientProfile ? (
              <div className="profile-details">
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
                          href={`https://wa.me/254799394055?text=Hello,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(item.name)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
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
          padding-bottom: 80px; /* Space for mobile bottom bar */
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .profile-icon-btn {
          background-color: transparent;
          border: 1px solid #D4AF37;
          borderRadius: 50%;
          width: 40px;
          height: 40px;
          color: #D4AF37;
          fontSize: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          backgroundColor: #111111;
          border: 1px solid #D4AF37;
          borderRadius: 15px;
          padding: 25px 20px;
          width: 90%;
          maxWidth: 400px;
          textAlign: center;
          position: relative;
        }

        .close-modal-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          color: #D4AF37;
          fontSize: 1.2rem;
          cursor: pointer;
        }

        .modal-title {
          color: #D4AF37;
          margin-bottom: 15px;
          font-size: 1.3rem;
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
          fontSize: 0.95rem;
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
          borderRadius: 20px;
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
          fontSize: 0.9rem;
          opacity: 0.7;
          margin-bottom: 15px;
          font-style: italic;
        }

        /* Strict 2-column mobile grid matching Jumia & Kilimall layout */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .product-card {
          backgroundColor: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          borderRadius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .image-container {
          height: 150px;
          overflow: hidden;
          position: relative;
          backgroundColor: #121212;
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
          fontSize: 0.85rem;
          fontWeight: bold;
          margin-bottom: 4px;
          color: #FFF;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-type {
          fontSize: 0.75rem;
          opacity: 0.8;
          margin-bottom: 6px;
          color: #D4AF37;
        }

        .item-price {
          fontSize: 0.85rem;
          fontWeight: bold;
          margin-bottom: 8px;
          color: #FFF;
        }

        .order-button {
          padding: 6px 4px;
          backgroundColor: transparent;
          border: 1px solid #D4AF37;
          borderRadius: 15px;
          color: #D4AF37;
          fontWeight: bold;
          cursor: pointer;
          textAlign: center;
          text-decoration: none;
          font-size: 0.7rem;
          transition: background-color 0.2s;
        }

        .contact-banner {
          marginTop: 40px;
          padding: 20px 15px;
          backgroundColor: rgba(212, 175, 55, 0.05);
          border: 1px dashed #D4AF37;
          borderRadius: 12px;
          textAlign: center;
        }

        .banner-title {
          color: #D4AF37;
          marginBottom: 8px;
          font-size: 1.1rem;
        }

        .banner-text {
          marginBottom: 8px;
          font-size: 0.9rem;
        }

        .banner-contacts {
          fontWeight: bold;
          font-size: 0.9rem;
        }

        .banner-footer {
          fontSize: 0.8rem;
          opacity: 0.8;
          marginTop: 4px;
        }

        .error-text, .loading-text {
          color: #FFF;
          text-align: center;
          padding: 100px 20px;
          fontSize: 1.1rem;
        }
        
        .error-text {
          color: #ff6b6b;
        }

        /* Desktop Media Queries for Larger Displays */
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
            fontSize: 1.1rem;
            -webkit-line-clamp: unset;
          }
          .item-type {
            fontSize: 0.9rem;
          }
          .item-price {
            fontSize: 1rem;
          }
          .order-button {
            padding: 10px;
            font-size: 0.9rem;
          }
          .main-category-heading {
            fontSize: 2rem;
          }
          .sub-category-heading {
            fontSize: 1.4rem;
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