import { useState } from 'react';
import { Settings, Bell, Lock, Users, CreditCard } from 'lucide-react';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { TeamSettings } from '../../components/settings/TeamSettings';
import { BillingSettings } from '../../components/settings/BillingSettings';

type SettingsTab = 'account' | 'notifications' | 'security' | 'team' | 'billing';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Account Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your account preferences and settings
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('account')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Bell className="w-5 h-5 inline-block mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Lock className="w-5 h-5 inline-block mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Team
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'billing'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-5 h-5 inline-block mr-2" />
            Billing
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'account' && (
          <AccountSettings />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationSettings />
        )}
        
        {activeTab === 'security' && (
          <SecuritySettings />
        )}
        
        {activeTab === 'team' && (
          <TeamSettings />
        )}
        
        {activeTab === 'billing' && (
          <BillingSettings />
        )}
      </div>
    </div>
  );
}