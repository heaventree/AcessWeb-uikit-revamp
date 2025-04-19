/**
 * Accessibility Fixes Admin Page
 * 
 * This page demonstrates the non-destructive accessibility fix system.
 */

import React from 'react';
import { AccessibilityFixDashboard } from '../../components/admin/AccessibilityFixDashboard';
import { WordPressSite } from '../../lib/accessibility-fixes';

export default function AccessibilityFixesPage() {
  // Sample demonstration sites
  const demoSites: WordPressSite[] = [
    {
      id: 'site1',
      name: 'Demo WordPress Site',
      url: 'https://demo-wordpress-site.example.com',
      platform: 'wordpress',
      apiUrl: 'https://demo-wordpress-site.example.com/wp-json',
      credentials: {
        username: 'demo_user',
        applicationPassword: '1234-abcd-5678-efgh'
      },
      metadata: {
        theme: 'Twenty Twenty-Two',
        plugins: ['Yoast SEO', 'WooCommerce']
      }
    },
    {
      id: 'site2',
      name: 'Company Blog Site',
      url: 'https://blog.example.org',
      platform: 'wordpress',
      apiUrl: 'https://blog.example.org/wp-json',
      credentials: {
        username: 'admin_user',
        applicationPassword: '9876-wxyz-5432-abcd'
      },
      metadata: {
        theme: 'Astra',
        plugins: ['Elementor', 'Contact Form 7']
      }
    }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Non-Destructive Accessibility Fixes</h1>
        <p className="text-lg text-gray-700 mb-2">
          This system allows you to apply and manage accessibility fixes across websites without modifying core files.
        </p>
        <p className="text-md text-gray-600">
          Fixes are applied using custom CSS with full tracking and reversion capabilities.
        </p>
      </div>
      
      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Demo Mode</h2>
        <p className="text-gray-700">
          This is a demonstration of the non-destructive accessibility fix system. In this demo, fixes are stored in browser localStorage rather than being applied to actual websites.
        </p>
      </div>
      
      <AccessibilityFixDashboard sites={demoSites} />
      
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">1. Non-Destructive Approach</h3>
            <p className="text-gray-700">
              All fixes are applied using custom CSS files, ensuring that core website files remain untouched. This makes the system safe to use on any website, including WordPress sites.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">2. Easy Reversion</h3>
            <p className="text-gray-700">
              Each fix is isolated and can be individually reverted at any time. The system keeps track of all applied fixes and provides one-click reversion.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">3. WCAG Compliance</h3>
            <p className="text-gray-700">
              Fixes are designed to address specific WCAG criteria, with each fix clearly indicating which accessibility guidelines it helps satisfy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}