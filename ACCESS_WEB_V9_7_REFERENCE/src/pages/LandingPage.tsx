import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  BarChart, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Code,
  Globe,
  Award,
  Clock
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Introducing AccessWeb
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    Make Your Website Accessible to Everyone
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Automated WCAG compliance testing and monitoring to ensure your website 
                  is accessible to all users. Get detailed reports and fixes in minutes.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => navigate('/signup')}
                      className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate('/demo')}
                      className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <img
                    className="w-full rounded-lg"
                    src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Dashboard preview"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-blue-600">99%</span>
                  <span className="mt-2 text-sm text-gray-500 text-center">Accuracy Rate</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-blue-600">5M+</span>
                  <span className="mt-2 text-sm text-gray-500 text-center">Pages Scanned</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-blue-600">10k+</span>
                  <span className="mt-2 text-sm text-gray-500 text-center">Happy Customers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-blue-600">24/7</span>
                  <span className="mt-2 text-sm text-gray-500 text-center">Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need for WCAG Compliance
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Comprehensive accessibility testing and monitoring in one powerful platform
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-blue-500 text-white flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Automated Testing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Scan your entire website automatically for WCAG 2.1 compliance issues
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-green-500 text-white flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Fixes</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get instant recommendations and code snippets to fix accessibility issues
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-purple-500 text-white flex items-center justify-center">
                    <BarChart className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Detailed Reports</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Generate comprehensive reports for stakeholders and compliance records
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-red-500 text-white flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Global Standards</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Support for WCAG 2.1, Section 508, ADA, and international standards
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-yellow-500 text-white flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">API Access</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Integrate accessibility testing into your development workflow
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-md bg-indigo-500 text-white flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 Monitoring</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Continuous monitoring to catch accessibility issues before users do
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                View pricing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Trusted by Industry Leaders
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Sarah Wilson"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Sarah Wilson</h4>
                  <p className="text-gray-500">Head of Digital, TechCorp</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "AccessWeb has transformed how we approach accessibility. The automated testing and real-time monitoring have saved us countless hours."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Michael Chen"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Michael Chen</h4>
                  <p className="text-gray-500">CTO, WebSolutions</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "The detailed reports and fix suggestions make it easy for our developers to maintain WCAG compliance across all our projects."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="David Thompson"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">David Thompson</h4>
                  <p className="text-gray-500">Accessibility Lead, Agency X</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "AccessWeb's continuous monitoring gives us peace of mind knowing our sites stay compliant even as we make updates."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}