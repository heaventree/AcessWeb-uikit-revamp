import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Button } from '../components/ui';
import { Bell, Info, AlertTriangle, Check, X, ArrowRight, RefreshCcw } from 'lucide-react';

/**
 * UI Demo page to showcase the Noble UI-inspired components and theme
 */
export function UiDemo() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Noble UI Component Demo
      </h1>

      {/* Card Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Card Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <Card
            title="Default Card"
            subtitle="With title and subtitle"
            icon={<Info className="w-5 h-5" />}
            action={<Button variant="ghost" size="sm">Action</Button>}
          >
            <p className="text-gray-700 dark:text-gray-200">
              This is a default card with header and footer.
              Cards are designed to match the Noble UI aesthetic.
            </p>
          </Card>

          {/* Primary Variant */}
          <Card
            title="Primary Variant"
            subtitle="With left border accent"
            variant="primary"
            hoverable
          >
            <p className="text-gray-700 dark:text-gray-200">
              This card uses the primary color as an accent on the left border.
              It also has a hover effect for interactive cards.
            </p>
          </Card>

          {/* Secondary Variant */}
          <Card
            title="Secondary Variant"
            subtitle="With compact padding"
            variant="secondary"
            compact
          >
            <p className="text-gray-700 dark:text-gray-200">
              This card uses the secondary color as an accent and has compact padding.
              Good for dense information display.
            </p>
          </Card>

          {/* Success Variant */}
          <Card
            variant="success"
            icon={<Check className="w-5 h-5" />}
            title="Success Card"
          >
            <p className="text-gray-700 dark:text-gray-200">
              Used to indicate successful operations or positive statuses.
            </p>
          </Card>

          {/* Warning Variant */}
          <Card
            variant="warning"
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Warning Card"
          >
            <p className="text-gray-700 dark:text-gray-200">
              Used to highlight potential issues that need attention.
            </p>
          </Card>

          {/* Error Variant */}
          <Card
            variant="error"
            icon={<X className="w-5 h-5" />}
            title="Error Card"
          >
            <p className="text-gray-700 dark:text-gray-200">
              Used to indicate errors or critical issues that need immediate attention.
            </p>
          </Card>

          {/* Card with Footer */}
          <Card
            title="Card with Footer"
            subtitle="Shows additional actions"
            bordered
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            }
          >
            <p className="text-gray-700 dark:text-gray-200">
              This card includes a footer with action buttons.
              Useful for forms or interactive content.
            </p>
          </Card>

          {/* Composite Card */}
          <Card bordered className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary-500" />
                <h3 className="text-lg font-semibold">Composite Card</h3>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Refresh</Button>
                <Button variant="outline" size="sm">Settings</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-200">
                This card uses the composite CardHeader, CardContent, and CardFooter
                components for more complex layouts.
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Today</span>
                <Button variant="link" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Button Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Button Components
        </h2>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Button Variants
          </h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="info">Info</Button>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Button Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Button States
          </h3>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary" disabled>Disabled</Button>
            <Button 
              variant="primary"
              isLoading={loading}
              onClick={handleLoadingDemo}
            >
              {loading ? 'Loading...' : 'Click to Load'}
            </Button>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Button with Icons
          </h3>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              leftIcon={<Check className="w-4 h-4" />}
            >
              Left Icon
            </Button>
            <Button 
              variant="secondary" 
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Right Icon
            </Button>
            <Button 
              variant="outline" 
              leftIcon={<RefreshCcw className="w-4 h-4" />}
              onClick={handleLoadingDemo}
              isLoading={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}