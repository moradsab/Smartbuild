// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider, useData } from "./context/DataContext";

// Pages & Components
import Login from "./pages/Login";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Projects from "./pages/Projects";
import Project from "./components/Project";
import Customers from "./pages/Customers";
import NewVisit from "./components/NewVisit";
import Visits from "./pages/Visits";
import NewQuote from "./components/NewQuote";
import Quotes from "./pages/Quotes";
import NewInvoice from "./components/NewInvoice";
import NewCustomer from "./components/NewCustomer";
import Visit from "./pages/Visit";
import Quote from './pages/Quote'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { token, loading: authLoading } = useAuth();
  const { data, loading: dataLoading } = useData();

  // Show loading spinner while auth or data is loading
  if (authLoading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  // If not authenticated, only allow login route
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Extract main app data safely
  const appData = data?.[0];
  if (!appData) {
    // Defensive: show loading if data is not ready
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  const { stats, projects, customers, visits } = appData;

  return (
    <Routes>
      {/* Redirect logged-in users away from login */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Main app layout and routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage stats={stats} recentProjects={projects} />} />
        <Route path="projects" element={<Projects projects={projects} />} />
        <Route path="project/:id" element={<Project projects={projects} />} />
        <Route path="customers" element={<Customers customers={customers} />} />
        <Route path="new-customer" element={<NewCustomer />} />
        <Route path="visits" element={<Visits visits={visits} />} />
        {/* Visit route expects visits array for fallback fetch */}
        <Route path="visit/:id" element={<Visit visits={visits} />} />
        <Route path="new-visit" element={<NewVisit customers={customers} />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="quote/:id" element={<Quote />} />
        <Route path="new-quote" element={<NewQuote visits={visits} />} />
        <Route path="new-invoice" element={<NewInvoice />} />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
}
