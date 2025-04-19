import { WordPressSetup } from '../../components/integrations/WordPressSetup';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function WordPressAPIPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          WordPress API Integration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Connect your WordPress site with our accessibility testing tools
        </p>
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to My Connections
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <WordPressSetup />
      </div>
    </div>
  );
}