import React, { useState, useEffect } from 'react';
import { 
  checkWCAGCompliance, 
  formatContrastRatio, 
  getAccessibleTextColor 
} from '@/utils/contrastChecker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { WCAGBadge } from './WCAGBadge';

interface ContrastCheckerProps {
  defaultForeground?: string;
  defaultBackground?: string;
}

export function ContrastChecker({ 
  defaultForeground = '#000000', 
  defaultBackground = '#FFFFFF' 
}: ContrastCheckerProps) {
  const [foreground, setForeground] = useState(defaultForeground);
  const [background, setBackground] = useState(defaultBackground);
  const [normalTextResult, setNormalTextResult] = useState({ ratio: 21, level: 'AAA' as 'AAA' | 'AA' | 'A' | 'Fail' });
  const [largeTextResult, setLargeTextResult] = useState({ ratio: 21, level: 'AAA' as 'AAA' | 'AA' | 'A' | 'Fail' });
  
  // Analyze color contrast when colors change
  useEffect(() => {
    // Check for normal text
    const normalResult = checkWCAGCompliance(foreground, background, false);
    
    // Check for large text
    const largeResult = checkWCAGCompliance(foreground, background, true);
    
    // Update state with results
    setNormalTextResult({
      ratio: normalResult.ratio,
      level: normalResult.passesAAA ? 'AAA' : normalResult.passesAA ? 'AA' : 'Fail'
    });
    
    setLargeTextResult({
      ratio: largeResult.ratio,
      level: largeResult.passesAAA ? 'AAA' : largeResult.passesAA ? 'AA' : 'Fail'
    });
  }, [foreground, background]);
  
  // Convert 'Fail' to empty string for the badge
  const getNormalTextBadgeLevel = () => {
    return normalTextResult.level === 'Fail' ? 'A' : normalTextResult.level;
  };
  
  const getLargeTextBadgeLevel = () => {
    return largeTextResult.level === 'Fail' ? 'A' : largeTextResult.level;
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>WCAG Contrast Checker</CardTitle>
        <CardDescription>
          Check color combinations against WCAG 2.1 accessibility standards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Color Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="foreground">Text Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-md border border-input"
                style={{ backgroundColor: foreground }}
              />
              <Input
                id="foreground"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Background Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-md border border-input"
                style={{ backgroundColor: background }}
              />
              <Input
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        {/* Preview Area */}
        <div 
          className="h-20 w-full rounded-md border flex items-center justify-center p-4"
          style={{ 
            backgroundColor: background,
            color: foreground
          }}
        >
          <div className="text-center">
            <p className="text-sm font-normal mb-1">Normal text sample</p>
            <p className="text-xl font-bold">Large text sample</p>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Contrast Results</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Normal Text</p>
              <div className="flex items-center gap-2">
                <WCAGBadge level={getNormalTextBadgeLevel() as 'A' | 'AA' | 'AAA'} />
                <span className={`text-sm ${normalTextResult.level === 'Fail' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {formatContrastRatio(normalTextResult.ratio)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {normalTextResult.level === 'Fail' 
                  ? 'Does not meet WCAG standards' 
                  : `Meets WCAG ${normalTextResult.level}`}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Large Text</p>
              <div className="flex items-center gap-2">
                <WCAGBadge level={getLargeTextBadgeLevel() as 'A' | 'AA' | 'AAA'} />
                <span className={`text-sm ${largeTextResult.level === 'Fail' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {formatContrastRatio(largeTextResult.ratio)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {largeTextResult.level === 'Fail' 
                  ? 'Does not meet WCAG standards' 
                  : `Meets WCAG ${largeTextResult.level}`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p>
          WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
        </p>
      </CardFooter>
    </Card>
  );
}

export default ContrastChecker;