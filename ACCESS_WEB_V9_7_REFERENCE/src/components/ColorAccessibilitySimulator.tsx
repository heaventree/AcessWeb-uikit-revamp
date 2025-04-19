import { useState, useRef, useEffect } from 'react';
import { Camera, Shuffle } from 'lucide-react';
import Color from 'color';

// Type definitions for color target elements
// Used when implementing draggable color picker in future enhancements

interface ColorBlindnessSimulation {
  id: string;
  name: string;
  description: string;
}

const COLOR_BLINDNESS_TYPES: ColorBlindnessSimulation[] = [
  { 
    id: 'normal', 
    name: 'Normal Vision', 
    description: 'Standard vision with no color deficiency' 
  },
  { 
    id: 'protanopia', 
    name: 'Protanopia', 
    description: 'Red-blind (absence of red retinal photoreceptors)' 
  },
  { 
    id: 'deuteranopia', 
    name: 'Deuteranopia', 
    description: 'Green-blind (absence of green retinal photoreceptors)' 
  },
  { 
    id: 'tritanopia', 
    name: 'Tritanopia', 
    description: 'Blue-blind (absence of blue retinal photoreceptors)' 
  },
  { 
    id: 'achromatopsia', 
    name: 'Achromatopsia', 
    description: 'Complete color blindness, seeing only in grayscale' 
  }
];

// Helper functions for color contrast
function getLuminance(color: string): number {
  try {
    return Color(color).luminosity();
  } catch (error) {
    console.error('Error calculating luminance:', error);
    return 0;
  }
}

function getContrastRatio(color1: string, color2: string): number {
  try {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1; // Return minimum ratio to flag as an issue
  }
}

function getWCAGLevel(ratio: number, isLargeText: boolean = false): string {
  if (!isLargeText) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  } else {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
}

