/**
 * Accessibility Test Page Component
 * 
 * Allows users to run WCAG accessibility tests on websites
 * with comprehensive validation and secure processing.
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { validateForm, urlSchema } from '../utils/validation';
import { sanitizeText } from '../utils/sanitization';

// Test options schema
const testOptionsSchema = z.object({
  url: urlSchema,
  standard: z.enum(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21aa', 'wcag22aa']),
  includeWarnings: z.boolean().default(true),
  checkSubpages: z.boolean().default(false),
  maxPages: z.number().int().min(1).max(100).default(10),
  ignoreRules: z.string().default('')
});

type TestOptionsData = z.infer<typeof testOptionsSchema>;

/**
 * Accessibility Test Page Component
 */
function AccessibilityTestPage(): JSX.Element {
  // Form state
  const [testOptions, setTestOptions] = useState<TestOptionsData>({
    url: '',
    standard: 'wcag22aa',
    includeWarnings: true,
    checkSubpages: false,
    maxPages: 10,
    ignoreRules: ''
  });
  
  // Error and loading states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<any | null>(null);
  
  /**
   * Handle form input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : type === 'number'
        ? parseInt(value, 10)
        : value;
    
    setTestOptions(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError(null);
    }
    
    // Reset test state if URL changes
    if (name === 'url') {
      setTestStarted(false);
      setTestResults(null);
      setTestProgress(0);
    }
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset errors and test state
    setErrors({});
    setGeneralError(null);
    setTestStarted(false);
    setTestResults(null);
    setTestProgress(0);
    
    try {
      // Loading state
      setIsLoading(true);
      
      // Validate form data
      try {
        const validatedData = validateForm(testOptions, testOptionsSchema);
        
        // Start test
        setTestStarted(true);
        
        // Simulate test progress
        const progressInterval = setInterval(() => {
          setTestProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            return newProgress >= 100 ? 100 : newProgress;
          });
        }, 500);
        
        // Simulate test completion after 5 seconds
        setTimeout(() => {
          clearInterval(progressInterval);
          setTestProgress(100);
          
          // Set mock results
          setTestResults({
            url: validatedData.url,
            standard: validatedData.standard,
            timestamp: new Date().toISOString(),
            summary: {
              violations: 12,
              warnings: 8,
              passed: 47,
              total: 67
            },
            details: [
              {
                id: 'color-contrast',
                impact: 'serious',
                description: 'Elements must have sufficient color contrast',
                violations: 4
              },
              {
                id: 'aria-required-attr',
                impact: 'critical',
                description: 'Required ARIA attributes must be provided',
                violations: 2
              },
              {
                id: 'image-alt',
                impact: 'serious',
                description: 'Images must have alternate text',
                violations: 3
              },
              {
                id: 'keyboard-nav',
                impact: 'critical',
                description: 'Page must be navigable by keyboard',
                violations: 3
              }
            ]
          });
          
          setIsLoading(false);
        }, 5000);
      } catch (validationError: any) {
        // Set validation errors
        if (validationError.validationErrors) {
          setErrors(validationError.validationErrors);
        } else {
          setGeneralError(validationError.message || 'Validation failed. Please check your input.');
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      // Handle test error
      setGeneralError(error.message || 'Failed to start test. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Run Test</title>
        <meta name="description" content="Run accessibility tests on your website" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Accessibility Test</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              {/* Test form */}
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Run Accessibility Test
                </h2>
                
                <form onSubmit={handleSubmit} noValidate>
                  {/* General error message */}
                  {generalError && (
                    <div className="rounded-md bg-red-50 p-4 mb-4" role="alert">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {generalError}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* URL */}
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        Website URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        value={testOptions.url}
                        onChange={handleChange}
                        className={`mt-1 block w-full ${
                          errors.url ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="https://example.com"
                        aria-invalid={!!errors.url}
                        aria-describedby={errors.url ? 'url-error' : undefined}
                      />
                      {errors.url && (
                        <p className="mt-2 text-sm text-red-600" id="url-error">
                          {errors.url}
                        </p>
                      )}
                    </div>
                    
                    {/* WCAG Standard */}
                    <div>
                      <label htmlFor="standard" className="block text-sm font-medium text-gray-700">
                        WCAG Standard
                      </label>
                      <select
                        id="standard"
                        name="standard"
                        value={testOptions.standard}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="wcag2a">WCAG 2.0 Level A</option>
                        <option value="wcag2aa">WCAG 2.0 Level AA</option>
                        <option value="wcag2aaa">WCAG 2.0 Level AAA</option>
                        <option value="wcag21aa">WCAG 2.1 Level AA</option>
                        <option value="wcag22aa">WCAG 2.2 Level AA (Recommended)</option>
                      </select>
                    </div>
                    
                    {/* Test options */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="includeWarnings"
                            name="includeWarnings"
                            type="checkbox"
                            checked={testOptions.includeWarnings}
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="includeWarnings" className="font-medium text-gray-700">
                            Include warnings
                          </label>
                          <p className="text-gray-500">Include potential issues in the report.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="checkSubpages"
                            name="checkSubpages"
                            type="checkbox"
                            checked={testOptions.checkSubpages}
                            onChange={handleChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="checkSubpages" className="font-medium text-gray-700">
                            Check subpages
                          </label>
                          <p className="text-gray-500">Crawl and test linked pages.</p>
                        </div>
                      </div>
                      
                      {/* Max pages (only show if checkSubpages is true) */}
                      {testOptions.checkSubpages && (
                        <div className="pl-7">
                          <label htmlFor="maxPages" className="block text-sm font-medium text-gray-700">
                            Maximum pages to check
                          </label>
                          <input
                            type="number"
                            name="maxPages"
                            id="maxPages"
                            min="1"
                            max="100"
                            value={testOptions.maxPages}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      )}
                      
                      {/* Ignore rules */}
                      <div>
                        <label htmlFor="ignoreRules" className="block text-sm font-medium text-gray-700">
                          Ignore rules (comma-separated)
                        </label>
                        <textarea
                          id="ignoreRules"
                          name="ignoreRules"
                          rows={2}
                          value={testOptions.ignoreRules}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="color-contrast, aria-roles, etc."
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Optional: List specific rule IDs to exclude from the test.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      aria-busy={isLoading}
                    >
                      {isLoading ? 'Running Test...' : 'Run Test'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Test progress */}
              {testStarted && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Test Progress
                  </h2>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          {Math.round(testProgress)}% Complete
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {testProgress < 100 ? 'Testing...' : 'Complete'}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${testProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Test results */}
              {testResults && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Test Results
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">URL Tested</h3>
                    <p className="text-base font-medium text-gray-900 break-all">
                      {sanitizeText(testResults.url)}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Summary</h3>
                    <div className="grid grid-cols-4 gap-4 sm:gap-6">
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-red-700">{testResults.summary.violations}</span>
                        <p className="text-sm text-red-600">Violations</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-yellow-700">{testResults.summary.warnings}</span>
                        <p className="text-sm text-yellow-600">Warnings</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-green-700">{testResults.summary.passed}</span>
                        <p className="text-sm text-green-600">Passed</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <span className="text-2xl font-bold text-gray-700">{testResults.summary.total}</span>
                        <p className="text-sm text-gray-600">Total Tests</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Top Issues</h3>
                    <div className="border rounded-md divide-y divide-gray-200">
                      {testResults.details.map((issue: any) => (
                        <div key={issue.id} className="p-4">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 ${
                              issue.impact === 'critical' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{issue.id}</h4>
                              <p className="mt-1 text-sm text-gray-600">{issue.description}</p>
                              <div className="mt-2 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  issue.impact === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {issue.impact}
                                </span>
                                <span className="ml-2 text-gray-500">{issue.violations} occurrences</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => console.log('Generate PDF report')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AccessibilityTestPage;