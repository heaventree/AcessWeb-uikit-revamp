import React from 'react';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ComplianceIntegrationPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compliance Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automated compliance monitoring and reporting for accessibility standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Automated Monitoring
            </h3>
            <p className="text-gray-600">
              Continuous monitoring of accessibility compliance
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compliance Reports
            </h3>
            <p className="text-gray-600">
              Detailed reports for various accessibility standards
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Risk Assessment
            </h3>
            <p className="text-gray-600">
              Identify and mitigate accessibility compliance risks
            </p>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Ensure Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start monitoring your accessibility compliance today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
          >
            Get Started
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}