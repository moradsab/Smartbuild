import React, { useState } from 'react';
import { FiSave, FiUser, FiPhone, FiMapPin, FiFileText } from 'react-icons/fi';
import './NewVisit.css';
import ProjectDescriptionForm from './ProjectDescriptionForm';
import ImageUploadForm from './ImageUploadForm';
import { addVisit } from '../services/api';

const NewVisit = ({ customers = [] }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // Client info & project details
  const [client, setClient] = useState({
    name: '',
    phone: '',
    address: '',
    type: '' // סוג לקוח
  });
  const [projectDescription, setProjectDescription] = useState('');

  // Photos array
  const [photos, setPhotos] = useState([]);

  // Error & loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle existing customer selection
   */
  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomer(value);

    if (value === 'new') {
      // Clear for manual input
      setClient({ name: '', phone: '', address: '', type: '' });
      setProjectDescription('');
    } else if (value !== '') {
      const customer = customers[parseInt(value)];
      if (customer) {
        setClient({
          name: customer['שם'] || '',
          phone: customer['טלפון'] || '',
          address: customer['כתובת'] || '',
          type: customer['סוג לקוח'] || ''
        });
        setProjectDescription(customer['תיאור'] || '');
      }
    }
  };

  /**
   * Submit form to API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client.name.trim()) {
      setError('שדה שם הלקוח הינו שדה חובה');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();

      // Client info
      formData.append('name', client.name);
      formData.append('phone', client.phone);
      formData.append('address', client.address);
      formData.append('type', client.type); // סוג לקוח
      formData.append('projectDescription', projectDescription);

      // Photos
      photos.forEach((photo, index) => {
        if (photo.file) {
          formData.append(`photo_${index}`, photo.file);
        }
        formData.append(`photo_${index}_description`, photo.description || '');
        formData.append(`photo_${index}_height`, photo.height || '');
        formData.append(`photo_${index}_width`, photo.width || '');
        formData.append(`photo_${index}_length`, photo.length || '');
      });

      await addVisit(formData);

      // Reset
      setSelectedCustomer('');
      setClient({ name: '', phone: '', address: '', type: '' });
      setProjectDescription('');
      setPhotos([]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'שגיאה בשמירת הביקור');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="new-visit-form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-title">
        <FiFileText /> תיעוד ביקור שטח
      </h3>

      {error && <div className="error-message">{error}</div>}

      {/* Customer selection */}
      <section className="form-section">
        <label>בחר לקוח קיים או צור חדש:</label>
        <select value={selectedCustomer} onChange={handleCustomerChange}>
          <option value="">-- בחר --</option>
          {customers.map((c, index) => (
            <option key={index} value={index}>
              {c['שם']} - {c['כתובת']}
            </option>
          ))}
          <option value="new">+ צור לקוח חדש</option>
        </select>
      </section>

      {/* Client Info */}
      <section className="form-section">
        <label>
          <FiUser /> שם הלקוח: <span className="required">*</span>
        </label>
        <input
          type="text"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          placeholder="הקלד שם לקוח"
          required
        />

        <label><FiPhone /> טלפון:</label>
        <input
          type="tel"
          value={client.phone}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
          placeholder="הקלד טלפון"
        />

        <label><FiMapPin /> כתובת:</label>
        <input
          type="text"
          value={client.address}
          onChange={(e) => setClient({ ...client, address: e.target.value })}
          placeholder="הקלד כתובת"
        />

        {/* סוג לקוח */}
        <label>סוג לקוח:</label>
        <select
          value={client.type}
          onChange={(e) => setClient({ ...client, type: e.target.value })}
        >
          <option value="">-- בחר --</option>
          <option value="קבלן">קבלן</option>
          <option value="פרטי">פרטי</option>
        </select>
      </section>

      {/* Project Description */}
      <ProjectDescriptionForm
        projectDescription={projectDescription}
        setProjectDescription={setProjectDescription}
        setError={setError}
      />

      {/* Photos */}
      <ImageUploadForm photos={photos} setPhotos={setPhotos} setError={setError} />

      {/* Submit */}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'שומר...' : <><FiSave size={22} /> שמור ביקור שטח</>}
      </button>
    </form>
  );
};

export default NewVisit;
