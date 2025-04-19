import React from 'react';
import BrandIconsGrid from '../components/common/BrandIconsGrid';
import { ShieldCheck, Zap, Database, Lock } from 'lucide-react';

export const Integrations: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Integrations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our accessibility audit platform integrates with the tools and services you already use,
            providing a seamless compliance workflow.
          </p>
        </header>

        {/* Current Integrations */}
        <section className="mb-16">
          <BrandIconsGrid 
            title="Current Integrations" 
            description="Technologies and services integrated in our current platform release."
            showUpcoming={false}
          />
        </section>

        {/* Benefits of integrations */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Integration Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">Enhanced Security</h3>
                <p className="text-gray-600">Secure authentication and data transfer with all integrated services.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">Automated Workflows</h3>
                <p className="text-gray-600">Connect tools to create seamless accessibility testing workflows.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">Centralized Data</h3>
                <p className="text-gray-600">Access all your accessibility audit data in one unified dashboard.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">Compliance Controls</h3>
                <p className="text-gray-600">Maintain WCAG compliance across all integrated platforms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Integrations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upcoming Integrations</h2>
          <p className="text-gray-600 mb-6">
            We're constantly expanding our integration ecosystem. Here's what's coming soon to our platform.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'AWS', description: 'Cloud infrastructure for scale and reliability' },
              { name: 'Slack', description: 'Real-time accessibility alerts and notifications' },
              { name: 'Google', description: 'Authentication and Google Workspace integration' },
              { name: 'Firebase', description: 'Real-time database and authentication services' }
            ].map(integration => (
              <div key={integration.name} className="border border-gray-200 bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="font-medium text-gray-900 mb-1">{integration.name}</h3>
                <p className="text-sm text-gray-600">{integration.description}</p>
                <span className="inline-block text-xs px-2 py-1 bg-gray-200 rounded-full mt-3">Coming Soon</span>
              </div>
            ))}
          </div>
        </section>

        {/* All Integrations Visual */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Integration Ecosystem</h2>
          <p className="text-gray-600 mb-6">
            Our full ecosystem of current and planned platform integrations.
          </p>
          
          <BrandIconsGrid showUpcoming={true} title="" description="" />
        </section>
      </div>
    </div>
  );
};



export default Integrations;