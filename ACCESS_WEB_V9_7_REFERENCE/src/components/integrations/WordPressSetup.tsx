import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Activity, Code, Key, Info, Book, ArrowRight, ArrowLeft, X, CheckCircle, Globe, Zap, FileText, HelpCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { wordPressAPI } from '../../lib/integrations/wordpress';
import type { WordPressSettings } from '../../types/integrations';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function WordPressSetup() {
  const [settings, setSettings] = useState<WordPressSettings>({
    apiKey: '',
    scanFrequency: 'weekly',
    autoFix: true,
    notifyAdmin: true,
    excludedPaths: []
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [showExistingKey, setShowExistingKey] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Load existing settings
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const savedSettings = await wordPressAPI.getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleGenerateApiKey = async () => {
    setGenerating(true);
    try {
      // Generate a cryptographically secure random API key
      const buffer = new Uint8Array(32);
      window.crypto.getRandomValues(buffer);
      const key = Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Save the new API key in settings
      const newSettings = { ...settings, apiKey: key };
      const result = await wordPressAPI.saveSettings(newSettings);
      
      if (result.success) {
        setSettings(newSettings);
        setNewApiKey(key);
        toast.success('API key generated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const result = await wordPressAPI.saveSettings(settings);
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Return to Connections Link */}
      <div className="mb-2">
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to My Connections
        </Link>
      </div>
      {/* WordPress Plugin Documentation Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start">
          <Book className="w-6 h-6 text-blue-600 mt-1" />
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-blue-900">WordPress Plugin Setup</h2>
            <p className="mt-1 text-blue-700">
              Before connecting your WordPress site, you'll need to install our WordPress plugin. Follow our comprehensive documentation to get started.
            </p>
            <div className="flex mt-3 space-x-3">
              <a
                href="/downloads/wcag-accessibility-scanner.zip"
                download
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Plugin
              </a>
              <button
                onClick={() => setShowInstructionsModal(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Setup Instructions
              </button>
              <Link
                to="/docs/wordpress"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Book className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white p-8">
        {/* API Key Generation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl mb-8"
        >
          <div className="border-b border-gray-200 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-6 h-6 text-blue-600" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  WordPress API Key
                </h2>
              </div>
              <span className="text-sm font-medium text-gray-500">
                Connect your WordPress site
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">What is a WordPress API key?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    A WordPress API key connects your WordPress site with our accessibility services. After generating an API key, you'll need to install our plugin and enter this key in your WordPress dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {settings.apiKey ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="w-6 h-6 text-blue-600" />
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900">WordPress API Key</h4>
                    <p className="text-sm text-gray-500 mt-1">Use this key in your WordPress plugin configuration</p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <code className="block w-full text-sm font-mono bg-gray-50 px-4 py-3 rounded-lg pr-20">
                    {showExistingKey ? settings.apiKey : `${settings.apiKey.slice(0, 8)}...${settings.apiKey.slice(-8)}`}
                  </code>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      onClick={() => setShowExistingKey(!showExistingKey)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors mr-4"
                    >
                      {showExistingKey ? 'Hide' : 'Show'}
                    </button>
                    <CopyToClipboard
                      text={settings.apiKey}
                      onCopy={() => toast.success('API key copied to clipboard')}
                    >
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                        Copy
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateApiKey}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                  Regenerate Key
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Globe className="mx-auto h-12 w-12 text-blue-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No WordPress API Key</h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate an API key to connect your WordPress site
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateApiKey}
                  disabled={generating}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="-ml-1 mr-2 h-5 w-5" />
                      Generate API Key
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Display newly generated key */}
          {newApiKey && (
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-blue-900">API Key Generated Successfully</h3>
                  <p className="mt-1 text-blue-700">
                    Your new WordPress API key has been generated. Copy this key and use it in your WordPress plugin settings.
                  </p>
                  <div className="mt-4">
                    <div className="relative">
                      <code className="block w-full text-sm font-mono bg-white px-4 py-3 rounded-lg pr-20">
                        {showNewKey ? newApiKey : `${newApiKey.slice(0, 8)}...${newApiKey.slice(-8)}`}
                      </code>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          onClick={() => setShowNewKey(!showNewKey)}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors mr-4"
                        >
                          {showNewKey ? 'Hide' : 'Show'}
                        </button>
                        <CopyToClipboard
                          text={newApiKey}
                          onCopy={() => toast.success('API key copied to clipboard')}
                        >
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                            Copy
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* WordPress Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl"
        >
          <div className="border-b border-gray-200 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  WordPress Configuration
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scanFrequency" className="block text-sm font-medium text-gray-700">
                  Scan Frequency
                </label>
                <select
                  id="scanFrequency"
                  value={settings.scanFrequency}
                  onChange={(e) => setSettings({ ...settings, scanFrequency: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  style={{ maxWidth: '280px' }}
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center space-x-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="autoFix"
                      name="autoFix"
                      type="checkbox"
                      checked={settings.autoFix}
                      onChange={(e) => setSettings({ ...settings, autoFix: e.target.checked })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="autoFix" className="font-medium text-gray-700">Auto-fix Issues</label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifyAdmin"
                      name="notifyAdmin"
                      type="checkbox"
                      checked={settings.notifyAdmin}
                      onChange={(e) => setSettings({ ...settings, notifyAdmin: e.target.checked })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifyAdmin" className="font-medium text-gray-700">Notify Admin</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="excludedPaths" className="block text-sm font-medium text-gray-700">
                Excluded Paths (one per line)
              </label>
              <div className="mt-1">
                <textarea
                  id="excludedPaths"
                  rows={3}
                  value={settings.excludedPaths.join('\n')}
                  onChange={(e) => setSettings({ ...settings, excludedPaths: e.target.value.split('\n').filter(p => p.trim()) })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="/wp-admin/&#10;/wp-login.php&#10;/exclude-this-path"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter paths that should be excluded from accessibility scanning
              </p>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
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
          </div>
        </motion.div>
      </div>

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowInstructionsModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowInstructionsModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    WordPress Integration Steps
                  </h3>
                  <div className="mt-4">
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Generate an API key (shown above)</li>
                      <li>Install our WordPress plugin from the WordPress plugin directory</li>
                      <li>Activate the plugin in your WordPress admin dashboard</li>
                      <li>Navigate to Settings {`>`} Accessibility Scanner in your WordPress admin</li>
                      <li>Enter your API key and configure scanning options</li>
                      <li>Save settings and start your first scan</li>
                    </ol>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-md">
                      <h4 className="font-medium text-blue-800">Plugin Installation Options</h4>
                      <p className="mt-2 text-sm text-blue-700">
                        You can install our plugin in one of two ways:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside">
                        <li>Search for "WCAG Accessibility Scanner" in the WordPress plugin directory</li>
                        <li>Download the plugin zip file from our website and upload it to your WordPress site</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowInstructionsModal(false)}
                >
                  Got it
                </button>
                <Link
                  to="/docs/wordpress"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  View Full Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}