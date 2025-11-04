import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import './Visits.css';

const Visits = ({ visits }) => {
  const navigate = useNavigate();

  if (!visits || visits.length === 0) {
    return <div className="no-visits-message">לא נמצאו ביקורים.</div>;
  }

  const handleCardClick = (visit) => {
    // Pass the entire visit object as state
    navigate(`/visit/${visit.ביקור}`, { state: { visitMetadata: visit } });
  };

  return (
    <div className="visits-container">
      <div className="visit-cards-grid">
        {visits.map((visit) => (
          <div
            key={visit.ביקור}
            className="visit-card"
            // Change the click handler to pass the whole visit object
            onClick={() => handleCardClick(visit)}
          >
            <div className="card-header">
              <span className="customer-name">
                <FiUser /> {visit['שם לקוח']}
              </span>
              <span className="visit-date">
                <FiCalendar /> {visit['תאריך ביקור']}
              </span>
            </div>
            <div className="card-body">
              <p className="card-info">
                <FiPhone /> {visit['טלפון']}
              </p>
              <p className="card-info">
                <FiMapPin /> {visit['כתובת']}
              </p>
              <p className="card-description">{visit['תיאור']}</p>
            </div>
            <div className="card-footer">
              <span className="customer-type">{visit['סוג לקוח']}</span>
              <span className="item-count">{visit['מספר פריטים']} פריטים</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visits;