import React, { useState } from 'react';
import { Save, RefreshCw, Globe, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { WordPressSettings as WPSettingsType } from '../../types/integrations';

interface WordPressSettingsProps {
  settings?: WPSettingsType;
  onSave?: (settings: WPSettingsType) => void;
}

export function WordPressSettings({ settings: initialSettings, onSave }: WordPressSettingsProps = {}) {
  const [settings, setSettings] = useState<WPSettingsType>({
    apiKey: initialSettings?.apiKey || '',
    scanFrequency: initialSettings?.scanFrequency || 'weekly',
    autoFix: initialSettings?.autoFix ?? true,
    notifyAdmin: initialSettings?.notifyAdmin ?? true,
    excludedPaths: initialSettings?.excludedPaths || []
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      onSave?.(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const validateAPIKey = async () => {
    setValidating(true);
    try {
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API key is valid');
    } catch (error) {
      toast.error('Failed to validate API key');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="ml-3 text-lg font-medium text-gray-900">
            WordPress Integration Setup
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="password"
              id="apiKey"
              value={settings.apiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={validateAPIKey}
              disabled={validating || !settings.apiKey}
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              {validating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Validate'
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="scanFrequency" className="block text-sm font-medium text-gray-700">
            Scan Frequency
          </label>
          <select
            id="scanFrequency"
            value={settings.scanFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, scanFrequency: e.target.value as 'daily' | 'weekly' | 'manual' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="manual">Manual Only</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="autoFix"
              type="checkbox"
              checked={settings.autoFix}
              onChange={(e) => setSettings(prev => ({ ...prev, autoFix: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoFix" className="ml-2 block text-sm text-gray-900">
              Automatically apply fixes when possible
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="notifyAdmin"
              type="checkbox"
              checked={settings.notifyAdmin}
              onChange={(e) => setSettings(prev => ({ ...prev, notifyAdmin: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="notifyAdmin" className="ml-2 block text-sm text-gray-900">
              Send email notifications for scan results
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="excludedPaths" className="block text-sm font-medium text-gray-700">
            Excluded Paths
          </label>
          <div className="mt-1">
            <textarea
              id="excludedPaths"
              value={settings.excludedPaths.join('\n')}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                excludedPaths: e.target.value.split('\n').filter(Boolean)
              }))}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="/wp-admin/*&#10;/wp-json/*"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter one path per line. Wildcards (*) are supported.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Plugin Installation Required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  To complete the integration, install our WordPress plugin:
                </p>
                <ol className="list-decimal ml-4 mt-2">
                  <li>Download the plugin from wordpress.org</li>
                  <li>Install and activate the plugin in your WordPress admin</li>
                  <li>Enter your API key in the plugin settings</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}