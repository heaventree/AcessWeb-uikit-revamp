import React, { useState } from 'react';
import { CustomAPISetup } from '../../../components/integrations/CustomAPISetup';
import { APIUsageStats } from '../../../components/integrations/APIUsageStats';
import { APIWebhooks } from '../../../components/integrations/APIWebhooks';

export function APIIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState<'setup' | 'usage' | 'webhooks'>('setup');
  
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Integration Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your API keys, monitor usage, and configure webhooks
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'setup'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                API Setup
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'usage'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usage Stats
              </button>
              <button
                onClick={() => setActiveTab('webhooks')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'webhooks'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Webhooks
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'setup' && <CustomAPISetup />}
            {activeTab === 'usage' && <APIUsageStats />}
            {activeTab === 'webhooks' && <APIWebhooks />}
          </div>
        </div>
      </div>
    </div>
  );
}