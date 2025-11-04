// ProtectedContent.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Navbar from './Navbar'; // Remove this line
import HomePage from '../pages/HomePage';
import Projects from '../pages/Projects';
import Project from './Project';
import Customers from '../pages/Customers';
import NewVisit from './NewVisit';
import Visits from '../pages/Visits';
import NewQuote from './NewQuote';
import Quotes from '../pages/Quotes';
import NewInvoice from './NewInvoice';
import NewCustomer from './NewCustomer';
import { DataProvider } from '../context/DataContext';

export default function ProtectedContent() {
  return (
    <DataProvider>
      {/* <Navbar />  Remove this line */}
      {/* The main-content div should ideally be in the Layout or App component */}
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="customers" element={<Customers />} />
          <Route path="new-visit" element={<NewVisit />} />
          <Route path="visits" element={<Visits />} />
          <Route path="new-quote" element={<NewQuote />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="new-invoice" element={<NewInvoice />} />
          <Route path="new-customer" element={<NewCustomer />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    </DataProvider>
  );
}