import React, { useState, useEffect } from 'react';
import './NewQuote.css';
import {
  FiEdit,
  FiUser,
  FiPhone,
  FiMapPin,
  FiPlus,
  FiFileText,
  FiTrash2,
  FiImage,
  FiChevronDown, 
  FiChevronUp
} from 'react-icons/fi';
import { getVisitById, createQuote } from '../services/api';

const getGoogleDriveImageSrc = (url) => {
  if (!url || typeof url !== 'string') return null;

  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    // Thumbnail endpoint shows the image directly
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  return null;
};


const VisitItem = ({ item, isExpanded, onToggle, index }) => {
  const imageUrl = getGoogleDriveImageSrc(item['תמונה']);
  console.log('Image link raw:', item['תמונה']);
console.log('Image link converted:', imageUrl);
  return (
    <div className="visit-item">
      <header className="visit-item__header" onClick={onToggle}>
        <h4 className="visit-item__title">פריט {index + 1}</h4>
        {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
      </header>

      {isExpanded && (
        <div className="visit-item__content">
          {imageUrl ? (
            <div className="visit-item__image-container">
              <img
                src={imageUrl}
                alt={`פריט ${index + 1}`}
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

const NewQuote = ({ visits }) => {
  const [selectedVisitRowNumber, setSelectedVisitRowNumber] = useState('');
  const [visitItems, setVisitItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [clientData, setClientData] = useState({ name: '', phone: '', address: '', description: '' });
  const [expandedItems, setExpandedItems] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  useEffect(() => {
    if (selectedVisitRowNumber) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          const visitData = visits.find(v => v.row_number.toString() === selectedVisitRowNumber);
          
          if (visitData) {
            setClientData({ 
              name: visitData['שם לקוח'], 
              phone: visitData['טלפון'], 
              address: visitData['כתובת'], 
              description: visitData['תיאור'],
              visitDate: visitData['תאריך ביקור'] || '',
              type: visitData['סוג לקוח'] || ''
            });

            const apiId = visitData['ביקור'];
            if (apiId) {
              const itemsResponse = await getVisitById(apiId);
              setVisitItems(itemsResponse);
            } else {
              setVisitItems([]);
            }
          }
        } catch (err) {
          console.error("Failed to fetch visit items:", err);
          setError("Failed to load visit details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setVisitItems([]);
      setClientData({ name: '', phone: '', address: '', description: '' });
    }
  }, [selectedVisitRowNumber, visits]);

  const handleToggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: '', price: '', description: '' }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = async () => {
    if (!clientData.name) {
      setSubmitMessage("אנא מלא לפחות את שם הלקוח כדי ליצור הצעת מחיר.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // יצירת אובייקט עם כל נתוני הטופס, כולל פריטי הביקור
      const quoteData = {
        client: clientData,
        items: items, // פריטים שנוספו ידנית בטופס
        visitItems: visitItems, // פריטים מהביקור המקורי
        sourceVisitId: selectedVisitRowNumber,
      };

      // קריאה לפונקציה החדשה ב-API
      await createQuote(quoteData);

      setSubmitMessage("הצעת המחיר נשלחה בהצלחה!");
      // איפוס הטופס לאחר שליחה מוצלחת
      setSelectedVisitRowNumber('');
      setClientData({ name: '', phone: '', address: '', description: '' });
      setItems([]);
      setVisitItems([]);
    } catch (err) {
      console.error("Failed to submit quote:", err);
      setSubmitMessage(`שליחת הצעת המחיר נכשלה: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quote-page">
      <h2 className="quote-title"><FiFileText /> יצירת הצעת מחיר חדשה</h2>

      <div className="form-group">
        <label>בחר ביקור שטח קיים או מלא פרטים חדשים:</label>
        <select
          value={selectedVisitRowNumber}
          onChange={(e) => setSelectedVisitRowNumber(e.target.value)}
        >
          <option value="">צור חדש...</option>
          {visits && visits.map((v) => (
            <option key={v.row_number} value={v.row_number}>
              {v['שם לקוח']} - {v['תיאור'] ? v['תיאור'].slice(0, 30) + '...' : 'אין תיאור'}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>טוען פרטי ביקור...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <section className="section client-info">
        <h3><FiUser /> פרטי לקוח</h3>
        <div className="input-group">
          <label>שם:</label>
          <input type="text" name="שם לקוח" value={clientData.name} onChange={handleClientDataChange} placeholder="שם הלקוח" />
        </div>
        <div className="input-group">
          <label><FiPhone /> טלפון:</label>
          <input type="numeric" name="טלפון" value={clientData.phone} onChange={handleClientDataChange} placeholder="מספר טלפון" />
        </div>
        <div className="input-group">
          <label><FiMapPin /> כתובת:</label>
          <input type="text" name="כתובת" value={clientData.address} onChange={handleClientDataChange} placeholder="כתובת" />
        </div>
        <div className="input-group">
          <label><FiFileText /> תיאור כללי:</label>
          <textarea name="תיאור כללי" value={clientData.description} onChange={handleClientDataChange} placeholder="תיאור הפרויקט"></textarea>
        </div>
      </section>

      {visitItems.length > 0 && (
        <section className="section">
          <h3><FiImage /> פריטים מהביקור</h3>
          <div className="visit-items-list">
            {visitItems.map((item, index) => (
              <VisitItem
                key={index}
                item={item}
                index={index}
                isExpanded={!!expandedItems[index]}
                onToggle={() => handleToggleItem(index)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h3><FiEdit /> הוסף פריטים להצעה</h3>
        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <input
              placeholder="שם פריט"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="כמות"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
            />
            <input
              type="number"
              placeholder="מחיר ליחידה"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', e.target.value)}
            />
            <textarea
              placeholder="תיאור פריט"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />
            <button onClick={() => removeItem(index)}><FiTrash2 /></button>
          </div>
        ))}
        <button onClick={addItem} className="add-item-button"><FiPlus /> הוסף פריט</button>
      </section>

      <section className="section">
        <button 
          onClick={handleSubmitQuote} 
          className="generate-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'שולח...' : 'שלח הצעת מחיר'}
        </button>
        {submitMessage && (
          <div className="submit-message">
            <p>{submitMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default NewQuote;