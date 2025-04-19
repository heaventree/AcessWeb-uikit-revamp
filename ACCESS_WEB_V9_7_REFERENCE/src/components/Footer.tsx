import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AccessWeb
            </span>
            <p className="mt-4 text-gray-500">
              Making web accessibility compliance simple and automated for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms</Link></li>
              <li><Link to="/accessibility" className="text-gray-500 hover:text-gray-900">Accessibility</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-gray-500">
              Get the latest updates on accessibility compliance.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-l-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border-none text-sm font-medium rounded-r-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 AccessWeb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}