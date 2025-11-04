import React, { useState } from 'react';
import { FiSave, FiUser, FiPhone, FiMapPin, FiCalendar, FiFileText, FiChevronDown } from 'react-icons/fi';
import { LiaUsersCogSolid } from "react-icons/lia";
import ProjectDescriptionForm from './ProjectDescriptionForm';
import './NewCustomer.css';
import { addCustomer } from '../services/api'; // <-- Adjust path carefully!

const NewCustomer = () => {
  const [customer, setCustomer] = useState({
    name: '',
    type: '',
    phone: '',
    location: '',
    visitDate: '',
  });
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...customer, projectDescription };
      await addCustomer(payload);
      alert('הלקוח נוסף בהצלחה!');
      // reset form
      setCustomer({ name: '', type: '', phone: '', location: '', visitDate: '' });
      setProjectDescription('');
    } catch (err) {
      console.error('API Error:', err);
      setError('לא הצלחנו לשמור את הלקוח, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}

      <form className="new-customer-form" onSubmit={handleSubmit}>
        <h3 className="form-title"><FiFileText /> יצירת לקוח חדש</h3>

        <label><FiUser /> שם הלקוח:</label>
        <input
          type="text"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          placeholder="הקלד שם לקוח"
          disabled={loading}
        />

        <label><LiaUsersCogSolid /> סוג לקוח:</label>
        <div className="select-wrapper">
          <select
            value={customer.type}
            onChange={(e) => setCustomer({ ...customer, type: e.target.value })}
            disabled={loading}
          >
            <option value="" disabled>בחר סוג לקוח</option>
            <option value="פרטי">פרטי</option>
            <option value="קבלן">קבלן</option>
          </select>
          <FiChevronDown className="select-arrow" />
        </div>

        <label><FiPhone /> טלפון:</label>
        <input
          type="tel"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="הקלד טלפון"
          disabled={loading}
        />

        <label><FiMapPin /> מיקום:</label>
        <input
          type="text"
          value={customer.location}
          onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
          placeholder="הקלד מיקום"
          disabled={loading}
        />

        <label><FiCalendar /> תאריך ביקור:</label>
        <input
          type="date"
          value={customer.visitDate}
          onChange={(e) => setCustomer({ ...customer, visitDate: e.target.value })}
          disabled={loading}
        />

        <ProjectDescriptionForm
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
          setError={setError}
        />

        <button type="submit" className="submit-button" disabled={loading}>
          <FiSave size={22} /> {loading ? 'שומר...' : 'שמור לקוח חדש'}
        </button>
      </form>
    </div>
  );
};

export default NewCustomer;
