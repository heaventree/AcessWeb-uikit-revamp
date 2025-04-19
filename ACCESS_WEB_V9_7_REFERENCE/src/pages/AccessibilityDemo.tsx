import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Button, 
  Progress,
  HeadingSection,
  SkipLink,
  AccessibilityStatus
} from '../components/ui';

export function AccessibilityDemo() {
  return (
    <>
      <SkipLink targetId="main-content" />
      
      <div className="container mx-auto py-8 px-4" id="main-content">
        <HeadingSection
          title="Accessibility Components Demo"
          description="This page demonstrates all the accessible UI components used in the WCAG 9.4 Audit Tool."
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AccessibilityStatus showDetails={true} />
          
          <div className="space-y-6">
            <Card title="Accessibility Features" subtitle="Important UI improvements">
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keyboard navigation with visible focus states</li>
                  <li>ARIA labels and relationships</li>
                  <li>Screen reader announcements</li>
                  <li>Proper heading hierarchy</li>
                  <li>Skip links for keyboard users</li>
                  <li>High contrast ratios</li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end">
                  <Button>Learn More</Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="space-y-4">
              <h2 id="buttons-section" className="text-xl font-semibold">Button Variants</h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <h3 id="button-states" className="text-lg font-medium mt-4">Button States</h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
                <Button isLoading loadingText="Saving...">Save</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 id="progress-section" className="text-xl font-semibold">Progress Indicators</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="progress-1" className="block mb-1 font-medium">Basic Progress (25%)</label>
                  <Progress id="progress-1" value={25} max={100} className="h-2" />
                </div>
                <div>
                  <label htmlFor="progress-2" className="block mb-1 font-medium">Styled Progress (50%)</label>
                  <Progress 
                    id="progress-2" 
                    value={50} 
                    max={100} 
                    className="h-4" 
                    barClassName="bg-green-500"
                    label="Project completion: 50%" 
                  />
                </div>
                <div>
                  <label htmlFor="progress-3" className="block mb-1 font-medium">Gradient Progress (75%)</label>
                  <Progress 
                    id="progress-3" 
                    value={75} 
                    max={100} 
                    className="h-3" 
                    style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div>
                <h3 className="font-medium">Simple Card</h3>
                <p className="text-sm text-gray-500">With header, content and footer</p>
              </div>
            </CardHeader>
            <CardContent>
              <p>This card demonstrates the composite card pattern with separate header, content, and footer sections.</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">Last updated: Today</p>
            </CardFooter>
          </Card>
          
          <Card
            title="Accessible Card"
            subtitle="With built-in ARIA support"
            bordered
          >
            <CardContent>
              <p>This card uses the simplified API with title and subtitle props, but generates proper ARIA attributes automatically.</p>
            </CardContent>
          </Card>
          
          <Card
            title="Interactive Card"
            subtitle="With keyboard support"
            onClick={() => alert('Card clicked!')}
            id="interactive-card"
          >
            <CardContent>
              <p>This card is interactive and can be activated via mouse or keyboard. Try tabbing to it and pressing Enter or Space.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}