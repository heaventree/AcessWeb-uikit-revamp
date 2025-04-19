import React from 'react';
import { WordPressSettings } from '../components/integrations/WordPressSettings';

export function WordPressIntegrationPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            WordPress Integration
          </h1>
          <p className="text-lg text-gray-600">
            Integrate accessibility testing directly into your WordPress site
          </p>
        </div>

        <WordPressSettings />
      </div>
    </div>
  );
}