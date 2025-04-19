import React from 'react';
import { Building, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EnterpriseIntegrationPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise Integration Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Custom-built accessibility solutions for large organizations with complex needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Building className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Custom Integration
            </h3>
            <p className="text-gray-600">
              Tailored solutions that integrate seamlessly with your existing infrastructure
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dedicated Support
            </h3>
            <p className="text-gray-600">
              24/7 priority support and dedicated account management
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Building className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Custom SLAs
            </h3>
            <p className="text-gray-600">
              Customized service level agreements to meet your specific needs
            </p>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact our enterprise team to discuss your organization's needs and create a custom solution.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}