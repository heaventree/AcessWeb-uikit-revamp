
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VerificationDashboardPage from './pages/admin/VerificationDashboardPage';

/**
 * Application Routes
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Existing routes would go here */}
      
      {/* New verification dashboard route */}
      <Route path="/admin/verification" element={<VerificationDashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
