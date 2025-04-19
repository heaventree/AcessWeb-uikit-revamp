import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, AlignLeft, AlignCenter, MousePointer2, Link, Eye, PanelTop, Keyboard, Volume2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [features, setFeatures] = useState({
    largeCursor: false,
    highlightLinks: false,
    highlightFocus: false,
    highContrast: false,
    virtualKeyboard: false,
    textToSpeech: false,
    textAlignLeft: false,
    textAlignCenter: false
  });

  const toggleFeature = (feature: keyof typeof features) => {
    // Special handling for text alignment (mutually exclusive)
    if (feature === 'textAlignLeft' || feature === 'textAlignCenter') {
      const isCurrentlyActive = features[feature];
      
      // If activating an alignment option, deactivate the other
      if (!isCurrentlyActive) {
        const otherAlignment = feature === 'textAlignLeft' ? 'textAlignCenter' : 'textAlignLeft';
        setFeatures(prev => ({
          ...prev,
          [feature]: true,
          [otherAlignment]: false
        }));
        
        // Apply text alignment
        document.body.style.textAlign = feature === 'textAlignLeft' ? 'left' : 'center';
      } else {
        // If deactivating, just turn it off and reset to default
        setFeatures(prev => ({
          ...prev,
          [feature]: false
        }));
        
        // Reset text alignment
        document.body.style.textAlign = '';
      }
      return;
    }
    
    // Regular toggle for other features
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    // Apply feature effects
    switch (feature) {
      case 'largeCursor':
        document.body.classList.toggle('large-cursor', !features.largeCursor);
        break;
      case 'highlightLinks':
        document.body.classList.toggle('highlight-links', !features.highlightLinks);
        break;
      case 'highlightFocus':
        document.body.classList.toggle('highlight-focus', !features.highlightFocus);
        break;
      case 'highContrast':
        document.body.classList.toggle('high-contrast', !features.highContrast);
        break;
      case 'virtualKeyboard':
        // Toggle virtual keyboard logic would go here
        break;
      case 'textToSpeech':
        // Toggle text to speech logic would go here
        break;
    }
  };

  const increaseTextSize = () => {
    if (textSize < 200) {
      const newSize = textSize + 10;
      setTextSize(newSize);
      document.documentElement.style.setProperty('--accessibility-text-zoom', `${newSize}%`);
    }
  };

  const decreaseTextSize = () => {
    if (textSize > 70) {
      const newSize = textSize - 10;
      setTextSize(newSize);
      document.documentElement.style.setProperty('--accessibility-text-zoom', `${newSize}%`);
    }
  };

  const resetAllSettings = () => {
    setTextSize(100);
    setFeatures({
      largeCursor: false,
      highlightLinks: false,
      highlightFocus: false,
      highContrast: false,
      virtualKeyboard: false,
      textToSpeech: false,
      textAlignLeft: false,
      textAlignCenter: false
    });
    
    // Reset all applied classes and styles
    document.documentElement.style.setProperty('--accessibility-text-zoom', '100%');
    document.body.classList.remove(
      'large-cursor',
      'highlight-links',
      'highlight-focus',
      'high-contrast'
    );
    
    // Reset text alignment
    document.body.style.textAlign = '';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Accessibility toggle button - fixed to the right side of the screen */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-[132px] right-5 z-50 bg-cyan-500 text-white p-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 h-12 w-12 flex items-center justify-center"
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
      >
        <Eye size={24} />
      </button>

      {/* Accessibility tools panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-16 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-72 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Accessibility Tools</h2>
              <button 
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close accessibility menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Text Size Controls */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Text Size</p>
              <div className="flex items-center">
                <button 
                  onClick={decreaseTextSize}
                  className="bg-gray-100 p-2 rounded-l-md hover:bg-gray-200"
                  aria-label="Decrease text size"
                >
                  <ZoomOut size={18} />
                </button>
                <div className="flex-1 text-center bg-gray-50 py-2">
                  {textSize}%
                </div>
                <button 
                  onClick={increaseTextSize}
                  className="bg-gray-100 p-2 rounded-r-md hover:bg-gray-200"
                  aria-label="Increase text size"
                >
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Text Alignment</p>
              <div className="flex gap-2">
                <button
                  className={`flex-1 p-2 rounded-md ${features.textAlignLeft ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => toggleFeature('textAlignLeft')}
                  aria-label="Align text left"
                >
                  <AlignLeft size={18} className="mx-auto" />
                </button>
                <button
                  className={`flex-1 p-2 rounded-md ${features.textAlignCenter ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => toggleFeature('textAlignCenter')}
                  aria-label="Align text center"
                >
                  <AlignCenter size={18} className="mx-auto" />
                </button>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2 mb-4">
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.largeCursor ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('largeCursor')}
              >
                <MousePointer2 size={18} className="mr-2" />
                <span>Large Cursor</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.highlightLinks ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('highlightLinks')}
              >
                <Link size={18} className="mr-2" />
                <span>Highlight Links</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.highlightFocus ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('highlightFocus')}
              >
                <Eye size={18} className="mr-2" />
                <span>Highlight Focus</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.highContrast ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('highContrast')}
              >
                <PanelTop size={18} className="mr-2" />
                <span>High Contrast</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.virtualKeyboard ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('virtualKeyboard')}
              >
                <Keyboard size={18} className="mr-2" />
                <span>Virtual Keyboard</span>
              </button>
              
              <button 
                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${features.textToSpeech ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => toggleFeature('textToSpeech')}
              >
                <Volume2 size={18} className="mr-2" />
                <span>Text to Speech</span>
              </button>
            </div>
            
            {/* Reset Button */}
            <button 
              onClick={resetAllSettings}
              className="w-full mt-4 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md py-2"
            >
              <RotateCcw size={16} className="mr-2" />
              <span>Reset All Settings</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}