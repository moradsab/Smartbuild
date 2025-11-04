import React, { useState } from 'react';
import './Project.css'; // New CSS file
import { GrMoney } from "react-icons/gr";
import {
  FaArrowLeft,
  FaUser,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaDollarSign,
  FaCamera,
  FaReceipt,
  FaCalendarAlt,
  FaFileAlt,
  FaCreditCard,
  FaPlus,
  FaUpload,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaClock,
  FaChartLine
} from 'react-icons/fa';

// Mock useToast hook - you'd replace this with your actual toast implementation
const useToast = () => {
  return {
    toast: ({ title, description }) => {
      console.log(`Toast: ${title} - ${description}`);
      // In a real app, you'd show a visual toast notification here
    },
  };
};

// Renamed component from ProjectDetail to Project
const Project = ({ projectId, onBack }) => {
  const { toast } = useToast();
  // State to manage which tab is currently active. 'overview' is the default.
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data (translated and currency updated)
  const project = {
    id: 'PRJ-001',
    name: 'התקנת חלונות לבית',
    client: {
      name: 'מוראד סבאח',
      phone: '0524810945',
      address: 'רחוב אלון 123, רמת גן, ישראל'
    },
    status: 'בתהליך',
    startDate: '2024-01-15',
    endDate: null,
    estimatedEndDate: '2024-02-15',
    description: 'התקנת חלונות אלומיניום מלאה לנכס מגורים, כולל 8 חלונות עם מסגרות מותאמות אישית.',
    salesRep: 'ג׳ון דו',
    quote: {
      id: 'QUO-001',
      total: 8500,
      status: 'אושר',
      items: [
        { description: 'מסגרת חלון אלומיניום (גדול)', quantity: 4, unitPrice: 1200, total: 4800 },
        { description: 'מסגרת חלון אלומיניום (בינוני)', quantity: 4, unitPrice: 800, total: 3200 },
        { description: 'עבודת התקנה', quantity: 1, unitPrice: 500, total: 500 }
      ]
    },
    expenses: [
      { id: 'EXP-001', date: '2024-01-16', category: 'חומרים', description: 'מסגרות אלומיניום מספק', amount: 2800, receipt: 'receipt1.jpg' },
      { id: 'EXP-002', date: '2024-01-18', category: 'עבודה', description: 'צוות התקנה יום 1', amount: 600, receipt: null },
      { id: 'EXP-003', date: '2024-01-20', category: 'חומרים', description: 'חומרה ומחברים', amount: 250, receipt: 'receipt2.jpg' },
      { id: 'EXP-004', date: '2024-01-22', category: 'תחבורה', description: 'השכרת משאית משלוחים', amount: 150, receipt: 'receipt3.jpg' }
    ],
    photos: [
      { id: 'PH-001', date: '2024-01-15', title: 'לפני התקנה', url: 'https://smartco.co.il/logo.png', category: 'לפני' },
      { id: 'PH-002', date: '2024-01-18', title: 'התקדמות ההתקנה', url: 'https://smartco.co.il/logo.png', category: 'התקדמות' },
      { id: 'PH-003', date: '2024-01-20', title: 'התקנת מסגרת', url: 'https://smartco.co.il/logo.png', category: 'התקדמות' }
    ],
    tasks: [
      { id: 'TSK-001', title: 'מדידת אתר', assignee: 'מייק סמית׳', dueDate: '2024-01-16', status: 'הושלם' },
      { id: 'TSK-002', title: 'רכישת חומרים', assignee: 'ג׳ון דו', dueDate: '2024-01-18', status: 'הושלם' },
      { id: 'TSK-003', title: 'התקנת מסגרת', assignee: 'צוות התקנה', dueDate: '2024-01-25', status: 'בתהליך' },
      { id: 'TSK-004', title: 'בדיקה סופית', assignee: 'מייק סמית׳', dueDate: '2024-02-10', status: 'ממתין' }
    ],
    invoices: [
      {
        id: 'INV-001',
        date: '2024-01-20',
        amount: 8500,
        status: 'חלקי',
        payments: [
          { date: '2024-01-22', amount: 4000, method: 'העברה בנקאית' },
          { date: '2024-01-28', amount: 2000, method: 'צ׳ק' }
        ],
        remaining: 2500
      }
    ]
  };

  // Calculate total expenses, revenue, profit, and profit margin
  const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenue = project.quote.total;
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0; // Handle division by zero

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  // Helper function to get status-based CSS classes
  const getStatusColor = (status) => {
    switch (status) {
      case 'בתהליך': return 'status-blue';
      case 'הושלם': return 'status-green';
      case 'ממתין': return 'status-yellow';
      case 'בהמתנה': return 'status-red';
      case 'אושר': return 'status-green';
      case 'חלקי': return 'status-yellow';
      default: return 'status-gray';
    }
  };

  // Handlers for mock actions
  const handleAddExpense = () => {
    toast({
      title: "הוסף הוצאה",
      description: "טופס הוספת הוצאה ייפתח כאן",
    });
  };

  const handleUploadPhoto = () => {
    toast({
      title: "העלה תמונה",
      description: "דיאלוג העלאת תמונה ייפתח כאן",
    });
  };

  // Reusable UI Components (now with semantic classes)
  const Card = ({ children, className = '' }) => (
    <div className={`project-card ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );

  const Badge = ({ children, className = '' }) => (
    <span className={`project-badge ${className}`}>
      {children}
    </span>
  );

  const Button = ({ children, onClick, variant = 'default', size = 'md', className = '' }) => {
    const baseStyle = "project-button"; // Base class for all buttons
    const variants = {
      default: "button-default",
      outline: "button-outline",
      ghost: "button-ghost",
    };
    const sizes = {
      sm: "button-sm",
      md: "button-md",
      lg: "button-lg",
    };
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </button>
    );
  };

  // Custom Tabs components to manage state and rendering
  const Tabs = ({ children, value, onValueChange, className = '' }) => (
    <div className={`project-tabs ${className}`}>
      {children}
    </div>
  );

  const TabsList = ({ children, className = '' }) => (
    <div className={`project-tabs-list ${className}`}>
      {children}
    </div>
  );

  const TabsTrigger = ({ children, value, onClick, className = '' }) => (
    <button
      onClick={() => onClick(value)} // This is where the activeTab state is updated
      className={`project-tabs-trigger ${activeTab === value ? 'active' : ''} ${className}`}
    >
      {children}
    </button>
  );

  const TabsContent = ({ children, value, className = '' }) => (
    // Content is rendered only if its value matches the activeTab
    <div className={`project-tabs-content ${activeTab === value ? '' : 'hidden'} ${className}`}>
      {children}
    </div>
  );

  const Label = ({ children, className = '' }) => (
    <label className={`project-label ${className}`}>
      {children}
    </label>
  );

  // Table components for structured data display
  const Table = ({ children, className = '' }) => (
    <div className={`project-table-wrapper ${className}`}>
      <table className="project-table">
        {children}
      </table>
    </div>
  );

  const TableHeader = ({ children, className = '' }) => (
    <thead className={`project-table-header ${className}`}>
      {children}
    </thead>
  );

  const TableHead = ({ children, className = '' }) => (
    <th scope="col" className={`project-table-head ${className}`}>
      {children}
    </th>
  );

  const TableBody = ({ children, className = '' }) => (
    <tbody className={`project-table-body ${className}`}>
      {children}
    </tbody>
  );

  const TableRow = ({ children, className = '' }) => (
    <tr className={`project-table-row ${className}`}>
      {children}
    </tr>
  );

  const TableCell = ({ children, className = '' }) => (
    <td className={`project-table-cell ${className}`}>
      {children}
    </td>
  );

  return (
    <div className="project-detail-container">
      {/* Header */}
      <div className="project-header">
        <Button variant="ghost" size="sm" onClick={onBack} className="project-back-button">
          <FaArrowLeft className="project-icon-rtl" />
          חזרה לפרויקטים
        </Button>
        <div className="project-header-info">
          <div className="project-title-group">
            <h1 className="project-main-title">{project.name}</h1>
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
          </div>
          <p className="project-subtitle">
            {project.id} • התחיל ב- {new Date(project.startDate).toLocaleDateString('he-IL')}
          </p>
        </div>
        <Button variant="outline" className="project-edit-button">
          <FaEdit className="project-icon-ltr" />
          ערוך פרויקט
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="project-stats-grid">
        <Card>
          <CardContent className="card-content-no-padding-top">
            <div className="stat-item">
              <div>
                <p className="stat-label">סה״כ הכנסות</p>
                <p className="stat-value text-green">{formatCurrency(totalRevenue)}</p>
              </div>
              <GrMoney className="stat-icon text-green" />
              
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="card-content-no-padding-top">
            <div className="stat-item">
              <div>
                <p className="stat-label">סה״כ הוצאות</p>
                <p className="stat-value text-red">{formatCurrency(totalExpenses)}</p>
              </div>
              <FaReceipt className="stat-icon text-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="card-content-no-padding-top">
            <div className="stat-item">
              <div>
                <p className="stat-label">רווח נקי</p>
                <p className={`stat-value ${profit >= 0 ? 'text-green' : 'text-red'}`}>
                  {formatCurrency(profit)}
                </p>
              </div>
              <FaChartLine className="stat-icon text-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="card-content-no-padding-top">
            <div className="stat-item">
              <div>
                <p className="stat-label">שיעור רווח</p>
                <p className={`stat-value ${profit >= 0 ? 'text-green' : 'text-red'}`}>
                  {profitMargin}%
                </p>
              </div>
              <span className="stat-emoji" role="img" aria-label="chart">📊</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger onClick={setActiveTab} value="overview">סקירה</TabsTrigger>
          <TabsTrigger onClick={setActiveTab} value="photos">תמונות</TabsTrigger>
          <TabsTrigger onClick={setActiveTab} value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger onClick={setActiveTab} value="tasks">משימות</TabsTrigger>
          <TabsTrigger onClick={setActiveTab} value="invoices">חשבוניות</TabsTrigger>
          <TabsTrigger onClick={setActiveTab} value="profit">רווחיות</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="project-overview-grid">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="card-title-rtl">
                  <FaUser className="card-title-icon" />
                  פרטי לקוח
                </CardTitle>
              </CardHeader>
              <CardContent className="client-info-content">
                <div className="client-info-item">
                  <FaUser className="client-info-icon" />
                  <div>
                    <p className="client-info-text">{project.client.name}</p>
                    <p className="client-info-subtext">איש קשר ראשי</p>
                  </div>
                </div>
                <div className="client-info-item">
                  <FaPhone className="client-info-icon" />
                  <div>
                    <p className="client-info-text">{project.client.phone}</p>
                    <p className="client-info-subtext">מספר טלפון</p>
                  </div>
                </div>

                <div className="client-info-item client-info-item-start">
                  <FaMapPin className="client-info-icon client-info-icon-mt" />
                  <div>
                    <p className="client-info-text">{project.client.address}</p>
                    <p className="client-info-subtext">כתובת פרויקט</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="card-title-rtl">
                  <FaFileAlt className="card-title-icon" />
                  פרטי פרויקט
                </CardTitle>
              </CardHeader>
              <CardContent className="project-details-content">
                <div>
                  <Label className="project-details-label">תיאור</Label>
                  <p className="project-details-text">{project.description}</p>
                </div>
                <div className="project-details-grid-2col">
                  <div className="project-details-item">
                    <Label className="project-details-label">סוג לקוח</Label>
                    <p className="project-details-text-bold">קבלן</p>
                  </div>
                  <div className="project-details-item">
                    <Label className="project-details-label">סטטוס פרויקט</Label>
                    <div className="project-details-badge-container">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="project-details-grid-2col">
                  <div className="project-details-item">
                    <Label className="project-details-label">תאריך התחלה</Label>
                    <p className="project-details-text-bold">{new Date(project.startDate).toLocaleDateString('he-IL')}</p>
                  </div>
                  <div className="project-details-item">
                    <Label className="project-details-label">תאריך סיום משוער</Label>
                    <p className="project-details-text-bold">{new Date(project.estimatedEndDate).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote Information */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title-rtl">
                <FaFileAlt className="card-title-icon" />
                פרטי הצעת מחיר ({project.quote.id})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>תיאור</TableHead>
                    <TableHead className="text-center">כמות</TableHead>
                    <TableHead className="text-left">מחיר יחידה</TableHead>
                    <TableHead className="text-left">סה״כ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.quote.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="table-cell-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-left">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="table-cell-medium text-left">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="table-row-summary">
                    <TableCell colSpan={3} className="table-cell-bold text-left">סה״כ</TableCell>
                    <TableCell className="table-cell-bold table-cell-lg text-left">{formatCurrency(project.quote.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <div className="card-header-flex-between">
                <CardTitle className="card-title-rtl">
                  <FaCamera className="card-title-icon" />
                  תמונות פרויקט
                </CardTitle>
                <Button onClick={handleUploadPhoto} className="project-add-button">
                  <FaUpload className="project-icon-ltr" />
                  העלה תמונות
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="project-photos-grid">
                {project.photos.map((photo) => (
                  <Card key={photo.id} className="photo-card-item">
                    <div className="photo-card-image-container">
                      <img src={photo.url} alt={photo.title} className="photo-card-image" />
                    </div>
                    <CardContent className="photo-card-details">
                      <div className="photo-card-meta">
                        <Badge className="photo-card-category-badge">{photo.category}</Badge>
                        <span className="photo-card-date">{new Date(photo.date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <h4 className="photo-card-title">{photo.title}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="card-header-flex-between">
                <CardTitle className="card-title-rtl">
                  <FaReceipt className="card-title-icon" />
                  הוצאות פרויקט
                </CardTitle>
                <Button onClick={handleAddExpense} className="project-add-button">
                  <FaPlus className="project-icon-ltr" />
                  הוסף הוצאה
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>תאריך</TableHead>
                    <TableHead>קטגוריה</TableHead>
                    <TableHead>תיאור</TableHead>
                    <TableHead className="text-left">סכום</TableHead>
                    <TableHead className="text-center">קבלה</TableHead>
                    <TableHead className="text-center">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell>
                        <Badge className="expense-category-badge">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="table-cell-medium">{expense.description}</TableCell>
                      <TableCell className="table-cell-medium text-left">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell className="text-center">
                        {expense.receipt ? (
                          <Button variant="ghost" size="sm">
                            <FaReceipt className="project-icon-base" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="table-actions">
                          <Button variant="ghost" size="sm">
                            <FaEdit className="project-icon-base" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FaTrashAlt className="project-icon-base" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="table-row-summary">
                    <TableCell colSpan={3} className="table-cell-bold text-left">סה״כ הוצאות</TableCell>
                    <TableCell className="table-cell-bold table-cell-lg text-left">{formatCurrency(totalExpenses)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="card-header-flex-between">
                <CardTitle className="card-title-rtl">
                  <FaCheckCircle className="card-title-icon" />
                  משימות פרויקט
                </CardTitle>
                <Button className="project-add-button">
                  <FaPlus className="project-icon-ltr" />
                  הוסף משימה
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="task-list">
                {project.tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-details-group">
                      <div className={`task-status-dot ${
                        task.status === 'הושלם' ? 'bg-green' :
                        task.status === 'בתהליך' ? 'bg-blue' : 'bg-gray'
                      }`} />
                      <div className="task-text-right">
                        <h4 className="task-title">{task.title}</h4>
                        <p className="task-assignee">הוקצה ל: {task.assignee}</p>
                      </div>
                    </div>
                    <div className="task-meta-left">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <p className="task-due-date">עד תאריך: {new Date(task.dueDate).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="card-header-flex-between">
                <CardTitle className="card-title-rtl">
                  <FaCreditCard className="card-title-icon" />
                  חשבוניות ותשלומים
                </CardTitle>
                <Button className="project-add-button">
                  <FaPlus className="project-icon-ltr" />
                  צור חשבונית
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.invoices.map((invoice) => (
                <div key={invoice.id} className="invoice-item-group">
                  <div className="invoice-summary-card">
                    <div className="invoice-summary-text-right">
                      <h4 className="invoice-id">{invoice.id}</h4>
                      <p className="invoice-date">תאריך: {new Date(invoice.date).toLocaleDateString('he-IL')}</p>
                    </div>
                    <div className="invoice-summary-text-left">
                      <p className="invoice-amount">{formatCurrency(invoice.amount)}</p>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                  </div>

                  <div className="payment-history-section">
                    <h5 className="payment-history-title">היסטוריית תשלומים</h5>
                    {invoice.payments.map((payment, index) => (
                      <div key={index} className="payment-item">
                        <div className="payment-item-text-right">
                          <p className="payment-amount">{formatCurrency(payment.amount)}</p>
                          <p className="payment-method">{payment.method}</p>
                        </div>
                        <p className="payment-date">{new Date(payment.date).toLocaleDateString('he-IL')}</p>
                      </div>
                    ))}
                    {invoice.remaining > 0 && (
                      <div className="payment-remaining-alert">
                        <p className="payment-remaining-label">יתרה לתשלום</p>
                        <p className="payment-remaining-value">{formatCurrency(invoice.remaining)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Tab */}
        <TabsContent value="profit">
          <div className="profit-details-grid">
            <Card>
              <CardHeader>
                <CardTitle className="card-title-right">פירוט הכנסות</CardTitle>
              </CardHeader>
              <CardContent className="profit-content-list">
                <div className="profit-item-row border-bottom">
                  <span className="profit-item-label">סה״כ הצעת מחיר</span>
                  <span className="profit-item-value text-green">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="profit-item-row">
                  <span className="profit-item-label">הכנסות נוספות</span>
                  <span className="profit-item-value">{formatCurrency(0)}</span>
                </div>
                <div className="profit-item-row border-top bold-lg">
                  <span className="profit-item-label">סה״כ הכנסות</span>
                  <span className="profit-item-value text-green">{formatCurrency(totalRevenue)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="card-title-right">פירוט הוצאות</CardTitle>
              </CardHeader>
              <CardContent className="profit-content-list">
                {['חומרים', 'עבודה', 'תחבורה'].map((category) => {
                  const categoryTotal = project.expenses
                    .filter(expense => expense.category === category)
                    .reduce((sum, expense) => sum + expense.amount, 0);

                  return (
                    <div key={category} className="profit-item-row border-bottom">
                      <span className="profit-item-label">{category}</span>
                      <span className="profit-item-value text-red">{formatCurrency(categoryTotal)}</span>
                    </div>
                  );
                })}
                <div className="profit-item-row border-top bold-lg">
                  <span className="profit-item-label">סה״כ הוצאות</span>
                  <span className="profit-item-value text-red">{formatCurrency(totalExpenses)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="card-title-right">סיכום רווחיות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="profit-summary-grid">
                <div className="profit-summary-card green-bg">
                  <p className="profit-summary-label">סה״כ הכנסות</p>
                  <p className="profit-summary-value text-green-dark">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="profit-summary-card red-bg">
                  <p className="profit-summary-label">סה״כ הוצאות</p>
                  <p className="profit-summary-value text-red-dark">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="profit-summary-card blue-bg">
                  <p className="profit-summary-label">רווח נקי</p>
                  <p className={`profit-summary-value ${profit >= 0 ? 'text-green-dark' : 'text-red-dark'}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
              <div className="profit-margin-card purple-bg">
                <p className="profit-summary-label">שיעור רווח</p>
                <p className={`profit-margin-value ${profit >= 0 ? 'text-green-dark' : 'text-red-dark'}`}>
                  {profitMargin}%
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Project;
