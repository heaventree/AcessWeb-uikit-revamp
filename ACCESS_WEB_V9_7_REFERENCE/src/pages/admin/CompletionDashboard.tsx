
import { Card } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';
import { Progress } from '../../components/ui/Progress';

// Type definitions for our completion data
interface CategoryCompletion {
  name: string;
  percentage: number;
  color: string;
}

interface FeatureStatus {
  name: string;
  percentage: number;
  status: 'completed' | 'in-progress' | 'not-started' | 'critical';
}

// Data for the completion charts
const categoryCompletions: CategoryCompletion[] = [
  { name: 'Accessibility Compliance', percentage: 85, color: '#ef4444' }, // Increased with Media Accessibility
  { name: 'Core Features', percentage: 78, color: '#4ade80' }, // Slight increase
  { name: 'UI/UX Implementation', percentage: 85, color: '#3b82f6' },
  { name: 'Backend Systems', percentage: 70, color: '#f97316' },
  { name: 'Integrations', percentage: 60, color: '#8b5cf6' },
  { name: 'Documentation', percentage: 78, color: '#14b8a6' }, // Slight increase
  { name: 'Testing & Bug Fixes', percentage: 70, color: '#f43f5e' }, // Increased with bug fixes
];

// Data for feature completion status
const featureCompletions: FeatureStatus[] = [
  { name: 'PDF Accessibility Testing', percentage: 100, status: 'completed' },
  { name: 'CORS Issues Resolution', percentage: 100, status: 'completed' },
  { name: 'Error Reporting & Logging', percentage: 100, status: 'completed' },
  { name: 'Code Quality Improvements', percentage: 100, status: 'completed' },
  { name: 'Article Content Enhancements', percentage: 100, status: 'completed' },
  { name: 'Section Identifiers System', percentage: 100, status: 'completed' },
  { name: 'Color Palette Generator', percentage: 100, status: 'completed' },
  { name: 'Feedback System', percentage: 100, status: 'completed' }, // Added as completed
  { name: 'Pricing Plans UI', percentage: 100, status: 'completed' }, // Added as completed
  { name: 'Demo Mode Implementation', percentage: 90, status: 'in-progress' }, // Added with high completion
  { name: 'User Authentication System', percentage: 85, status: 'in-progress' }, // Increased progress
  { name: 'Payment Processing', percentage: 80, status: 'in-progress' }, // Increased progress
  { name: 'External Integration Security', percentage: 60, status: 'in-progress' }, // Increased progress
  { name: 'Media Accessibility Testing', percentage: 100, status: 'completed' }, // Completed feature
  { name: 'Accessibility Compliance - WCAG 2.2', percentage: 85, status: 'in-progress' }, // Increased progress
  { name: 'Admin Dashboard Stats', percentage: 70, status: 'in-progress' }, // Increased progress
  { name: 'Monitoring System', percentage: 50, status: 'in-progress' }, // Increased progress
  { name: 'Subscription System', percentage: 70, status: 'in-progress' }, // Improved from critical to in-progress
  { name: 'Usage Alerts System', percentage: 30, status: 'critical' }, // Increased progress but still critical
  { name: 'Integration Pages Design', percentage: 80, status: 'in-progress' }, // Increased progress
  { name: 'Database Migrations', percentage: 40, status: 'critical' }, // Increased progress but still critical
  { name: 'Policy Management', percentage: 50, status: 'in-progress' }, // Improved from critical to in-progress
  { name: 'Voice-guided Walkthrough', percentage: 0, status: 'not-started' },
  { name: 'WCAG Compliance Export', percentage: 100, status: 'completed' }, // Updated to completed
  { name: 'Custom CSS-Based Fixes', percentage: 10, status: 'in-progress' }, // Started work
];

// Critical issues list
const criticalIssues = [
  {
    title: 'Floating Tools Overlap',
    description: 'Multiple floating tools can open simultaneously instead of toggling correctly'
  },
  {
    title: 'Database Migration Issues',
    description: 'Some migrations still failing with column name errors and policy conflicts'
  },
  {
    title: 'Usage Alerts System',
    description: 'Critical notifications for usage limits not yet implemented'
  },
  {
    title: 'Mobile Device Testing',
    description: 'Application not fully tested on all mobile device sizes'
  },
  {
    title: 'Feedback System Persistence',
    description: 'Feedback markers not persisting after page navigation or refresh'
  }
];

