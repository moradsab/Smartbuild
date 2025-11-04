import React from 'react';
import Stats from '../components/Stats'; 
import RecentProjects from '../components/RecentProjects'; 
import Actions from '../components/Actions'; 
import './HomePage.css'; 

export default function HomePage({ stats, recentProjects }) {
  
    console.log(stats,"st")
  return (
    <div className="home-container">
      <main className="home-main">
        {/* Container for the main content sections like stats and recent projects */}
        <div className="stats-container">
          {/* Section for overall statistics */}
          <section className="stats-section">
            <Stats stats={stats} />
          </section>

          {/* Section for recent projects */}
          <section className="stats-section">
            <RecentProjects projectsData={recentProjects} />
          </section>
        </div>
      </main>

      {/* Fixed bottom navigation bar */}
      <div className="bottom-nav">
        <Actions />
      </div>
    </div>
  );
}
