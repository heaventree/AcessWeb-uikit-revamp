/**
 * Home Page Component
 * 
 * Landing page for the WCAG Accessibility Audit application
 * with accessibility features and security integration.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Home Page Component
 */
function HomePage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Home</title>
        <meta name="description" content="WCAG Accessibility testing and compliance tool for web applications" />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              WCAG Accessibility Audit Tool
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Comprehensive accessibility testing and compliance reporting for your web applications
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium focus-ring"
                aria-label="Log in to your account"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-white border border-gray-300 hover:border-gray-400 text-gray-800 px-6 py-3 rounded-md font-medium focus-ring"
                aria-label="Create a new account"
              >
                Sign Up
              </Link>
            </div>
          </section>
          
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">WCAG 2.2 Compliance</h3>
                <p className="text-gray-600">
                  Ensure your websites and applications meet the latest WCAG 2.2 accessibility standards.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Automated Testing</h3>
                <p className="text-gray-600">
                  Run automated scans to identify accessibility issues and get detailed reports.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Compliance Reporting</h3>
                <p className="text-gray-600">
                  Generate comprehensive reports with actionable remediation recommendations.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Start Your Accessibility Journey Today
            </h2>
            <p className="text-gray-600 mb-6">
              Our platform helps organizations identify and fix accessibility issues, 
              ensuring digital experiences are inclusive for all users, including those with disabilities.
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium focus-ring"
            >
              Get Started
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

export default HomePage;