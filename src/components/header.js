import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = {
    name: 'Agniva',
    avatar: '/images/user-avatar.jpg',
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <Link className="logo" to="/">Logistics & Transportation</Link>

      <div className="auth-hamburger">
        {/* Auth Buttons */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} className="btn">Logout</button>
            <Link to="/profile">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
            </Link>
          </>
        )}

        {/* Hamburger Menu */}
        <div 
          className={`hamburger ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Dropdown menu items */}
      {menuOpen && (
        <ul className="dropdown-menu-right">
          <li><Link to="/compliance">Compliance</Link></li>
          <li><Link to="/infrastructure">Infrastructure</Link></li>
          <li><Link to="/legal">Legal & Courts</Link></li>
          <li><Link to="/dashboard">Company Dashboard</Link></li>
          <li><Link to="/maps">GPS & Maps</Link></li>
          <li><Link to="/chatbot">AI Chatbot</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
