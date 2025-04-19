import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    scanCompleted: true,
    criticalIssues: true,
    weeklyDigest: true,
    usageAlerts: true,
    teamUpdates: false
  });

  const handleChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">Choose when and how you want to be notified.</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifications.emailNotifications}
            onClick={() => handleChange('emailNotifications')}
            className={`${
              notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              aria-hidden="true"
              className={`${
                notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <input
              id="scanCompleted"
              type="checkbox"
              checked={notifications.scanCompleted}
              onChange={() => handleChange('scanCompleted')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="scanCompleted" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Scan Completed</span>
              <p className="text-sm text-gray-500">Get notified when a scan is completed</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="criticalIssues"
              type="checkbox"
              checked={notifications.criticalIssues}
              onChange={() => handleChange('criticalIssues')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="criticalIssues" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Critical Issues</span>
              <p className="text-sm text-gray-500">Get notified about critical accessibility issues</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="weeklyDigest"
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={() => handleChange('weeklyDigest')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="weeklyDigest" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Weekly Digest</span>
              <p className="text-sm text-gray-500">Receive a weekly summary of accessibility updates</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="usageAlerts"
              type="checkbox"
              checked={notifications.usageAlerts}
              onChange={() => handleChange('usageAlerts')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="usageAlerts" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Usage Alerts</span>
              <p className="text-sm text-gray-500">Get notified when approaching usage limits</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="teamUpdates"
              type="checkbox"
              checked={notifications.teamUpdates}
              onChange={() => handleChange('teamUpdates')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="teamUpdates" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Team Updates</span>
              <p className="text-sm text-gray-500">Receive notifications about team activity</p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}