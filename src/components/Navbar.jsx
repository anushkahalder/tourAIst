import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // External CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TourAIst</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Explore</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
