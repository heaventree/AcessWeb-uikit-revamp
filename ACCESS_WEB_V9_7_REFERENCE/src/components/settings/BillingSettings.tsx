import React from 'react';
import { CreditCard, Download } from 'lucide-react';

export function BillingSettings() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Billing Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your subscription and billing information.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">Current Plan</h3>
          <div className="mt-2 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Professional Plan</p>
                <p className="text-sm text-blue-700">$99/month</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Change Plan
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
          <div className="mt-2">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="ml-3 text-sm text-gray-900">•••• •••• •••• 4242</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Billing History</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="px-4 py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Professional Plan - Monthly</p>
                    <p className="text-xs text-gray-500">March {item}, 2024</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">$99.00</span>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}