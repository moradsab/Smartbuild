import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiUsers, FiFileText, FiPieChart } from 'react-icons/fi';
import '../components/Stats.css';

function calcProfitPercent(stats) {
  return Math.round((stats["רווח"] / 120000) * 100);
}

function formatStats(rawStats) {
  return [
    {
      title: 'התקדמות',
      value: `${Math.round(rawStats["התקדמות"] * 100)}%`,
      note: `${Math.round(rawStats["התקדמות"] * 100)}% מהמשימות הושלמו`,
      icon: FiTrendingUp,
      color: 'progress'
    },
    {
      title: 'חוב לקוחות',
      value: `₪${rawStats["חובות לקוחות"].toLocaleString()}`,
      note: 'יתרה לתשלום',
      icon: FiUsers,
      color: 'debt'
    },
    {
      title: 'חובות העסק',
      value: `₪${rawStats["חובות העסק"].toLocaleString()}`,
      note: 'תשלומים לספקים',
      icon: FiFileText,
      color: 'business-debt'
    },
    {
      title: 'רווח נקי',
      value: `₪${rawStats["רווח"].toLocaleString()}`,
      note: `רווחיות: ${calcProfitPercent(rawStats)}%`,
      icon: FiPieChart,
      color: 'profit'
    }
  ];
}

export default function Stats({ stats }) {
  const [formattedStats, setFormattedStats] = useState(null);

  // When stats is available or changes, format it and set it in state
  useEffect(() => {
    if (stats) {
      setFormattedStats(formatStats(stats));
    }
  }, [stats]);

  // Show loading until stats is ready
  if (!formattedStats) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>טוען נתוני סטטיסטיקות...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {formattedStats.map(({ title, value, note, icon: Icon, color }) => (
        <div key={title} className={`stat-card clean ${color}`}>
          <div className="stat-header-row">
            <div className="stat-icon-wrapper">
              <Icon className="stat-icon" />
            </div>
            <h3 className="stat-title">{title}</h3>
          </div>
          <div className="stat-content">
            <p className="stat-value">{value}</p>
            <p className="stat-note">{note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
