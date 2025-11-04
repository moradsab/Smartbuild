import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiMinus, FiList } from 'react-icons/fi';
import { getQuoteById, saveQuote } from '../services/api';
import './Quote.css';
import EditQuote from '../components/EditQuote';

const Quote = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quoteText, setQuoteText] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // New state for AI generation
  const [saveMessage, setSaveMessage] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [showItems, setShowItems] = useState(false);
  const [improvementSuggestion, setImprovementSuggestion] = useState(''); // New state for suggestion

  useEffect(() => {
    const fetchQuote = async () => {
      const quoteData = location.state?.quoteData;
      
      if (quoteData) {
        try {
          const data = await getQuoteById(quoteData);
          setQuoteText(data[0]?.text || ''); 
          setItems(data.slice(1) || []);
          // Assuming the API response includes a suggestion key
          setImprovementSuggestion(data[0]?.suggestion || '');
        } catch (err) {
          console.error("Failed to fetch quote:", err);
          setError("שגיאה בטעינת הצעת המחיר. אנא נסה שוב.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("לא ניתן לטעון את פרטי הצעת המחיר. אנא חזור לדף הראשי.");
        setLoading(false);
      }
    };
    fetchQuote();
  }, [quoteId, location.state]);
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await saveQuote(quoteId, { quoteText });
      setSaveMessage("השינויים נשמרו בהצלחה!");
    } catch (err) {
      console.error("Failed to save quote:", err);
      setSaveMessage(`שגיאה בשמירת השינויים: ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // New function to handle the AI generation logic
  const handleGenerateQuote = async (textToGenerate) => {
    setIsGenerating(true);
    setError('');

    try {
      // Simulating an AI generation API call with a delay
      console.log('Generating AI response for:', textToGenerate);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedResponse = `
      שלום ללקוח,
      
      בהמשך לשיחתנו ולסקירה של הפרויקט, מצורפת בזאת הצעת מחיר מפורטת עבור עבודתך.
      
      אנו מתחייבים לספק את השירותים הבאים:
      
      1. שירות א' - תיאור קצר.
      2. שירות ב' - תיאור קצר.
      3. שירות ג' - תיאור קצר.
      
      מחיר כולל: 10,000 ש"ח.
      
      לכל שאלה או הבהרה, אל תהסס לפנות אלינו.
      
      בכבוד רב,
      הצוות.
      `;
      
      setQuoteText(simulatedResponse);
      
    } catch (err) {
      console.error("Failed to generate quote:", err);
      setError('שגיאה ביצירת הצעת המחיר. אנא נסה שוב.');
    } finally {
      setIsGenerating(false);
    }
  };


  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 12));
  };

  if (loading) {
    return <div className="loading-message">טוען הצעת מחיר...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="quote-detail-page">
              <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft /> חזור
        </button>
      <div className="quote-actions">
        <button onClick={handleSave} className="save-button" disabled={isSaving}>
          <FiSave /> {isSaving ? 'שומר...' : 'שמור שינויים'}
        </button>
        <div className="text-actions">
          <button onClick={decreaseFontSize} className="icon-button" aria-label="הקטן פונט">
            <FiMinus />
          </button>
          <button onClick={increaseFontSize} className="icon-button" aria-label="הגדל פונט">
            <FiPlus />
          </button>
          <button onClick={() => setShowItems(!showItems)} className="icon-button" aria-label="הצג פריטים">
            <FiList />
          </button>
        </div>
      </div>
      {saveMessage && <div className="save-message">{saveMessage}</div>}

      {showItems && (
        <div className="items-card-view">
          <h3 className="items-title">פריטים בפרויקט</h3>
          <div className="item-list">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h4>{item.שם}</h4>
                    <span className="item-quantity">כמות: {item.כמות}</span>
                  </div>
                  <p className="item-description">{item.תיאור}</p>
                  <span className="item-price">מחיר: {item.מחיר} ₪</span>
                </div>
              ))
            ) : (
              <p>אין פריטים להצגה.</p>
            )}
          </div>
        </div>
      )}

      <div className="quote-editor">
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          className="quote-textarea"
          style={{ fontSize: `${fontSize}px` }}
          placeholder="טקסט הצעת המחיר יופיע כאן..."
        />
        
        <EditQuote 
          initialSuggestion={improvementSuggestion}
          onGenerate={handleGenerateQuote}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default Quote;