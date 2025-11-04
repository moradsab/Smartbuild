// src/components/Visit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FiUser, FiPhone, FiMapPin, FiCalendar, FiFileText,
  FiMaximize, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { getVisitById } from '../services/api';
import './Visit.css';

// A new function using a more reliable thumbnail endpoint for Google Drive images
const getGoogleDriveImageSrc = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    // This endpoint is more robust for direct embedding of public images.
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000-h1000`;
  }
  return null;
};

const ProjectDetails = ({ projectMetadata }) => (
  <div className="project-details-card">
    <h3 className="project-details-card-title">
      <FiFileText /> פרטי ביקור
    </h3>
    <div className="project-details-card__content">
      <div className="info-row">
        <FiUser className="info-row__icon" />
        <p><strong>שם לקוח:</strong> {projectMetadata?.['שם לקוח'] || 'לא צוין'}</p>
      </div>
      <div className="info-row">
        <FiPhone className="info-row__icon" />
        <p><strong>טלפון:</strong> {projectMetadata?.['טלפון'] || 'לא צוין'}</p>
      </div>
      <div className="info-row">
        <FiMapPin className="info-row__icon" />
        <p><strong>כתובת:</strong> {projectMetadata?.['כתובת'] || 'לא צוין'}</p>
      </div>
      <div className="info-row">
        <FiCalendar className="info-row__icon" />
        <p><strong>תאריך:</strong> {projectMetadata?.['תאריך ביקור'] || 'לא צוין'}</p>
      </div>
      <p><strong>סוג לקוח:</strong> {projectMetadata?.['סוג לקוח'] || 'לא צוין'}</p>
      <p className="project-details-card__description">
        <strong>תיאור פרוייקט:</strong>
        <br />
        {projectMetadata?.['תיאור'] || 'אין תיאור זמין'}
      </p>
    </div>
  </div>
);

const VisitItem = ({ item, isExpanded, onToggle }) => {
  const imageUrl = getGoogleDriveImageSrc(item['תמונה']);

  return (
    <div className="visit-item">
      <header className="visit-item__header" onClick={onToggle}>
        <h4 className="visit-item__title">פריט {item.row_number - 1}</h4>
        {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
      </header>

      {isExpanded && (
        <div className="visit-item__content">
          {imageUrl ? (
            <div className="visit-item__image-container">
              <img
                src={imageUrl}
                alt={`פריט ${item.row_number - 1}`}
                className="visit-item__image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found';
                }}
              />
            </div>
          ) : (
            <p className="visit-item__no-image">אין תמונה זמינה לפריט זה.</p>
          )}

          <div className="visit-item__details">
            <div className="dimensions-grid">
              <div><strong>אורך:</strong> {item['אורך'] || '-'}</div>
              <div><strong>רוחב:</strong> {item['רוחב'] || '-'}</div>
              <div><strong>גובה:</strong> {item['גובה'] || '-'}</div>
            </div>
            {item['תיאור'] && (
              <p className="visit-item__description"><strong>תיאור:</strong> {item['תיאור']}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Visit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialMetadata = location.state?.visitMetadata || null;
  const [projectMetadata, setProjectMetadata] = useState(initialMetadata);
  const [visitItems, setVisitItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemsResponse = await getVisitById(id);
        setVisitItems(itemsResponse);

        if (!initialMetadata) {
          console.warn('Project metadata not found in state.');
        }
      } catch (err) {
        console.error('Failed to fetch visit details:', err);
        setError('Failed to load visit details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, initialMetadata]);

  const handleToggleItem = (rowNumber) => {
    setExpandedItems((prev) => ({
      ...prev,
      [rowNumber]: !prev[rowNumber],
    }));
  };

  if (loading) return <div className="loading-message">טוען פרטי ביקור...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!projectMetadata && visitItems.length === 0) return <div className="no-visits-message">הביקור לא נמצא.</div>;

  return (
    <div className="visit-detail-page">
      <div className="main-content-container">
        <ProjectDetails projectMetadata={projectMetadata} />

        <section className="visit-items-section">
          <h3 className="section-title"><FiMaximize /> פריטים</h3>
          {visitItems.length > 0 ? (
            <div className="visit-items-list">
              {visitItems.map((item) => (
                <VisitItem
                  key={item.row_number}
                  item={item}
                  isExpanded={!!expandedItems[item.row_number]}
                  onToggle={() => handleToggleItem(item.row_number)}
                />
              ))}
            </div>
          ) : (
            <p className="no-items-message">אין פריטים זמינים לביקור זה.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Visit;