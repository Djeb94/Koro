import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <h1>Koro</h1>
      </div>
      
      <nav className="nav-menu">
        <NavLink
          to="/"
          className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-home"></i>
          <span>Accueil</span>
        </NavLink>
        <NavLink
          to="/matches"
          className={location.pathname === '/matches' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-heart"></i>
          <span>Mes likes</span>
        </NavLink>
        <NavLink
          to="/messages"
          className={location.pathname === '/messages' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-comment"></i>
          <span>Messages</span>
        </NavLink>
        <NavLink
          to="/agenda"
          className={location.pathname === '/agenda' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-calendar-alt"></i>
          <span>Mon agenda</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={location.pathname === '/profile' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-user"></i>
          <span>Mon Profil</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={location.pathname === '/settings' ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-cog"></i>
          <span>Paramètres</span>
        </NavLink>
        
      </nav>
    </div>
  );
}

export default Sidebar;