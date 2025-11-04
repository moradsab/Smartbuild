import React, { useState, useEffect, useRef } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  'דף הבית',
  'פניות לקוחות',
  'ביקורי שטח',
  'הצעות מחיר',
  'פרויקטים',
  'חומרים',
  'הוצאות',
  'חשבוניות',
  'ציוד',
  'דוחות'
];

// Map item label to route path
const navMap = {
  'דף הבית': '/',
  'פניות לקוחות': '/customers',
  'ביקורי שטח': '/visits',
  'הצעות מחיר': '/quotes',
  'פרויקטים': '/projects',
  'חומרים': '/materials',
  'הוצאות': '/expenses',
  'חשבוניות': '/invoices',
  'ציוד': '/equipment',
  'דוחות': '/reports',
};

export default function Sidebar({ open, setOpen }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        windowWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, windowWidth, setOpen]);

  const handleNavItemClick = (item) => {
    const path = navMap[item];
    if (path) {
      navigate(path);
      if (windowWidth < 1024) setOpen(false); // Close on mobile
    }
  };

  return (
    <>
      {!open && windowWidth < 1024 && (
        <button
          ref={toggleRef}
          className="sidebar-toggle"
          onClick={() => setOpen(true)}
          aria-label="תפריט"
        >
          <FiMenu size={24} />
        </button>
      )}
      <aside
        ref={sidebarRef}
        className={`sidebar-container ${open ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <h1>מנהל פרויקטים</h1>
          <p>בנייה ואלומיניום</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className="sidebar-nav-item"
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          גרסה 1.0<br />
          מערכת ניהול פרויקטים
        </div>
      </aside>
    </>
  );
}
