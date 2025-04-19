import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, CheckCircle, ArrowRight, FileText, Zap, Shield } from 'lucide-react';

export function WordPressIntegrationInfo() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WordPress Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add automated WCAG compliance testing to your WordPress site with our official plugin.
            Monitor accessibility in real-time and get instant fixes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Zap className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-Time Monitoring
            </h3>
            <p className="text-gray-600">
              Continuously monitor your WordPress site for accessibility issues as you make changes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Auto-Fix Suggestions
            </h3>
            <p className="text-gray-600">
              Get instant fix suggestions with code examples for common accessibility issues.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Detailed Reports
            </h3>
            <p className="text-gray-600">
              Generate comprehensive accessibility reports for stakeholders and compliance records.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Make Your WordPress Site Accessible?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how our WordPress integration can help you achieve and maintain WCAG compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/docs/wordpress"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
            >
              Read Documentation
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-blue-700"
            >
              Start Free Trial
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}