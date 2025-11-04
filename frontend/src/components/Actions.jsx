import React from 'react';
import { useNavigate } from 'react-router-dom';
// Updated icons for better business context
import { FiMapPin, FiEdit } from 'react-icons/fi'; // Changed FiCalendar to FiMapPin, FiDollarSign to FiCreditCard
import './Actions.css';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { LuUserRoundPlus } from "react-icons/lu";

export default function Actions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'לקוח',
      icon: <LuUserRoundPlus className="action-icon" size={10}/>, // Changed to CreditCard icon (as Shekel sign is not available in Fi icons)
      onClick: () => navigate('/new-customer'),
    },
    {
      label: 'ביקור',
      icon: <FiMapPin className="action-icon" />, // Changed to MapPin icon
      onClick: () => navigate('/new-visit'),
    },
    {
      label: 'הצעה',
      icon: <FiEdit className="action-icon" />,
      onClick: () => navigate('/new-quote'),
    },
    {
      label: 'חשבונית',
      icon: <LiaFileInvoiceSolid className="action-icon" size={10}/>, // Changed to CreditCard icon (as Shekel sign is not available in Fi icons)
      onClick: () => navigate('/new-invoice'),
    },
    
  ];

  return (
    <div className="actions-wrapper">
      <div className="actions-grid">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="action-card"
            onClick={action.onClick}
            type="button"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
