import React from 'react';
import { Link } from 'react-router-dom';
import { Code, CheckCircle, ArrowRight, FileText, Zap, Shield } from 'lucide-react';

export function APIIntegrationInfo() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate accessibility testing directly into your applications with our powerful API.
            Build custom solutions and automate accessibility testing in your workflow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Zap className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              RESTful API
            </h3>
            <p className="text-gray-600">
              Simple and powerful REST API for seamless integration with your applications.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Webhooks
            </h3>
            <p className="text-gray-600">
              Real-time notifications for scan results and accessibility issues.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Detailed Reports
            </h3>
            <p className="text-gray-600">
              Comprehensive reporting with detailed accessibility insights.
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Start Example
          </h2>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-gray-100">
              <code>{`// Initialize the client
const accessWeb = new AccessWeb({
  apiKey: 'your_api_key'
});

// Start a scan
const scan = await accessWeb.startScan({
  url: 'https://example.com',
  options: {
    waitForTimeout: 5000,
    maxPages: 10
  }
});

// Get results
const results = await accessWeb.getScanResults(scan.id);

// Set up webhook
await accessWeb.createWebhook({
  url: 'https://your-domain.com/webhook',
  events: ['scan.completed', 'issue.found']
});`}</code>
            </pre>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Integrate?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Check out our comprehensive API documentation to get started with the integration.
          </p>
          <Link
            to="/docs/api"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
          >
            View API Documentation
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}