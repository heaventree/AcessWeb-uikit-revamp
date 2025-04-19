import React, { useState, useEffect } from 'react';
import { FiType, FiSun, FiMoon, FiZoomIn, FiZoomOut, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Font size range options
const fontSizeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'x-large', label: 'Extra Large' }
];

// Contrast modes
const contrastModes = [
  { value: 'normal', label: 'Normal Contrast' },
  { value: 'high', label: 'High Contrast' }
];

export function WCAGAccessibilityToolbar() {
  // State for toolbar visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State for accessibility settings
  const [fontSize, setFontSize] = useState('normal');
  const [contrastMode, setContrastMode] = useState('normal');
  
  // Apply settings to document when they change
  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-x-large');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    
    // Apply contrast mode
    document.documentElement.classList.remove('contrast-normal', 'contrast-high');
    document.documentElement.classList.add(`contrast-${contrastMode}`);
    
    // Store settings in localStorage for persistence
    localStorage.setItem('accessibility-font-size', fontSize);
    localStorage.setItem('accessibility-contrast', contrastMode);
  }, [fontSize, contrastMode]);
  
  // Load saved settings on initial render
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedContrast = localStorage.getItem('accessibility-contrast');
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedContrast) setContrastMode(savedContrast);
  }, []);
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toolbar panel */}
      <motion.div
        className="fixed right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 w-80 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Accessibility settings"
        tabIndex={-1}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Accessibility Settings</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              aria-label="Close accessibility toolbar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Font Size Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${fontSize === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  aria-pressed={fontSize === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Contrast Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Contrast
            </label>
            <div className="space-y-2">
              {contrastModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setContrastMode(mode.value)}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium border-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${contrastMode === mode.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  aria-pressed={contrastMode === mode.value}
                >
                  <span>{mode.label}</span>
                  {mode.value === 'normal' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Reset button */}
          <button
            onClick={() => {
              setFontSize('normal');
              setContrastMode('normal');
            }}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset to Default
          </button>
        </div>
      </motion.div>

      {/* Toggle button */}
      <button
        className="fixed right-0 top-24 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-md shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <span aria-hidden="true"><FiSettings size={20} /></span>
      </button>
    </>
  );
}