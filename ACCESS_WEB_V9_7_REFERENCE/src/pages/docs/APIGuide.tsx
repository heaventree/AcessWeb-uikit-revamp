import React from 'react';
import { Code, Key, Book, CheckCircle, Webhook, ArrowRight, Shield, Zap, FileText, AlertTriangle, Globe, Package, Clock, DollarSign, Lock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function APIGuide() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600">
            Complete guide to integrating accessibility testing into your applications. Features and capabilities vary by subscription plan.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Available API Plans</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Up to 1,000 API calls/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Basic accessibility reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Standard rate limiting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Up to 10,000 API calls/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Advanced reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Webhook integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Higher rate limits</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Unlimited API calls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Custom rate limits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Availability */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Key className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">API Features & Permissions</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AI-Powered Fixes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fix Suggestions</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Basic Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WCAG Testing</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A/AA Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A/AA/AAA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom Tests</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">API Rate Limits</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,000/month</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10,000/month</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Webhooks</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Real-Time Monitoring</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Report Formats</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PDF Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PDF, CSV, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All + Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Integrations</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Basic API</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All Platforms</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Analytics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Basic</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Support</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Support SLA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Standard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Priority</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Feature Availability</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Features like AI-powered fixes and advanced monitoring require higher tier subscriptions to ensure optimal performance and support. Upgrade your plan to unlock additional capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Rate Limits</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>API rate limits are enforced based on your subscription plan:</p>
              
              <ul>
                <li><strong>Basic Plan:</strong> 60 requests per minute, 1,000 per month</li>
                <li><strong>Professional Plan:</strong> 300 requests per minute, 10,000 per month</li>
                <li><strong>Enterprise Plan:</strong> Custom limits based on your needs</li>
              </ul>

              <p>Rate limit headers are included in all API responses:</p>

              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4">
                {`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1500000000`}
              </pre>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Authentication</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                All API requests must include your API key in the Authorization header:
              </p>

              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4">
                {`Authorization: Bearer your_api_key_here`}
              </pre>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      Keep your API keys secure and never expose them in client-side code.
                      Rotate your keys immediately if they are compromised.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {/* Quick Start Section */}
          <div id="quick-start" className="p-8">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Quick Start</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>
                Get started with our API in minutes. Follow these steps to integrate accessibility testing into your applications.
              </p>

              <h3>1. Get Your API Key</h3>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 mb-6">
                {`curl -X POST https://api.accessweb.com/v1/api-keys \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My API Key"}'`}
              </pre>

              <h3>2. Make Your First Request</h3>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 mb-6">
                {`curl -X POST https://api.accessweb.com/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "options": {
      "waitForTimeout": 5000,
      "maxPages": 10
    }
  }'`}
              </pre>
            </div>
          </div>

          {/* API Reference Section */}
          <div id="api-reference" className="p-8">
            <div className="flex items-center mb-6">
              <Code className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">API Reference</h2>
            </div>

            <div className="space-y-8">
              {/* Scans Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Scans</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">POST</span>
                      <code className="ml-2 text-sm font-mono">/scans</code>
                    </div>
                    <p className="text-gray-600 mb-2">Start a new accessibility scan</p>
                    <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                      {`{
  "url": "https://example.com",
  "options": {
    "waitForTimeout": 5000,
    "maxPages": 10
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono">/scans/{'{scan_id}'}</code>
                    </div>
                    <p className="text-gray-600">Get scan results</p>
                  </div>
                </div>
              </div>

              {/* Issues Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Issues</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono">/issues/{'{issue_id}'}</code>
                    </div>
                    <p className="text-gray-600">Get issue details</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono">/issues/{'{issue_id}'}/fixes</code>
                    </div>
                    <p className="text-gray-600">Get suggested fixes</p>
                  </div>
                </div>
              </div>

              {/* Webhooks Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Webhooks</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">POST</span>
                      <code className="ml-2 text-sm font-mono">/webhooks</code>
                    </div>
                    <p className="text-gray-600 mb-2">Register a new webhook</p>
                    <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                      {`{
  "url": "https://your-domain.com/webhook",
  "events": ["scan.completed", "issue.found"]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Handling Section */}
          <div id="error-handling" className="p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Error Handling</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p>The API uses standard HTTP response codes and returns errors in a consistent format:</p>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4">
                {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 60,
      "remaining": 0,
      "reset": 1500000000
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Sign up for a free trial to get your API key and start integrating accessibility testing into your applications.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
          >
            Start Free Trial
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}