// src/components/Quotes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiFileText, FiPlus, FiDownload, FiEdit,FiShare2 } from 'react-icons/fi';
import { getQuotes } from '../services/api';
import './Quotes.css';

const Quotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // New state to track the selected quote for button visibility
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await getQuotes();
        if (Array.isArray(data)) {
          setQuotes(data);
        } else if (data && typeof data === 'object') {
          // If a single object is returned, wrap it in an array
          setQuotes([data]);
        } else {
          console.error("API did not return an array or a valid object:", data);
          setQuotes([]);
        }
      } catch (err) {
        console.error("Failed to fetch quotes:", err);
        setError("שגיאה בטעינת הצעות המחיר. אנא נסה שוב.");
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  if (loading) {
    return <div className="loading-message">טוען הצעות מחיר...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (quotes.length === 0) {
    return (
      <div className="no-quotes-container">
        <div className="no-quotes-message">
            <p>לא נמצאו הצעות מחיר.</p>
            <button className="add-button" onClick={() => navigate('/new-quote')}>
                <FiPlus /> הוסף הצעת מחיר חדשה
            </button>
        </div>
      </div>
    );
  }

  // New function to handle card click, now it toggles button visibility
  const handleCardClick = (quote) => {
    setSelectedQuote(selectedQuote === quote.row_number ? null : quote.row_number);
  };

  const handleEditClick = (quote) => {
    // Navigate to the quote page with the full quote data
    navigate(`/quote/${quote.row_number}`, { state: { quoteData: quote } });
  };

  return (
    <div className="quotes-container">
      <div className="header-with-button">
        <h2>הצעות מחיר</h2>
      </div>
      <div className="quote-cards-grid">
        {quotes.map((quote) => (
          <div
            key={quote.row_number}
            className={`quote-card ${selectedQuote === quote.row_number ? 'selected' : ''}`}
          >
            <div className="card-header" onClick={() => handleCardClick(quote)}>
              <span className="customer-name">
                <FiUser /> {quote['שם לקוח'] || 'לקוח לא ידוע'}
              </span>
              <span className="quote-date">
                <FiCalendar /> {quote['תאריך ביקור'] || 'לא צוין'}
              </span>
            </div>
            <div className="card-body" onClick={() => handleCardClick(quote)}>
              <p className="card-info">
                <FiFileText /> {quote['תיאור'] ? quote['תיאור'].substring(0, 50) + '...' : 'אין תיאור'}
              </p>
              <p
                className={`card-total ${
                  quote['סטטוס'] === 'בעריכה'
                    ? 'editing'
                    : quote['סטטוס'] === 'הצעת מחיר נשלחה ללקוח'
                    ? 'sent'
                    : ''
                }`}
              >
                {quote['סטטוס'] || 'בסטטוס לא ידוע'}
              </p>
            </div>
            
            {/* Conditional rendering of buttons based on selectedQuote state */}
            {selectedQuote === quote.row_number && (
              <div className="card-actions">

                <button 
                  className="action-button"
                  onClick={() => handleEditClick(quote)}
                >
                  <FiEdit /> ערוך
                </button>
                <button className="action-button">
                  <FiShare2 /> שתף
                </button>
                <button className="action-button">
                  <FiPlus /> פרויקט
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quotes;