// Component for simulating color blindness on a preview element
export function ColorAccessibilitySimulator() {
  // State for the selected element and colors
  const [activeElement, setActiveElement] = useState<'text' | 'background' | 'border'>('background');
  const [simulationMode, setSimulationMode] = useState<string>('normal');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#cccccc');
  const [fontSize, setFontSize] = useState(16); // in pixels
  const [isFontLarge, setIsFontLarge] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate contrast ratio and WCAG compliance
  const contrastRatio = getContrastRatio(textColor, backgroundColor);
  const wcagLevel = getWCAGLevel(contrastRatio, isFontLarge);
  
  // Update isFontLarge when fontSize changes
  useEffect(() => {
    // According to WCAG 2.1:
    // Large text is defined as:
    // - 18.66px and bold (or larger)
    // - 24px and normal weight (or larger)
    setIsFontLarge(fontSize >= 24 || (fontSize >= 18.66 && true)); // Assuming bold for simplicity
  }, [fontSize]);

  // Function to generate random accessible colors
  const generateRandomColors = () => {
    // Generate random background color
    const randomBg = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    // Get appropriate text color based on contrast ratio
    const bgLuminance = getLuminance(randomBg);
    const textCol = bgLuminance > 0.5 ? '#000000' : '#ffffff';
    
    // Generate a random border color with good contrast against the background
    let randomBorder;
    do {
      randomBorder = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (getContrastRatio(randomBorder, randomBg) < 2); // Ensure some contrast with background
    
    setBackgroundColor(randomBg);
    setTextColor(textCol);
    setBorderColor(randomBorder);
  };

  // Function to handle color changes
  const handleColorChange = (color: string) => {
    switch (activeElement) {
      case 'text':
        setTextColor(color);
        break;
      case 'background':
        setBackgroundColor(color);
        break;
      case 'border':
        setBorderColor(color);
        break;
    }
  };

  // Apply color blindness filters to the preview
  const getColorBlindnessFilter = () => {
    switch (simulationMode) {
      case 'protanopia':
        return 'grayscale(0%) brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg) invert(0%) sepia(0%) url(#protanopia)';
      case 'deuteranopia':
        return 'grayscale(0%) brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg) invert(0%) sepia(0%) url(#deuteranopia)';
      case 'tritanopia':
        return 'grayscale(0%) brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg) invert(0%) sepia(0%) url(#tritanopia)';
      case 'achromatopsia':
        return 'grayscale(100%) brightness(100%) contrast(100%)';
      default:
        return 'none';
    }
  };

  // Handle screenshot of the preview
  const takeScreenshot = () => {
    if (previewRef.current) {
      // Using html2canvas or similar library to capture as image
      alert('Screenshot functionality would be implemented here with html2canvas');
    }
  };

  // Function to handle drag-and-drop color picking
  const handleElementClick = (element: 'text' | 'background' | 'border') => {
    setActiveElement(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Color Accessibility Simulator</h2>
      <p className="text-gray-600 mb-6">
        Test color combinations for WCAG compliance with this interactive simulator.
        Click on the preview elements to select them, then use the color picker to adjust colors.
      </p>
      
      {/* SVG Filters for color blindness simulation */}
      <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          {/* Protanopia Filter - Red-Blind */}
          <filter id="protanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>
          
          {/* Deuteranopia Filter - Green-Blind */}
          <filter id="deuteranopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.625, 0.375, 0,   0, 0
                      0.7,   0.3,   0,   0, 0
                      0,     0.3,   0.7, 0, 0
                      0,     0,     0,   1, 0"
            />
          </filter>
          
          {/* Tritanopia Filter - Blue-Blind */}
          <filter id="tritanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0"
            />
          </filter>
        </defs>
      </svg>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Section */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 relative">
          <div 
            ref={previewRef}
            className="p-8 rounded-lg border-2 transition-all duration-300 relative mx-auto max-w-lg"
            style={{ 
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              filter: getColorBlindnessFilter()
            }}
          >
            <div 
              className={`cursor-pointer p-4 ${activeElement === 'background' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={() => handleElementClick('background')}
            >
              <h3 
                className={`text-xl font-bold mb-2 cursor-pointer ${activeElement === 'text' ? 'ring-2 ring-blue-500 ring-offset-0' : ''}`}
                style={{ 
                  color: textColor,
                  fontSize: `${fontSize}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElementClick('text');
                }}
              >
                Sample Text Preview
              </h3>
              <p 
                className={`cursor-pointer ${activeElement === 'text' ? 'ring-2 ring-blue-500 ring-offset-0' : ''}`}
                style={{ 
                  color: textColor,
                  fontSize: `${fontSize}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElementClick('text');
                }}
              >
                This text demonstrates the contrast between your chosen text and background colors.
                WCAG {wcagLevel === 'AAA' ? 'AAA' : wcagLevel === 'AA' ? 'AA' : 'fails'} compliance for
                {isFontLarge ? ' large' : ' normal'} text with a contrast ratio of {contrastRatio.toFixed(2)}:1.
              </p>
            </div>
            
            <div 
              className={`mt-4 p-3 border-2 rounded cursor-pointer ${activeElement === 'border' ? 'ring-2 ring-blue-500' : ''}`}
              style={{ borderColor: borderColor }}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick('border');
              }}
            >
              <span style={{ color: textColor }}>Border Element</span>
            </div>
          </div>
          
          {/* Tools for the preview */}
          <div className="flex justify-center mt-4 space-x-3">
            <button 
              onClick={takeScreenshot}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Take screenshot"
              title="Take screenshot"
            >
              <Camera size={18} />
            </button>
            <button 
              onClick={generateRandomColors}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Generate random colors"
              title="Generate random colors"
            >
              <Shuffle size={18} />
            </button>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Element</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleElementClick('text')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeElement === 'text' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => handleElementClick('background')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeElement === 'background' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Background
              </button>
              <button
                onClick={() => handleElementClick('border')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeElement === 'border' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Border
              </button>
            </div>
          </div>
          
          {/* Color Picker */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Color</h3>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                style={{ 
                  backgroundColor: activeElement === 'text' 
                    ? textColor 
                    : activeElement === 'background' 
                      ? backgroundColor 
                      : borderColor 
                }}
              ></div>
              <input 
                type="color" 
                value={activeElement === 'text' 
                  ? textColor 
                  : activeElement === 'background' 
                    ? backgroundColor 
                    : borderColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 p-1"
                aria-label={`Color picker for ${activeElement}`}
              />
            </div>
          </div>
          
          {/* Color Values */}
          <div className="mb-4">
            <label htmlFor="colorHex" className="block text-sm font-medium text-gray-700 mb-1">
              Hex Value
            </label>
            <input
              type="text"
              id="colorHex"
              value={activeElement === 'text' 
                ? textColor 
                : activeElement === 'background' 
                  ? backgroundColor 
                  : borderColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Font Size Control */}
          <div className="mb-4">
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
              Font Size ({fontSize}px) - {isFontLarge ? 'Large Text' : 'Normal Text'}
            </label>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Color Blindness Simulation */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Vision Simulation</h3>
            <select
              value={simulationMode}
              onChange={(e) => setSimulationMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {COLOR_BLINDNESS_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {COLOR_BLINDNESS_TYPES.find(t => t.id === simulationMode)?.description}
            </p>
          </div>
          
          {/* WCAG Compliance Info */}
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Contrast Results</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Text/Background:</span>
              <span className="font-mono text-sm">{contrastRatio.toFixed(2)}:1</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">WCAG Level:</span>
              <span className={`font-medium ${
                wcagLevel === 'AAA' 
                  ? 'text-green-600' 
                  : wcagLevel === 'AA' 
                    ? 'text-blue-600' 
                    : 'text-red-600'
              }`}>
                {wcagLevel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Text Size:</span>
              <span className="text-sm">{isFontLarge ? 'Large' : 'Normal'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorAccessibilitySimulator;