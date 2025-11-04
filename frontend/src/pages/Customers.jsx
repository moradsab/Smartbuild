import React, { useState } from 'react';
import { FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { SiWhatsapp, SiWaze } from 'react-icons/si';
import { MdPhone } from 'react-icons/md';
import './Customers.css';

const Customers = ({ customers }) => {
  console.log(customers,"customersc")
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  if (!customers || !Array.isArray(customers) || customers.length === 0) {
    return <p>אין לקוחות להצגה</p>;
  }

  const formatPhone = (phone) => phone.replace(/\D/g, '');

  const openWaze = (address) => {
    const url = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
    window.open(url, '_blank');
  };

  return (
    <div className="customers-container">
      <div className="customers-list">
        {customers.map((customer, index) => {
          const id = index;
          const isSelected = id === selectedCustomerId;

          return (
            <div key={id}>
              <div
                className="customer-card"
                onClick={() => setSelectedCustomerId(isSelected ? null : id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="customer-header">{customer['שם']}</div>
                <div className="customer-info-icon">
                  <FiPhone />
                  <span>{customer['טלפון']}</span>
                </div>
                <div className="customer-info-icon">
                  <FiMapPin />
                  {customer['כתובת']}
                </div>
                <div className="customer-info-icon">
                  <FiCalendar />
                  {new Date(customer['תאריך']).toLocaleDateString('he-IL')}
                </div>
                <div className="customer-description">{customer['תיאור']}</div>
              </div>

              {isSelected && (
                <div className="customer-actions">
                  <button
                    className="action-icon whatsapp"
                    onClick={() =>
                      window.open(`https://wa.me/${formatPhone(customer['טלפון'])}`, '_blank')
                    }
                    title="שלח ווטסאפ"
                  >
                    <SiWhatsapp />
                  </button>

                  <button
                    className="action-icon call"
                    onClick={() =>
                      (window.location.href = `tel:${formatPhone(customer['טלפון'])}`)
                    }
                    title="התקשר"
                  >
                    <MdPhone />
                  </button>

                  <button
                    className="action-icon waze"
                    onClick={() => openWaze(customer['כתובת'])}
                    title="נווט עם Waze"
                  >
                    <SiWaze />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Customers;
