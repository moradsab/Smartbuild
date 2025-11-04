// Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu, FiHome, FiUsers, FiMapPin, FiBox, FiTool, FiPieChart
} from 'react-icons/fi';
import { TbBuildingCommunity, TbCurrencyShekel } from 'react-icons/tb';
import { RiFileList3Line } from 'react-icons/ri';
import { PiMoneyWavyBold } from 'react-icons/pi';
import './Navbar.css';

const navItems = [
  { label: 'דף הבית', path: '/', icon: FiHome, color: '#3b82f6' },
  { label: 'פניות לקוחות', path: '/customers', icon: FiUsers, color: '#059669' },
  { label: 'ביקורי שטח', path: '/visits', icon: FiMapPin, color: '#f97316' },
  { label: 'הצעות מחיר', path: '/quotes', icon: TbCurrencyShekel, color: '#8b5cf6' },
  { label: 'פרויקטים', path: '/projects', icon: TbBuildingCommunity, color: '#14b8a6' },
  { label: 'הוצאות', path: '/expenses', icon: PiMoneyWavyBold, color: '#ef4444c8' },
  { label: 'חשבוניות', path: '/invoices', icon: RiFileList3Line, color: '#d37f1fdc' },
  { label: 'חומרים', path: '/materials', icon: FiBox, color: '#c1b15bff' },
  { label: 'ציוד', path: '/equipment', icon: FiTool, color: '#06b6d4' },
  { label: 'דוחות', path: '/reports', icon: FiPieChart, color: '#6366f1' },
];

// Navbar now receives isDrawerOpen and toggleDrawer as props
export default function Navbar({ isDrawerOpen, toggleDrawer }) { //
  const navigate = useNavigate(); //
  const location = useLocation(); //

  const handleNavItemClick = (path) => { //
    navigate(path); //
    toggleDrawer(); // Close drawer after navigation
  };

  return (
    <> {/* Removed div.app-container from here */}
      <header className="top-navbar-header"> {/* */}
        <button
          className={`top-navbar-toggle ${isDrawerOpen ? 'open' : ''}`} //
          onClick={toggleDrawer} //
        >
          <FiMenu size={24} /> {/* */}
        </button>
        {(() => {
          const activeItem = navItems.find(item => item.path === location.pathname); //
          return activeItem ? (
            <div className="top-navbar-title active-item-display"> {/* */}
              <activeItem.icon style={{ color: activeItem.color, marginInlineEnd: '8px' }} /> {/* */}
              {activeItem.label} {/* */}
            </div>
          ) : (
            <h1 className="top-navbar-title">מנהל פרויקטים</h1> //
          );
        })()}
      </header>
      <div className={`top-navbar-drawer ${isDrawerOpen ? 'open' : ''}`}> {/* */}
        <nav className="drawer-nav"> {/* */}
          {navItems.map((item, idx) => ( //
            <button
              key={idx} //
              className={`drawer-nav-item ${location.pathname === item.path ? 'active' : ''}`} //
              onClick={() => handleNavItemClick(item.path)} //
            >
              <item.icon className="drawer-nav-icon" style={{ '--icon-color': item.color }} /> {/* */}
              <span>{item.label}</span> {/* */}
            </button>
          ))}
        </nav>
      </div>
      <div id="overlay" className={`overlay ${isDrawerOpen ? 'open' : ''}`} onClick={toggleDrawer}></div> {/* */}
    </>
  );
}