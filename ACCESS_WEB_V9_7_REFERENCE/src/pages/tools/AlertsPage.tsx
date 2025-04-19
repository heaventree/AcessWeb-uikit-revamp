import React from 'react';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { RealTimeMonitor } from '../../components/RealTimeMonitor';

export function AlertsPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Accessibility Alerts
          </h1>
          <p className="text-lg text-gray-600">
            Configure and manage real-time accessibility alerts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Bell className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-time Notifications
            </h3>
            <p className="text-gray-600">
              Get instant alerts when accessibility issues are detected
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <AlertTriangle className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Critical Issues
            </h3>
            <p className="text-gray-600">
              Priority alerts for critical accessibility problems
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Custom Rules
            </h3>
            <p className="text-gray-600">
              Create custom alert rules based on your needs
            </p>
          </div>
        </div>

        <RealTimeMonitor />
      </div>
    </div>
  );
}