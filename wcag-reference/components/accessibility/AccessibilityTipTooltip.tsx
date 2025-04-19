import React, { useEffect, useRef, useState } from 'react';
import { useAccessibilityTips } from '../../contexts/AccessibilityTipsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiInfo } from 'react-icons/fi';

export function AccessibilityTipTooltip() {
  const { activeTip, isEnabled, setActiveTip } = useAccessibilityTips();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate position when active tip changes
  useEffect(() => {
    if (!activeTip?.element || !isEnabled) return;

    const updatePosition = () => {
      const element = activeTip.element;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();

      if (!tooltipRect) return;

      const x = Math.min(
        rect.left + window.scrollX,
        window.innerWidth - tooltipRect.width - 20
      );
      
      const y = rect.bottom + window.scrollY + 10;

      setPosition({ x, y });
    };

    // Update position initially and on scroll/resize
    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeTip, isEnabled]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTip) {
        setActiveTip(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTip, setActiveTip]);

  if (!activeTip || !isEnabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        style={{ 
          position: 'absolute', 
          left: position.x, 
          top: position.y,
          zIndex: 9999 
        }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-w-full text-left"
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{activeTip.title}</h3>
            <button 
              onClick={() => setActiveTip(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close tooltip"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="mt-2 text-gray-600 text-sm">
            {activeTip.description}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <FiInfo size={14} className="mr-1" />
              <span>{activeTip.wcagReference}</span>
            </div>
            
            {activeTip.wcagReference && (
              <a 
                href={`https://www.w3.org/WAI/WCAG21/Understanding/${activeTip.wcagReference.toLowerCase().replace(/\s+/g, '')}.html`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
              >
                Learn more <FiExternalLink size={12} className="ml-1" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}