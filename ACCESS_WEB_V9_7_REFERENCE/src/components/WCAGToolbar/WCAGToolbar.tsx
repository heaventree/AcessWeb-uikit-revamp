import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun } from 'react-icons/fi';
import { FiMoon } from 'react-icons/fi';
import { FiZoomIn } from 'react-icons/fi';
import { FiZoomOut } from 'react-icons/fi';
import { FiType } from 'react-icons/fi';
import { FiLink } from 'react-icons/fi';
import { FiImage } from 'react-icons/fi';
import { FiAlignCenter } from 'react-icons/fi';
import { FiRefreshCw } from 'react-icons/fi';
import { FiEye } from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';
import { FiBookOpen } from 'react-icons/fi';
import './WCAGToolbar.css';

export interface WCAGToolbarProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const WCAGToolbar: React.FC<WCAGToolbarProps> = ({ 
  position = 'top-right'
}) => {
  // State for toolbar visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State for accessibility settings
  const [fontSize, setFontSize] = useState<number>(100);
  const [contrast, setContrast] = useState<string>('normal');
  const [highlightLinks, setHighlightLinks] = useState<boolean>(false);
  const [highlightHeadings, setHighlightHeadings] = useState<boolean>(false);
  const [showAltText, setShowAltText] = useState<boolean>(false);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(0);
  
  // Apply settings to document when they change
  useEffect(() => {
    // Apply font size
    document.documentElement.style.setProperty('--wcag-font-scale', `${fontSize}%`);
    
    // Apply contrast mode
    document.body.classList.remove('wcag-contrast-normal', 'wcag-contrast-high', 'wcag-contrast-inverted');
    document.body.classList.add(`wcag-contrast-${contrast}`);
    
    // Apply grayscale
    if (grayscale) {
      document.body.classList.add('wcag-grayscale');
    } else {
      document.body.classList.remove('wcag-grayscale');
    }
    
    // Apply link highlighting
    if (highlightLinks) {
      document.body.classList.add('wcag-highlight-links');
    } else {
      document.body.classList.remove('wcag-highlight-links');
    }
    
    // Apply heading highlighting
    if (highlightHeadings) {
      document.body.classList.add('wcag-highlight-headings');
    } else {
      document.body.classList.remove('wcag-highlight-headings');
    }
    
    // Apply alt text display
    if (showAltText) {
      document.body.classList.add('wcag-show-alt');
    } else {
      document.body.classList.remove('wcag-show-alt');
    }
    
    // Apply letter spacing
    document.documentElement.style.setProperty('--wcag-letter-spacing', `${letterSpacing}px`);
    
    // Apply line height
    document.documentElement.style.setProperty('--wcag-line-height', `${lineHeight === 0 ? 'normal' : (1.5 + lineHeight * 0.25)}em`);
    
    // Store settings in localStorage for persistence
    localStorage.setItem('wcag-font-size', fontSize.toString());
    localStorage.setItem('wcag-contrast', contrast);
    localStorage.setItem('wcag-grayscale', grayscale.toString());
    localStorage.setItem('wcag-highlight-links', highlightLinks.toString());
    localStorage.setItem('wcag-highlight-headings', highlightHeadings.toString());
    localStorage.setItem('wcag-show-alt', showAltText.toString());
    localStorage.setItem('wcag-letter-spacing', letterSpacing.toString());
    localStorage.setItem('wcag-line-height', lineHeight.toString());
  }, [
    fontSize, 
    contrast, 
    grayscale, 
    highlightLinks, 
    highlightHeadings, 
    showAltText,
    letterSpacing,
    lineHeight
  ]);
  
  // Load saved settings on initial render
  useEffect(() => {
    const savedFontSize = localStorage.getItem('wcag-font-size');
    const savedContrast = localStorage.getItem('wcag-contrast');
    const savedGrayscale = localStorage.getItem('wcag-grayscale');
    const savedHighlightLinks = localStorage.getItem('wcag-highlight-links');
    const savedHighlightHeadings = localStorage.getItem('wcag-highlight-headings');
    const savedShowAlt = localStorage.getItem('wcag-show-alt');
    const savedLetterSpacing = localStorage.getItem('wcag-letter-spacing');
    const savedLineHeight = localStorage.getItem('wcag-line-height');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedContrast) setContrast(savedContrast);
    if (savedGrayscale) setGrayscale(savedGrayscale === 'true');
    if (savedHighlightLinks) setHighlightLinks(savedHighlightLinks === 'true');
    if (savedHighlightHeadings) setHighlightHeadings(savedHighlightHeadings === 'true');
    if (savedShowAlt) setShowAltText(savedShowAlt === 'true');
    if (savedLetterSpacing) setLetterSpacing(parseInt(savedLetterSpacing));
    if (savedLineHeight) setLineHeight(parseInt(savedLineHeight));
  }, []);
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  // Reset all settings to default
  const resetAll = () => {
    setFontSize(100);
    setContrast('normal');
    setGrayscale(false);
    setHighlightLinks(false);
    setHighlightHeadings(false);
    setShowAltText(false);
    setLetterSpacing(0);
    setLineHeight(0);
  };
  
  // Increase font size
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 200));
  };
  
  // Decrease font size
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 100));
  };
  
  // Toggle actions with state
  const toggleAction = (action: string) => {
    switch (action) {
      case 'contrast':
        if (contrast === 'normal') setContrast('high');
        else if (contrast === 'high') setContrast('inverted');
        else setContrast('normal');
        break;
      case 'grayscale':
        setGrayscale(prev => !prev);
        break;
      case 'links':
        setHighlightLinks(prev => !prev);
        break;
      case 'headings':
        setHighlightHeadings(prev => !prev);
        break;
      case 'alt':
        setShowAltText(prev => !prev);
        break;
      default:
        break;
    }
  };
  
  // Increase letter spacing
  const increaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.min(prev + 1, 10));
  };
  
  // Decrease letter spacing
  const decreaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.max(prev - 1, 0));
  };
  
  // Increase line height
  const increaseLineHeight = () => {
    setLineHeight(prev => Math.min(prev + 1, 10));
  };
  
  // Decrease line height
  const decreaseLineHeight = () => {
    setLineHeight(prev => Math.max(prev - 1, 0));
  };

  return (
    <>
      {/* Toolbar panel */}
      <motion.div
        className={`wcag-toolbar ${position}`}
        initial={{ x: position.includes('right') ? '100%' : '-100%' }}
        animate={{ x: isOpen ? 0 : position.includes('right') ? '100%' : '-100%' }}
        transition={{ duration: 0.3 }}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility settings"
        tabIndex={-1}
      >
        <div className="wcag-toolbar-header">
          <h2>Accessibility Settings</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="wcag-toolbar-close"
            aria-label="Close accessibility toolbar"
          >
            <FiX />
          </button>
        </div>
        
        <div className="wcag-toolbar-content">
          {/* Font Size Section */}
          <div className="wcag-toolbar-section">
            <h3>Text Size</h3>
            <div className="wcag-toolbar-controls">
              <button 
                onClick={decreaseFontSize} 
                aria-label="Decrease text size"
                disabled={fontSize <= 100}
                className="wcag-toolbar-button"
              >
                <FiZoomOut size={20} /> <span>Smaller</span>
              </button>
              <div className="wcag-toolbar-value">{fontSize}%</div>
              <button 
                onClick={increaseFontSize} 
                aria-label="Increase text size"
                disabled={fontSize >= 200}
                className="wcag-toolbar-button"
              >
                <FiZoomIn size={20} /> <span>Larger</span>
              </button>
            </div>
          </div>
          
          {/* Display Section */}
          <div className="wcag-toolbar-section">
            <h3>Display</h3>
            <div className="wcag-toolbar-controls wcag-toolbar-buttons-grid">
              <button 
                onClick={() => toggleAction('contrast')} 
                aria-label="Toggle high contrast"
                className={`wcag-toolbar-button ${contrast !== 'normal' ? 'active' : ''}`}
              >
                {contrast === 'normal' ? <FiSun size={20} /> : <FiMoon size={20} />}
                <span>{contrast === 'normal' ? 'Normal Contrast' : contrast === 'high' ? 'High Contrast' : 'Inverted Colors'}</span>
              </button>
              
              <button 
                onClick={() => toggleAction('grayscale')} 
                aria-label="Toggle grayscale"
                className={`wcag-toolbar-button ${grayscale ? 'active' : ''}`}
              >
                <FiEye size={20} />
                <span>{grayscale ? 'Disable Grayscale' : 'Enable Grayscale'}</span>
              </button>
            </div>
          </div>
          
          {/* Content Highlighting Section */}
          <div className="wcag-toolbar-section">
            <h3>Content Highlighting</h3>
            <div className="wcag-toolbar-controls wcag-toolbar-buttons-grid">
              <button 
                onClick={() => toggleAction('links')} 
                aria-label="Toggle link highlighting"
                className={`wcag-toolbar-button ${highlightLinks ? 'active' : ''}`}
              >
                <FiLink size={20} />
                <span>{highlightLinks ? 'Hide Link Highlighting' : 'Highlight Links'}</span>
              </button>
              
              <button 
                onClick={() => toggleAction('headings')} 
                aria-label="Toggle heading highlighting"
                className={`wcag-toolbar-button ${highlightHeadings ? 'active' : ''}`}
              >
                <FiBookOpen size={20} />
                <span>{highlightHeadings ? 'Hide Heading Highlighting' : 'Highlight Headings'}</span>
              </button>
              
              <button 
                onClick={() => toggleAction('alt')} 
                aria-label="Toggle image alt text"
                className={`wcag-toolbar-button ${showAltText ? 'active' : ''}`}
              >
                <FiImage size={20} />
                <span>{showAltText ? 'Hide Image Descriptions' : 'Show Image Descriptions'}</span>
              </button>
            </div>
          </div>
          
          {/* Text Spacing Section */}
          <div className="wcag-toolbar-section">
            <h3>Text Spacing</h3>
            <div className="wcag-toolbar-subsection">
              <div className="wcag-toolbar-label">Letter Spacing</div>
              <div className="wcag-toolbar-controls">
                <button 
                  onClick={decreaseLetterSpacing} 
                  aria-label="Decrease letter spacing"
                  disabled={letterSpacing <= 0}
                  className="wcag-toolbar-button wcag-toolbar-button-sm"
                >
                  <FiType size={16} />-
                </button>
                <div className="wcag-toolbar-value">{letterSpacing}px</div>
                <button 
                  onClick={increaseLetterSpacing} 
                  aria-label="Increase letter spacing"
                  disabled={letterSpacing >= 10}
                  className="wcag-toolbar-button wcag-toolbar-button-sm"
                >
                  <FiType size={16} />+
                </button>
              </div>
            </div>
            
            <div className="wcag-toolbar-subsection">
              <div className="wcag-toolbar-label">Line Height</div>
              <div className="wcag-toolbar-controls">
                <button 
                  onClick={decreaseLineHeight} 
                  aria-label="Decrease line height"
                  disabled={lineHeight <= 0}
                  className="wcag-toolbar-button wcag-toolbar-button-sm"
                >
                  <FiAlignCenter size={16} />-
                </button>
                <div className="wcag-toolbar-value">
                  {lineHeight === 0 ? 'Normal' : `${(1.5 + lineHeight * 0.25).toFixed(2)}`}
                </div>
                <button 
                  onClick={increaseLineHeight} 
                  aria-label="Increase line height"
                  disabled={lineHeight >= 10}
                  className="wcag-toolbar-button wcag-toolbar-button-sm"
                >
                  <FiAlignCenter size={16} />+
                </button>
              </div>
            </div>
          </div>
          
          {/* Reset Button */}
          <div className="wcag-toolbar-footer">
            <button
              onClick={resetAll}
              className="wcag-toolbar-button wcag-toolbar-reset"
              aria-label="Reset all settings to default"
            >
              <FiRefreshCw size={20} />
              <span>Reset All Settings</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Toggle button */}
      <button
        className={`wcag-toolbar-toggle-button ${position}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        title="Accessibility Settings"
      >
        <span className="wcag-toolbar-toggle-button-icon">
          <FiSettings size={24} />
        </span>
        <span className="wcag-toolbar-toggle-button-text">Accessibility</span>
      </button>
    </>
  );
}