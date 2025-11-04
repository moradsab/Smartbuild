import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrMoney } from "react-icons/gr";
import {
  FiArrowLeft,
  FiSearch,
  FiPlus,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import './Projects.css';

const Projects = ({ onBack = () => {}, onProjectSelect = () => {} }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
const projects = [
  {
    id: 'PRJ-001',
    name: "התקנת חלונות בדירה של מוראד סבאח",
    client: "מוראד סבאח",
    status: 'בתהליך',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    estimatedEndDate: '2024-02-15',
    revenue: 8500,
    expenses: 4200,
    profit: 4300,
    phone: '055-1234567',
  },
  {
    id: 'PRJ-002',
    name: 'שיפוץ חזית חנות של עומר נאסר',
    client: "עומר נאסר",
    status: 'הוזמן חומר',
    startDate: '2024-01-20',
    endDate: null,
    estimatedEndDate: '2024-03-01',
    revenue: 12000,
    expenses: 5800,
    profit: 6200,
    phone: '055-2345678',
  },
  {
    id: 'PRJ-003',
    name: 'הקמת גדר לגינה של חאמד אבו סאלח',
    client: 'חאמד אבו סאלח',
    status: 'הצעת מחיר נשלחה',
    startDate: '2024-01-25',
    endDate: null,
    estimatedEndDate: '2024-02-20',
    revenue: 6500,
    expenses: 0,
    profit: 6500,
    phone: '055-3456789',
  },
  {
    id: 'PRJ-004',
    name: 'התקנת דלת כניסה לאסמאעיל יאסין',
    client: 'אסמאעיל יאסין',
    status: 'הושלם',
    startDate: '2024-01-10',
    endDate: '2024-01-30',
    estimatedEndDate: '2024-01-30',
    revenue: 4200,
    expenses: 2100,
    profit: 2100,
    phone: '055-4567890',
  },
];


  const formatCurrency = (amount) =>
    new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.includes(searchTerm) ||
      p.client.includes(searchTerm) ||
      p.id.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    const now = new Date();
    const start = new Date(p.startDate);
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'this-month' && start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()) ||
      (dateFilter === 'last-month' &&
        ((now.getMonth() === 0 && start.getMonth() === 11 && start.getFullYear() === now.getFullYear() - 1) ||
         (start.getMonth() === now.getMonth() - 1 && start.getFullYear() === now.getFullYear())));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filtered.reduce((sum, p) => sum + p.revenue, 0);
  const totalExpenses = filtered.reduce((sum, p) => sum + p.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="dashboard-container">
      <div className="header">
        <button className="add-button">
          <FiPlus /> פרויקט חדש
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard title="כ פרויקטים" value={filtered.length} icon={<FiCalendar />} />
        <SummaryCard title="ס הכנסות" value={formatCurrency(totalRevenue)} icon={<FiTrendingUp />} />
        <SummaryCard title="ס הוצאות" value={formatCurrency(totalExpenses)} icon={<FiTrendingDown />} />
        <SummaryCard title="רווח נקי" value={formatCurrency(totalProfit)} icon={<GrMoney />} />
      </div>

      <div className="filters">
        <div className="search-input-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="חפש לפי שם, לקוח או מזהה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">כל הסטטוסים</option>
          <option value="בתהליך">בתהליך</option>
          <option value="הוזמן חומר">הוזמן חומר</option>
          <option value="הצעת מחיר נשלחה">הצעת מחיר נשלחה</option>
          <option value="הושלם">הושלם</option>
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">כל התאריכים</option>
          <option value="this-month">חודש נוכחי</option>
          <option value="last-month">חודש קודם</option>
        </select>
      </div>

      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>פרויקט</th>
              <th>לקוח</th>
              <th>סטטוס</th>
              <th>תאריכים</th>
              <th>מיקום</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                className="clickable-row"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/project/${p.id}`);
                  }
                }}
              >
                <td>
                  <div>{p.name}</div>
                  <small>{p.id}</small>
                </td>
                <td>
                  <div>{p.client}</div>
                  <small>{p.phone}</small>
                </td>
                <td>{p.status}</td>
                <td>
                  <div>התחלה: {new Date(p.startDate).toLocaleDateString('he-IL')}</div>
                  <div>
                    {p.endDate
                      ? `סיום: ${new Date(p.endDate).toLocaleDateString('he-IL')}`
                      : `משוער: ${new Date(p.estimatedEndDate).toLocaleDateString('he-IL')}`}
                  </div>
                </td>
                <td>חיפה</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="no-projects">
            <FiCalendar size={40} />
            <p>לא נמצאו פרויקטים</p>
            <p>נסה לשנות את החיפוש או הסינון</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="summary-card">
    <div>
      <div className="label">{title}</div>
      <div className="value">{value}</div>
    </div>
    <div className="icon-box">{icon}</div>
  </div>
);

export default Projects;
