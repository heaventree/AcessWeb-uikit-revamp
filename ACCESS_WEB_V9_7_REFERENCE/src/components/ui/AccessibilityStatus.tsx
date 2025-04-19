import { accessibilityImplementation, accessibilityCompliancePercentage } from '../../utils/accessibility-compliance';
import { Card } from './Card';

interface AccessibilityStatusProps {
  className?: string;
  showDetails?: boolean;
}

/**
 * A component that shows the current accessibility compliance status
 * of the WCAG 9.4 Audit Tool itself
 */
export function AccessibilityStatus({ className = "", showDetails = false }: AccessibilityStatusProps) {
  const compliancePercentage = accessibilityCompliancePercentage();
  
  // Group criteria by WCAG principles
  const principles = {
    'Perceivable': ['textAlternatives', 'timeBasedMedia', 'adaptable', 'distinguishable'],
    'Operable': ['keyboardAccessible', 'enoughTime', 'seizures', 'navigable'],
    'Understandable': ['readable', 'predictable', 'inputAssistance'],
    'Robust': ['compatible']
  };
  
  return (
    <div className={className}>
      <Card className="p-4">
        <div className="flex flex-col items-center">
          <h2 id="accessibility-status" className="text-xl font-semibold mb-2">Accessibility Compliance</h2>
          <div className="mb-4 relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle 
                className="text-gray-200" 
                strokeWidth="10" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-green-500 transition-all duration-1000 ease-in-out" 
                strokeWidth="10" 
                strokeDasharray={250.8} 
                strokeDashoffset={250.8 - (compliancePercentage / 100) * 250.8} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
            </svg>
            <span className="absolute text-3xl font-semibold">{compliancePercentage}%</span>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-green-500 font-semibold">
              ✓ WCAG 2.2 AA Compliant
            </span>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4">
            <h3 id="wcag-principles" className="text-lg font-medium mb-2">WCAG Principles</h3>
            
            {Object.entries(principles).map(([principle, criteriaKeys]) => (
              <div key={principle} className="mb-4">
                <h4 id={`principle-${principle.toLowerCase()}`} className="font-medium mb-1">{principle}</h4>
                <div className="space-y-2">
                  {criteriaKeys.map(key => {
                    const item = accessibilityImplementation[key as keyof typeof accessibilityImplementation];
                    return (
                      <div key={key} className="pl-4 border-l-2 border-gray-200">
                        <div className="flex items-start">
                          <span className={`mr-2 mt-0.5 flex-shrink-0 ${item.completed ? 'text-green-500' : 'text-yellow-500'}`} aria-hidden="true">
                            {item.completed ? '✓' : '⚠'}
                          </span>
                          <div>
                            <p className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.wcagCriteria}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}