export default function CompletionDashboard() {
  // Calculate overall project completion
  const overallCompletion = Math.round(
    categoryCompletions.reduce((sum, category) => sum + category.percentage, 0) / categoryCompletions.length
  );
  
  // Count features by status
  const completedCount = featureCompletions.filter(f => f.status === 'completed').length;
  const inProgressCount = featureCompletions.filter(f => f.status === 'in-progress').length;
  const criticalCount = featureCompletions.filter(f => f.status === 'critical').length;
  // const notStartedCount = featureCompletions.filter(f => f.status === 'not-started').length;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Project Completion Dashboard" 
        description="Track the overall progress and status of WCAG 9.4 Audit Tool development." 
        className="mb-8"
      />
      
      {/* Overall Completion */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">Overall Completion</h3>
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
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
                className="text-blue-600" 
                strokeWidth="10" 
                strokeDasharray={250.8} 
                strokeDashoffset={250.8 - (overallCompletion / 100) * 250.8} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
            </svg>
            <span className="absolute text-3xl font-semibold">{overallCompletion}%</span>
          </div>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-green-50">
          <div className="flex items-center mb-2">
            <div className="text-green-500 mr-2 text-xl" aria-hidden="true">✓</div>
            <h3 className="text-lg font-medium" id="completed-features">Completed</h3>
          </div>
          <p className="text-4xl font-bold text-green-600" aria-labelledby="completed-features">{completedCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-blue-50">
          <div className="flex items-center mb-2">
            <div className="text-blue-500 mr-2 text-xl" aria-hidden="true">⏱</div>
            <h3 className="text-lg font-medium" id="in-progress-features">In Progress</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600" aria-labelledby="in-progress-features">{inProgressCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-red-50">
          <div className="flex items-center mb-2">
            <div className="text-red-500 mr-2 text-xl" aria-hidden="true">⚠</div>
            <h3 className="text-lg font-medium" id="critical-features">Critical Issues</h3>
          </div>
          <p className="text-4xl font-bold text-red-600" aria-labelledby="critical-features">{criticalCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
      </div>
      
      {/* Category Completion */}
      <h2 className="text-xl font-semibold mb-4">Category Completion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {categoryCompletions.map((category, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{category.name}</h3>
              <span className="font-semibold">{category.percentage}%</span>
            </div>
            <Progress 
              value={category.percentage} 
              max={100} 
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              barClassName={`h-full rounded-full`}
              style={{ backgroundColor: category.color }}
            />
          </Card>
        ))}
      </div>
      
      {/* Feature Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Feature Status</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {featureCompletions
                .slice(0, Math.ceil(featureCompletions.length / 2))
                .map((feature, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {feature.status === 'completed' && <span className="text-green-500 mr-2">✓</span>}
                      {feature.status === 'in-progress' && <span className="text-blue-500 mr-2">⏱</span>}
                      {feature.status === 'critical' && <span className="text-red-500 mr-2">⚠</span>}
                      {feature.status === 'not-started' && <span className="text-gray-500 mr-2">□</span>}
                      <span className={
                        feature.status === 'critical' ? 'text-red-700' :
                        feature.status === 'completed' ? 'text-green-700' : ''
                      }>
                        {feature.name}
                      </span>
                    </div>
                    <span className="font-semibold">{feature.percentage}%</span>
                  </div>
                  <Progress 
                    value={feature.percentage} 
                    max={100} 
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    barClassName={`h-full rounded-full ${
                      feature.status === 'completed' ? 'bg-green-500' :
                      feature.status === 'in-progress' ? 'bg-blue-500' :
                      feature.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">&nbsp;</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {featureCompletions
                .slice(Math.ceil(featureCompletions.length / 2))
                .map((feature, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {feature.status === 'completed' && <span className="text-green-500 mr-2">✓</span>}
                      {feature.status === 'in-progress' && <span className="text-blue-500 mr-2">⏱</span>}
                      {feature.status === 'critical' && <span className="text-red-500 mr-2">⚠</span>}
                      {feature.status === 'not-started' && <span className="text-gray-500 mr-2">□</span>}
                      <span className={
                        feature.status === 'critical' ? 'text-red-700' :
                        feature.status === 'completed' ? 'text-green-700' : ''
                      }>
                        {feature.name}
                      </span>
                    </div>
                    <span className="font-semibold">{feature.percentage}%</span>
                  </div>
                  <Progress 
                    value={feature.percentage} 
                    max={100} 
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    barClassName={`h-full rounded-full ${
                      feature.status === 'completed' ? 'bg-green-500' :
                      feature.status === 'in-progress' ? 'bg-blue-500' :
                      feature.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Critical Issues */}
      <h2 className="text-xl font-semibold mb-4" id="critical-issues">Critical Issues</h2>
      <Card className="p-4 bg-red-50 mb-8 border-l-4 border-red-600" aria-labelledby="critical-issues">
        <div className="space-y-4">
          {criticalIssues.map((issue, index) => (
            <div key={index} className="border-b border-red-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start">
                <div className="text-red-500 mr-2 mt-1 flex-shrink-0" aria-hidden="true">⚠</div>
                <div>
                  <h3 className="font-medium text-red-700">{issue.title}</h3>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Next Steps */}
      <h2 className="text-xl font-semibold mb-4" id="recommendations">Recommendations</h2>
      <Card className="p-4 bg-blue-50 border-l-4 border-blue-600" aria-labelledby="recommendations">
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li className="font-bold text-red-800">
            <span className="mr-2">1.</span>
            <span>Fix floating tools context to prevent multiple tools from opening simultaneously</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">2.</span>
            <span>Implement persistent feedback markers that remain after page navigation</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">3.</span>
            <span>Complete demo mode functionality with smooth transitions</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">4.</span>
            <span>Implement status tracking for feedback comments</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">5.</span>
            <span>Improve mobile responsiveness of all components</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">6.</span>
            <span>Add automated accessibility testing for key components</span>
          </li>
        </ol>
      </Card>
    </div>
  );
}