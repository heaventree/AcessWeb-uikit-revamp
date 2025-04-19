
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';

export function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Accessibility Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track and analyze your website's accessibility metrics
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}