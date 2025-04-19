import React from 'react';
import { Globe, Store, Code, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IntegrationsOverview() {
  const integrations = [
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Add accessibility testing to your WordPress site with our official plugin.',
      icon: Globe,
      features: [
        'Automated WCAG compliance testing',
        'Real-time monitoring',
        'Auto-fix suggestions',
        'Accessibility badge'
      ],
      benefits: [
        'Ensure your WordPress site stays accessible',
        'Catch issues before they affect users',
        'Save time with automated fixes',
        'Show your commitment to accessibility'
      ],
      setupTime: '5 minutes',
      pricing: 'Included in all plans',
      docsUrl: '/docs/wordpress',
      setupUrl: '/dashboard/integrations/wordpress'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Monitor and improve accessibility across your Shopify store.',
      icon: Store,
      features: [
        'Theme accessibility testing',
        'Product page monitoring',
        'Checkout flow analysis',
        'Custom fixes for Shopify themes'
      ],
      benefits: [
        'Make your store accessible to all customers',
        'Improve conversion rates',
        'Ensure ADA compliance',
        'Enhance user experience'
      ],
      setupTime: '10 minutes',
      pricing: 'Professional plan and above',
      docsUrl: '/docs/shopify',
      setupUrl: '/dashboard/integrations/shopify'
    },
    {
      id: 'api',
      name: 'Custom API',
      description: 'Integrate accessibility testing into your own applications.',
      icon: Code,
      features: [
        'RESTful API access',
        'Webhook notifications',
        'Detailed reporting',
        'Custom implementation support'
      ],
      benefits: [
        'Full control over accessibility testing',
        'Integrate with your CI/CD pipeline',
        'Custom reporting and analytics',
        'Scale across multiple applications'
      ],
      setupTime: '30 minutes',
      pricing: 'Enterprise plan',
      docsUrl: '/docs/api',
      setupUrl: '/dashboard/integrations/api'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessibility Testing Integrations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add automated accessibility testing to your favorite platforms and tools. Our integrations make it easy to ensure your digital content is accessible to everyone.
          </p>
        </div>

        <div className="space-y-12">
          {integrations.map((integration) => (
            <div 
              key={integration.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-8">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <integration.icon className="h-8 w-8 text-blue-600" />
                      <h2 className="ml-3 text-2xl font-bold text-gray-900">
                        {integration.name}
                      </h2>
                    </div>
                    <p className="mt-2 text-lg text-gray-600">
                      {integration.description}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link
                      to={integration.docsUrl}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 mr-3"
                    >
                      Documentation
                    </Link>
                    <Link
                      to={integration.setupUrl}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Get Started
                      <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {integration.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Benefits
                    </h3>
                    <ul className="space-y-3">
                      {integration.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Implementation Details
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Setup Time</dt>
                        <dd className="mt-1 text-sm text-gray-900">{integration.setupTime}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pricing</dt>
                        <dd className="mt-1 text-sm text-gray-900">{integration.pricing}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Support</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          Email, chat, and documentation
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Custom Integration?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            We can help you build custom integrations for your specific needs.
            Our team of experts will work with you to ensure seamless accessibility testing.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Contact Our Team
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}