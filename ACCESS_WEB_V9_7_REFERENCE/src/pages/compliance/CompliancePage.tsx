
import { ComplianceDashboard } from '../../components/compliance/ComplianceDashboard';

export function CompliancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Compliance Monitoring
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Monitor and maintain compliance with accessibility standards
        </p>
      </div>

      <ComplianceDashboard />
    </div>
  );
}