import React, { useState, useEffect } from 'react';
import { Bell, Settings, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface NotificationPreferences {
  email_notifications: boolean;
  usage_alerts: boolean;
  renewal_reminders: boolean;
  payment_notifications: boolean;
  threshold_warnings: number;
}

export function SubscriptionNotifications() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    usage_alerts: true,
    renewal_reminders: true,
    payment_notifications: true,
    threshold_warnings: 80
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(preferences);

      if (error) throw error;
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Notification Preferences
            </h2>
          </div>
          <button
            onClick={savePreferences}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Preferences
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="email_notifications" className="text-sm font-medium text-gray-900">
              Email Notifications
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.email_notifications}
              onClick={() => setPreferences(prev => ({
                ...prev,
                email_notifications: !prev.email_notifications
              }))}
              className={`${
                preferences.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.email_notifications ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Receive important notifications via email
          </p>
        </div>

        {/* Usage Alerts */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="usage_alerts" className="text-sm font-medium text-gray-900">
              Usage Alerts
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.usage_alerts}
              onClick={() => setPreferences(prev => ({
                ...prev,
                usage_alerts: !prev.usage_alerts
              }))}
              className={`${
                preferences.usage_alerts ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.usage_alerts ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get notified when approaching usage limits
          </p>
        </div>

        {/* Renewal Reminders */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="renewal_reminders" className="text-sm font-medium text-gray-900">
              Renewal Reminders
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.renewal_reminders}
              onClick={() => setPreferences(prev => ({
                ...prev,
                renewal_reminders: !prev.renewal_reminders
              }))}
              className={`${
                preferences.renewal_reminders ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.renewal_reminders ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Receive reminders before subscription renewal
          </p>
        </div>

        {/* Payment Notifications */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="payment_notifications" className="text-sm font-medium text-gray-900">
              Payment Notifications
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={preferences.payment_notifications}
              onClick={() => setPreferences(prev => ({
                ...prev,
                payment_notifications: !prev.payment_notifications
              }))}
              className={`${
                preferences.payment_notifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                aria-hidden="true"
                className={`${
                  preferences.payment_notifications ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get notified about payment events
          </p>
        </div>

        {/* Usage Threshold */}
        <div>
          <label htmlFor="threshold_warnings" className="text-sm font-medium text-gray-900">
            Usage Warning Threshold
          </label>
          <div className="mt-1">
            <input
              type="range"
              id="threshold_warnings"
              min="50"
              max="90"
              step="5"
              value={preferences.threshold_warnings}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                threshold_warnings: parseInt(e.target.value)
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50%</span>
              <span>{preferences.threshold_warnings}%</span>
              <span>90%</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get warned when usage reaches this percentage of your limit
          </p>
        </div>
      </div>
    </div>
  );
}