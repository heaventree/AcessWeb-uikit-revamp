import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { accessibilityCompliancePercentage } from '../utils/accessibility-compliance';

export function AccessibilityBadge() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      {/* Simple pill badge button - matching previous design */}
      <motion.button
        className="fixed right-5 bottom-4 bg-green-600 text-white p-0 rounded-full shadow-md z-40 h-12 w-12
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                   flex items-center justify-center"
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="WCAG Compliance Status"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <CheckCircle className="h-6 w-6" aria-hidden="true" />
      </motion.button>
      
      {/* Simpler details tooltip - only show when needed */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed right-5 bottom-20 bg-white rounded-lg shadow-lg z-40 p-3 max-w-[250px]"
        >
          <div className="flex flex-col">
            <h3 className="text-sm font-medium mb-2 text-gray-900">Compliance Details</h3>
            <p className="text-xs text-gray-600 mb-3">
              This application is compliant with WCAG 2.1 Level AA success criteria, 
              ensuring accessibility for people with disabilities.
            </p>
            <button 
              className="text-xs text-gray-500 hover:text-gray-700 self-end"
              onClick={() => setShowDetails(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}