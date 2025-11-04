import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiList } from 'react-icons/fi';
import './RecentProjects.css';

// Map statuses from Hebrew to color classes
function getStatusColor(status) {
  switch (status) {
    case 'בתהליך':
      return 'status-inprogress';
    case 'הוזמן חומר':
      return 'status-ordered';
    case 'הצעת מחיר נשלחה':
      return 'status-quoted';
    case 'ממתין לתשלום':
      return 'status-pending';
    default:
      return 'status-default';
  }
}

// Convert raw project data to the display format
function formatProjects(rawProjects) {
  return rawProjects.map((p) => ({
    id: `${String(p["מספר פרויקט"]).padStart(3, '0')}`,
    name: p["שם לקוח"],
    desc: p["תיאור"] || 'ללא תיאור',
    started: p["תאריך התחלה"] || '---',
    profit: p["רווח"] ? `₪${p["רווח"].toLocaleString()}` : '---',
    status: p["סטטוס"],
    statusColor: getStatusColor(p["סטטוס"]),
  }));
}

export default function RecentProjects({ projectsData }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // Convert incoming projectsData when it changes
  useEffect(() => {
    if (projectsData && Array.isArray(projectsData)) {
      setProjects(formatProjects(projectsData));
    }
  }, [projectsData]);

  if (projects.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>טוען פרויקטים...</p>
      </div>
    );
  }

  return (
    <div className="recent-projects-section">
      <h1 className="recent-projects-title">פרויקטים אחרונים</h1>
      <div className="projects-grid">
        {projects.map((p) => (
          <article key={p.id} className="project-card">
            <div className="project-header">
              <span className="project-id">{p.id}</span>
              <span className={`project-status ${p.statusColor}`}>{p.status}</span>
            </div>
            <div className="project-name">{p.name}</div>
            <div className="project-desc">{p.desc}</div>
            <div className="project-info">
              <div>התחלה: {p.started}</div>
              <div>רווח: {p.profit}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="view-all-button-container">
        <button
          className="view-all-button"
          onClick={() => navigate('/projects')}
          aria-label="View all projects"
        >
          <FiList className="view-all-icon" />
          <span>כל הפרויקטים</span>
        </button>
      </div>
    </div>
  );
}
