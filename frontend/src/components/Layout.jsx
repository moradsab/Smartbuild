// Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; //

export default function Layout() { //
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const dist = touchStartX - e.changedTouches[0].clientX;
    if (dist > 140) setIsDrawerOpen(true);
    else if (dist < -140) setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="app-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Navbar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} /> {/* Pass props to Navbar */}
      <main className="main-content"> {/* */}
        <Outlet /> {/* */}
      </main>
    </div>
  );
}