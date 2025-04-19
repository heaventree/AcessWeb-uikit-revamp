/**
 * Dashboard Page Component
 * 
 * Main dashboard for authenticated users with accessibility features
 * and security integration.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard Page Component
 */
function DashboardPage(): JSX.Element {
  // Get user data from auth context
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Dashboard</title>
        <meta name="description" content="Dashboard for WCAG Accessibility Audit tool" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome message */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome back, {user?.name || 'User'}!
              </h2>
              <p className="text-gray-600">
                Use the dashboard to run accessibility tests, view reports, and improve your website's accessibility.
              </p>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="px-4 py-2 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">New Test</h3>
                <p className="text-gray-600 mb-4">
                  Run a new accessibility test on your website.
                </p>
                <Link
                  to="/test"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Test
                </Link>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reports</h3>
                <p className="text-gray-600 mb-4">
                  View and analyze your accessibility test reports.
                </p>
                <Link
                  to="/reports"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Reports
                </Link>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile</h3>
                <p className="text-gray-600 mb-4">
                  Manage your account settings and preferences.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Profile
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <p className="text-gray-600 text-center py-8">
                  No recent activity to display.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default DashboardPage;