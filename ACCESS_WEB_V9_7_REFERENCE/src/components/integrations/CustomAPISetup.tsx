import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Activity, Code, Key, Info, Book, ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAPI } from '../../hooks/useAPI';

export function CustomAPISetup() {
  const { apiKeys, isLoading, mutate } = useAPI();
  const [generating, setGenerating] = useState(false);
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [activeScope, setActiveScope] = useState<string | null>(null);

  const scopes = [
    {
      id: 'read',
      icon: Activity,
      label: 'Read Access',
      description: 'View accessibility reports and scan results',
      plan: 'Basic',
      features: [
        'Access to scan results',
        'View accessibility reports',
        'Download PDF reports',
        'Basic analytics'
      ]
    },
    {
      id: 'write',
      icon: Code,
      label: 'Write Access',
      description: 'Start scans and apply fixes',
      plan: 'Professional',
      features: [
        'All Read Access features',
        'Start automated scans',
        'Apply automated fixes',
        'Webhook integrations',
        'Advanced analytics'
      ]
    },
    {
      id: 'admin',
      icon: Key,
      label: 'Admin Access',
      description: 'Manage API keys and webhooks',
      plan: 'Enterprise',
      features: [
        'All Write Access features',
        'Manage API keys',
        'Configure webhooks',
        'Custom rate limits',
        'Priority support',
        'Custom integrations'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/generate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          scopes: selectedScopes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      toast.success('API key generated successfully');
      mutate(); // Refresh API keys list
      setName('');
      setSelectedScopes([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Return to My Connections link */}
      <div className="mb-6">
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to My Connections
        </Link>
      </div>
      
      {/* API Documentation Link */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
        <div className="flex items-start">
          <Book className="w-6 h-6 text-purple-600 mt-1" />
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-purple-900">API Documentation</h2>
            <p className="mt-1 text-purple-700">
              Before generating API keys, review our comprehensive API documentation to understand available endpoints, features, and best practices.
            </p>
            <Link
              to="/docs/api"
              className="inline-flex items-center mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Book className="w-5 h-5 mr-2" />
              View API Documentation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white p-8">
          {/* API Key Generation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Code className="w-6 h-6 text-purple-600" />
                  <h2 className="ml-3 text-lg font-medium text-gray-900">
                    Generate API Key
                  </h2>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Create a new API key for your integration
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  API Key Name
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Choose a descriptive name to identify this API key
                </p>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm font-medium text-gray-900 placeholder-gray-400"
                  placeholder="Production API Key"
                  required
                />
                <p className="mt-2 text-xs text-purple-600">
                  This name will help you identify the API key in your dashboard
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Access Scopes
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Select the permissions for this API key
                </p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {scopes.map(scope => (
                    <div key={scope.id} className="flex items-start h-full p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-500 transition-all">
                      <input
                        type="checkbox"
                        id={scope.id}
                        checked={selectedScopes.includes(scope.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedScopes(prev => [...prev, scope.id]);
                          } else {
                            setSelectedScopes(prev => prev.filter(s => s !== scope.id));
                          }
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
                      />
                      <label htmlFor={scope.id} className="ml-3 flex-1">
                        <div className="flex items-center">
                          {scope.icon && <scope.icon className="w-5 h-5 text-gray-400 mr-2" />}
                        <div className="text-sm font-semibold text-gray-900">{scope.label}</div>
                          {scope.icon && (
                            <button
                              type="button"
                              onClick={() => setActiveScope(scope.id)}
                              className="ml-2 text-purple-600 hover:text-purple-700"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">{scope.description}</div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {scope.plan} Plan Required
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Modal */}
              {activeScope && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                    <div className="fixed inset-0 transition-opacity" onClick={() => setActiveScope(null)}>
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                      {scopes.map(scope => scope.id === activeScope && (
                        <div key={scope.id}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {scope.icon && <scope.icon className="w-6 h-6 text-purple-600 mr-2" />}
                              <h3 className="text-lg font-medium text-gray-900">{scope.label}</h3>
                            </div>
                            <button
                              onClick={() => setActiveScope(null)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-gray-600 mb-4">{scope.description}</p>
                          <div className="mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {scope.plan} Plan Required
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                            <ul className="space-y-2">
                              {scope.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2" />
                                  <span className="text-gray-600">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-6">
                            <Link
                              to="/docs/api"
                              className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                            >
                              View API Documentation
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={generating || !name || selectedScopes.length === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
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
            </form>
          </motion.div>

          {/* API Keys List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="w-6 h-6 text-purple-600" />
                  <h2 className="ml-3 text-lg font-medium text-gray-900">
                    Your API Keys
                  </h2>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {apiKeys?.length || 0} keys total
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : apiKeys?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Generate your first API key to get started
                    </p>
                  </div>
                ) : (
                  apiKeys?.map(key => (
                    <div key={key.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">{key.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">Created: {new Date(key.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => {/* TODO: Implement key revocation */}}
                            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center space-x-4">
                          <code className="flex-1 text-sm font-mono bg-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                            {showKey === key.id ? key.key : `${key.key.slice(0, 8)}...${key.key.slice(-8)}`}
                          </code>
                          <button
                            onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors"
                          >
                            {showKey === key.id ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
    </div>
  );
}