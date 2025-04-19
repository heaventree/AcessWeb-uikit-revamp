import React from 'react';
import { Link } from 'react-router-dom';
import { Store, CheckCircle, ArrowRight, FileText, Zap, Shield } from 'lucide-react';

export function ShopifyIntegrationInfo() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shopify Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your Shopify store accessible to all customers. Our integration helps you identify and fix accessibility issues across your entire store.
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

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Shopify merchants who are making their stores accessible to all customers.
          </p>
          <Link
            to="/docs/shopify"
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