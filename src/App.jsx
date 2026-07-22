import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Hero />} />
          {/* About Page */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;