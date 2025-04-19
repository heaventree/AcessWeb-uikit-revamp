import React, { useState, useEffect } from 'react';
import { Sun, Moon, ZoomIn, ZoomOut, Type, Settings, Move, Underline, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { WCAGBadge } from './WCAGBadge';

// Font size options per WCAG 1.4.4 (Resize text)
type FontSizeOption = 'normal' | 'large' | 'x-large';
// Contrast modes per WCAG 1.4.3/1.4.6 (Contrast)
type ContrastMode = 'normal' | 'high';
// Motion reduction per WCAG 2.3.3 (Animation from Interactions)
type MotionPreference = 'default' | 'reduced';
// Text spacing per WCAG 1.4.12 (Text Spacing)
type TextSpacingOption = 'default' | 'increased';

export function WCAGToolbar() {
  // State for toolbar visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // State for accessibility settings
  const [fontSize, setFontSize] = useState<FontSizeOption>('normal');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [motionPreference, setMotionPreference] = useState<MotionPreference>('default');
  const [textSpacing, setTextSpacing] = useState<TextSpacingOption>('default');
  const [focusIndicator, setFocusIndicator] = useState(false);
  
  // Track current theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>('light');
  
  // Apply settings to document when they change
  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-x-large');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    
    // Apply contrast mode
    document.documentElement.classList.remove('contrast-normal', 'contrast-high');
    document.documentElement.classList.add(`contrast-${contrastMode}`);
    
    // Apply motion preference
    document.documentElement.classList.remove('motion-default', 'motion-reduced');
    document.documentElement.classList.add(`motion-${motionPreference}`);
    
    // Apply text spacing
    document.documentElement.classList.remove('text-spacing-default', 'text-spacing-increased');
    document.documentElement.classList.add(`text-spacing-${textSpacing}`);
    
    // Apply focus indicator
    if (focusIndicator) {
      document.documentElement.classList.add('enhanced-focus');
    } else {
      document.documentElement.classList.remove('enhanced-focus');
    }
    
    // Store settings in localStorage
    localStorage.setItem('wcag-font-size', fontSize);
    localStorage.setItem('wcag-contrast-mode', contrastMode);
    localStorage.setItem('wcag-motion-preference', motionPreference);
    localStorage.setItem('wcag-text-spacing', textSpacing);
    localStorage.setItem('wcag-focus-indicator', focusIndicator.toString());
  }, [fontSize, contrastMode, motionPreference, textSpacing, focusIndicator]);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('wcag-font-size') as FontSizeOption | null;
    const savedContrastMode = localStorage.getItem('wcag-contrast-mode') as ContrastMode | null;
    const savedMotionPreference = localStorage.getItem('wcag-motion-preference') as MotionPreference | null;
    const savedTextSpacing = localStorage.getItem('wcag-text-spacing') as TextSpacingOption | null;
    const savedFocusIndicator = localStorage.getItem('wcag-focus-indicator');
    
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
    
    if (savedContrastMode) {
      setContrastMode(savedContrastMode);
    }
    
    if (savedMotionPreference) {
      setMotionPreference(savedMotionPreference);
    }
    
    if (savedTextSpacing) {
      setTextSpacing(savedTextSpacing);
    }
    
    if (savedFocusIndicator === 'true') {
      setFocusIndicator(true);
    }
  }, []);
  
  // Toggle toolbar visibility
  const toggleToolbar = () => setIsOpen(!isOpen);
  
  // Increase font size
  const increaseFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('x-large');
  };
  
  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize === 'x-large') setFontSize('large');
    else if (fontSize === 'large') setFontSize('normal');
  };
  
  // Toggle contrast mode
  const toggleContrastMode = () => {
    setContrastMode(prevMode => prevMode === 'normal' ? 'high' : 'normal');
  };
  
  // Toggle motion preference
  const toggleMotionPreference = () => {
    setMotionPreference(prevPref => prevPref === 'default' ? 'reduced' : 'default');
  };
  
  // Toggle text spacing
  const toggleTextSpacing = () => {
    setTextSpacing(prevSpacing => prevSpacing === 'default' ? 'increased' : 'default');
  };
  
  // Toggle focus indicator
  const toggleFocusIndicator = () => {
    setFocusIndicator(prevState => !prevState);
  };
  
  // Update theme state when component mounts and when theme changes
  useEffect(() => {
    // Get initial theme on component mount
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    
    // Set up a mutation observer to track theme changes from other components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          const isDarkNow = document.documentElement.classList.contains("dark");
          setThemeState(isDarkNow ? "dark" : "light");
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);
  
  // Toggle theme
  const toggleTheme = () => {
    const root = window.document.documentElement;
    
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
      setThemeState("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
      setThemeState("dark");
    }
  };
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      aria-label="Accessibility Tools"
    >
      {isOpen && (
        <Card className="p-4 w-64 border border-border shadow-lg bg-card text-card-foreground">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Accessibility Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={toggleToolbar}
                aria-label="Close accessibility toolbar"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator />
            
            <div className="grid gap-4">
              {/* Display WCAG compliance badge */}
              <div className="flex justify-center mb-1">
                <WCAGBadge level="AA" size="md" showTooltip={true} />
              </div>
              
              {/* Dark mode toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="text-sm">
                  Dark Mode
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                />
              </div>
              
              {/* High contrast for WCAG 1.4.3 (Contrast Minimum) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast-toggle" className="text-sm">
                  High Contrast
                </Label>
                <Switch
                  id="contrast-toggle"
                  checked={contrastMode === 'high'}
                  onCheckedChange={toggleContrastMode}
                  aria-label={contrastMode === 'high' ? 'Switch to normal contrast' : 'Switch to high contrast'}
                />
              </div>
              
              {/* Text size for WCAG 1.4.4 (Resize Text) */}
              <div className="flex items-center justify-between">
                <Label className="text-sm">Text Size</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'normal'}
                    aria-label="Decrease text size"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs w-16 text-center">
                    {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large' : 'Extra Large'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={increaseFontSize}
                    disabled={fontSize === 'x-large'}
                    aria-label="Increase text size"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Motion reduction for WCAG 2.3.3 (Animation from Interactions) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="motion-toggle" className="text-sm">
                  Reduce Motion
                </Label>
                <Switch
                  id="motion-toggle"
                  checked={motionPreference === 'reduced'}
                  onCheckedChange={toggleMotionPreference}
                  aria-label={motionPreference === 'reduced' ? 'Enable animations' : 'Reduce animations'}
                />
              </div>
              
              {/* Text spacing for WCAG 1.4.12 (Text Spacing) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="text-spacing-toggle" className="text-sm">
                  Increased Spacing
                </Label>
                <Switch
                  id="text-spacing-toggle"
                  checked={textSpacing === 'increased'}
                  onCheckedChange={toggleTextSpacing}
                  aria-label={textSpacing === 'increased' ? 'Normal text spacing' : 'Increase text spacing'}
                />
              </div>
              
              {/* Focus indicators for WCAG 2.4.7 (Focus Visible) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="focus-toggle" className="text-sm">
                  Enhanced Focus
                </Label>
                <Switch
                  id="focus-toggle"
                  checked={focusIndicator}
                  onCheckedChange={toggleFocusIndicator}
                  aria-label={focusIndicator ? 'Standard focus indicators' : 'Enhanced focus indicators'}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={toggleToolbar}
              className="rounded-full h-12 w-12 shadow-lg"
              aria-label="Open accessibility toolbar"
            >
              <Type className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Accessibility Tools</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Note: All WCAG styles are now in global-theme.css for consistent loading and application

export default WCAGToolbar;