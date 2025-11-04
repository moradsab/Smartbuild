import React, { useState } from 'react';
import { FiRefreshCw, FiCheckCircle, FiEdit, FiChevronUp, FiX } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai'; 
import Recording from './Recording';
import './EditQuote.css';

const EditQuote = ({ initialSuggestion, onGenerate, isGenerating }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [editingCustomSuggestion, setEditingCustomSuggestion] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false); // New state to toggle the panel's visibility

  const handleSendSuggestion = () => {
    if (!inputText.trim()) {
      setError('אנא הזן טקסט ליצירה או לתיקון.');
      return;
    }
    setError('');
    onGenerate(inputText);
  };
  
  const handleIncludeSuggestion = () => {
    if (!initialSuggestion.trim()) {
      setError('אין הצעת שיפור אוטומטית.');
      return;
    }
    setError('');
    onGenerate(initialSuggestion);
  };

  if (!showEditPanel) {
    return (
      <div className="edit-quote-container edit-quote-toggle">
        <button 
          className="action-button primary-toggle" 
          onClick={() => setShowEditPanel(true)}
        >
          <FiEdit size={20} /> הצע שינויים
        </button>
      </div>
    );
  }

  return (
    <div className="edit-quote-container">
      <button className="hide-panel-button" onClick={() => setShowEditPanel(false)}>
        <FiChevronUp size={20} />
      </button>
      {error && <div className="error-message">{error}</div>}

      {editingCustomSuggestion || !initialSuggestion ? (
        // UI for writing a new suggestion
        <div className="form-section">
          <label className="input-label">
            <AiFillStar /> הצע שינויים חדשים
          </label>
          <div className="textarea-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              placeholder="הקלד או הקלט את הצעת השינוי שלך..."
              disabled={isRecording || isGenerating}
            />
            <Recording
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setError={setError}
              onTextReceived={(text) => setInputText((prev) => prev + " " + text)}
            />
          </div>
          <div className="suggestion-actions">
            <button 
              className="send-suggestion-button" 
              onClick={handleSendSuggestion}
              disabled={isGenerating || isRecording}
            >
              {isGenerating ? (
                <>
                  <FiRefreshCw className="spinner" /> יוצר...
                </>
              ) : (
                <>
                  <FiRefreshCw size={20} /> שלח הצעה וצור מחדש
                </>
              )}
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                setEditingCustomSuggestion(false);
                setShowEditPanel(false);
              }}
              disabled={isGenerating}
            >
              <FiX size={20} /> ביטול
            </button>
          </div>
        </div>
      ) : (
        // UI for showing the suggested improvements card
        <div className="suggestion-card-section">
          <label className="input-label">
            <AiFillStar /> הצעת שיפורים אוטומטית
          </label>
          <div className="suggestion-card">
            <p>{initialSuggestion}</p>
          </div>
          <div className="suggestion-actions">
            <button 
              className="action-button primary" 
              onClick={handleIncludeSuggestion}
              disabled={isGenerating}
            >
              <FiCheckCircle size={20} /> כלול שיפורים מוצעים
            </button>
            <button 
              className="action-button secondary" 
              onClick={() => setEditingCustomSuggestion(true)}
              disabled={isGenerating}
            >
              <FiEdit size={20} /> כתוב הצעת שיפור חדשה
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditQuote;
