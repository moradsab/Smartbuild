import React, { useState } from 'react';
import './NewInvoice.css';
import {
  FiFileText,
  FiCheck,
  FiX,
  FiDollarSign,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiHash,
  FiClipboard,
} from 'react-icons/fi';

const mockProjects = [
  {
    id: 1,
    name: 'חלון למרפסת - דני לוי',
    client: { name: 'דני לוי', phone: '052-1234567' },
    description: 'התקנת חלון קבוע ודלת הזזה במרפסת.',
  },
  {
    id: 2,
    name: 'מקלחון - נטע כהן',
    client: { name: 'נטע כהן', phone: '054-9876543' },
    description: 'התקנת מקלחון זכוכית עם פרופיל שחור.',
  },
];

const NewInvoice = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [invoiceType, setInvoiceType] = useState('רגילה');
  const [isPaid, setIsPaid] = useState(false);
  const [dealClosed, setDealClosed] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [invoiceText, setInvoiceText] = useState('');

  const selectedProject = mockProjects.find((p) => p.id === Number(selectedProjectId));

  const generateInvoice = () => {
    if (!selectedProject || !invoiceNumber || !amount || !issueDate) return;

    const text = `
חשבונית מס מספר: ${invoiceNumber}
תאריך: ${issueDate}
לקוח: ${selectedProject.client.name} (${selectedProject.client.phone})
פרויקט: ${selectedProject.description}

סוג חשבונית: ${invoiceType}
סכום: ${amount} ₪
סטטוס תשלום: ${isPaid ? 'שולם' : 'טרם שולם'}
סטטוס עסקה: ${dealClosed ? 'העסקה נסגרה' : 'העסקה פתוחה'}
    `.trim();

    setInvoiceText(text);
  };

  return (
    <div className="invoice-page">
      <h2 className="invoice-title"><FiFileText /> יצירת חשבונית חדשה</h2>

      <div className="form-group">
        <label><FiBriefcase /> בחר פרויקט:</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">בחר פרויקט</option>
          {mockProjects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <>
          <div className="form-group">
            <label><FiHash /> מספר חשבונית:</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="לדוגמה: 10023"
            />
          </div>

          <div className="form-group">
            <label><FiCalendar /> תאריך חשבונית:</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><FiFileText /> סוג חשבונית:</label>
            <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)}>
              <option value="רגילה">רגילה</option>
              <option value="מקדמה">מקדמה</option>
              <option value="סופית">סופית</option>
              <option value="מותאמת אישית">מותאמת אישית</option>
            </select>
          </div>

          <div className="form-group">
            <label><FiDollarSign /> סכום לתשלום (₪):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="סכום החשבונית"
              min="0"
            />
          </div>

          <div className="form-group checkbox-group">
            <label><input type="checkbox" checked={isPaid} onChange={() => setIsPaid(!isPaid)} /> שולם</label>
            <label><input type="checkbox" checked={dealClosed} onChange={() => setDealClosed(!dealClosed)} /> העסקה נסגרה</label>
          </div>

          <button className="generate-button" onClick={generateInvoice}>
            <FiClipboard /> צור חשבונית
          </button>

          {invoiceText && (
            <div className="invoice-preview">
              <h3>תצוגת חשבונית:</h3>
              <textarea value={invoiceText} onChange={(e) => setInvoiceText(e.target.value)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewInvoice;
