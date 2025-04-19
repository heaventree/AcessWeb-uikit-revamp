import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Settings {
  apiKey: string;
  scanFrequency: 'daily' | 'weekly' | 'manual';
  autoFix: boolean;
  notifyAdmin: boolean;
  excludedPaths: string;
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    scanFrequency: 'weekly',
    autoFix: false,
    notifyAdmin: true,
    excludedPaths: ''
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Load settings
    const loadSettings = async () => {
      try {
        const response = await fetch(
          `${accesswebAdmin.ajaxUrl}?action=accessweb_get_settings&nonce=${accesswebAdmin.nonce}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        } else {
          throw new Error(data.message || 'Failed to load settings');
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_save_settings&nonce=${accesswebAdmin.nonce}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);

    try {
      const response = await fetch(
        `${accesswebAdmin.ajaxUrl}?action=accessweb_test_connection&nonce=${accesswebAdmin.nonce}`
      );
      
      if (!response.ok) {
        throw new Error('Connection test failed');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Connection test successful');
      } else {
        throw new Error(data.message || 'Connection test failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
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
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={testConnection}
                disabled={testing || !settings.apiKey}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {testing ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  'Test Connection'
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
              onChange={(e) => setSettings(prev => ({ ...prev, scanFrequency: e.target.value as Settings['scanFrequency'] }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                rows={4}
                value={settings.excludedPaths}
                onChange={(e) => setSettings(prev => ({ ...prev, excludedPaths: e.target.value }))}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="/path/to/exclude&#10;/another/path"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter one path per line. These paths will be excluded from accessibility scans.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}