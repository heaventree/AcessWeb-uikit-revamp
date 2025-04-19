import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RandomTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Random Test Page
          </h1>
          <p className="text-xl text-gray-600">
            This is a random test page to verify navigation and routing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <h2 className="ml-3 text-xl font-bold text-gray-900">Test Feature 1</h2>
            </div>
            <p className="text-gray-600 mb-4">
              This is a test feature to verify component rendering and styles.
            </p>
            <Link
              to="/docs"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
              <h2 className="ml-3 text-xl font-bold text-gray-900">Test Feature 2</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Another test feature showcasing different styling and animations.
            </p>
            <Link
              to="/docs"
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-green-600" />
              <h2 className="ml-3 text-xl font-bold text-gray-900">Test Feature 3</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A third test feature demonstrating layout and responsiveness.
            </p>
            <Link
              to="/docs"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 bg-blue-600 rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Test More?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            This is a test call-to-action section to verify component styling and interactions.
          </p>
          <Link
            to="/docs"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50"
          >
            View Documentation
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}