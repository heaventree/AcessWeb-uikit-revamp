
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ImplementationDashboard from '../../components/admin/ImplementationDashboard';

/**
 * Verification Dashboard Page
 * 
 * Provides a complete view of implementation verification status
 */
const VerificationDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Implementation Verification Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <ImplementationDashboard />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VerificationDashboardPage;
