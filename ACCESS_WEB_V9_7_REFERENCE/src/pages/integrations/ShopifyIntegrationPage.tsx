import React from 'react';
import { Link } from 'react-router-dom';
import { Store, CheckCircle, ArrowRight, FileText, Zap, Shield } from 'lucide-react';

export function ShopifyIntegrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopify Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your Shopify store accessible to all customers with our powerful integration. Monitor accessibility in real-time and get instant fixes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Zap className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Theme Analysis
            </h3>
            <p className="text-gray-600">
              Automatically scan your Shopify theme for accessibility issues and get fix suggestions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shield className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Product Pages
            </h3>
            <p className="text-gray-600">
              Ensure your product pages are accessible with proper descriptions and navigation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Checkout Flow
            </h3>
            <p className="text-gray-600">
              Make your checkout process accessible to all customers to improve conversion rates.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">1</span>
                <h3 className="ml-3 font-medium text-gray-900">Install App</h3>
              </div>
              <p className="text-gray-600">
                Add our app from the Shopify App Store to your store.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">2</span>
                <h3 className="ml-3 font-medium text-gray-900">Configure Settings</h3>
              </div>
              <p className="text-gray-600">
                Set up monitoring preferences and notification settings.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">3</span>
                <h3 className="ml-3 font-medium text-gray-900">Initial Scan</h3>
              </div>
              <p className="text-gray-600">
                Run your first store scan to identify accessibility issues.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">4</span>
                <h3 className="ml-3 font-medium text-gray-900">Apply Fixes</h3>
              </div>
              <p className="text-gray-600">
                Use our suggestions to fix issues and improve accessibility.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Increase Sales</h4>
                    <p className="text-gray-600">Make your store accessible to all potential customers, expanding your market reach</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Improve SEO</h4>
                    <p className="text-gray-600">Better accessibility means better search rankings and increased organic traffic</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Reduce Legal Risk</h4>
                    <p className="text-gray-600">Stay compliant with ADA, AODA, and EAA accessibility regulations</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Easy Setup</h4>
                    <p className="text-gray-600">No coding required - install and configure in minutes with guided setup</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Automated Fixes</h4>
                    <p className="text-gray-600">Get AI-powered suggestions and automatic fixes for common accessibility issues</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Regular Updates</h4>
                    <p className="text-gray-600">Stay current with latest accessibility standards</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/docs/shopify" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              View full documentation 
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Make Your Shopify Store Accessible?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Shopify merchants who are making their stores accessible to all customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/docs/shopify"
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