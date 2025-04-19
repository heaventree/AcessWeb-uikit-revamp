/**
 * Report Detail Page Component
 * 
 * Displays detailed information about a specific accessibility report,
 * with issue categorization and remediation guidance.
 */

import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { sanitizeText } from '../utils/sanitization';

// Mock report data
const mockReportData = {
  id: '1',
  url: 'https://example.com',
  date: '2025-04-10T10:30:00Z',
  standard: 'WCAG 2.2 AA',
  summary: {
    violations: 12,
    warnings: 8,
    passed: 47,
    total: 67
  },
  issues: [
    {
      id: 'color-contrast',
      principle: 'Perceivable',
      guideline: '1.4.3',
      impact: 'serious',
      description: 'Elements must have sufficient color contrast',
      occurrences: [
        {
          element: 'button.nav-link',
          html: '<button class="nav-link">Products</button>',
          location: 'Header navigation',
          contrast: '2.5:1',
          requiredContrast: '4.5:1'
        },
        {
          element: 'p.footer-text',
          html: '<p class="footer-text">Copyright 2025</p>',
          location: 'Footer',
          contrast: '3.2:1',
          requiredContrast: '4.5:1'
        },
        {
          element: 'a.subtle-link',
          html: '<a href="/terms" class="subtle-link">Terms of Service</a>',
          location: 'Footer',
          contrast: '2.8:1',
          requiredContrast: '4.5:1'
        },
        {
          element: 'span.price-label',
          html: '<span class="price-label">Sale price</span>',
          location: 'Product grid',
          contrast: '3.5:1',
          requiredContrast: '4.5:1'
        }
      ],
      remediation: 'Ensure that text has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Use the WebAIM contrast checker to verify contrast ratios. Adjust text or background colors to meet these requirements.',
      resources: [
        {
          title: 'Understanding Success Criterion 1.4.3',
          url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'
        },
        {
          title: 'WebAIM Contrast Checker',
          url: 'https://webaim.org/resources/contrastchecker/'
        }
      ]
    },
    {
      id: 'aria-required-attr',
      principle: 'Robust',
      guideline: '4.1.2',
      impact: 'critical',
      description: 'Required ARIA attributes must be provided',
      occurrences: [
        {
          element: 'div[role="slider"]',
          html: '<div role="slider">Price Range</div>',
          location: 'Filter sidebar',
          missingAttributes: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow']
        },
        {
          element: 'div[role="progressbar"]',
          html: '<div role="progressbar" class="loading-indicator"></div>',
          location: 'Product loading section',
          missingAttributes: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow']
        }
      ],
      remediation: 'Add missing ARIA attributes to elements with ARIA roles that require them. For example, elements with role="slider" or role="progressbar" must have aria-valuemin, aria-valuemax, and aria-valuenow attributes.',
      resources: [
        {
          title: 'ARIA Slider Role',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role'
        },
        {
          title: 'ARIA Progressbar Role',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role'
        }
      ]
    },
    {
      id: 'image-alt',
      principle: 'Perceivable',
      guideline: '1.1.1',
      impact: 'serious',
      description: 'Images must have alternate text',
      occurrences: [
        {
          element: 'img.product-thumbnail',
          html: '<img src="/products/p1.jpg" class="product-thumbnail">',
          location: 'Product grid',
          type: 'Missing alt attribute'
        },
        {
          element: 'img.hero-image',
          html: '<img src="/hero.jpg" class="hero-image" alt="">',
          location: 'Hero section',
          type: 'Empty alt attribute'
        },
        {
          element: 'img.category-icon',
          html: '<img src="/icons/electronics.svg" class="category-icon">',
          location: 'Category navigation',
          type: 'Missing alt attribute'
        }
      ],
      remediation: 'Add descriptive alt text to all meaningful images. For decorative images, use alt="" to indicate the image should be skipped by screen readers. Ensure that the alt text describes the purpose of the image, not just what it looks like.',
      resources: [
        {
          title: 'Alt Text Decision Tree',
          url: 'https://www.w3.org/WAI/tutorials/images/decision-tree/'
        },
        {
          title: 'WebAIM: Alternative Text',
          url: 'https://webaim.org/techniques/alttext/'
        }
      ]
    }
  ],
  pages: [
    {
      url: 'https://example.com',
      violations: 12,
      warnings: 8
    },
    {
      url: 'https://example.com/products',
      violations: 7,
      warnings: 5
    },
    {
      url: 'https://example.com/contact',
      violations: 3,
      warnings: 2
    }
  ]
};

/**
 * Report Detail Page Component
 */
function ReportDetailPage(): JSX.Element {
  // Get report ID from URL
  const { reportId } = useParams<{ reportId: string }>();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'pages'>('overview');
  
  // State for active issue filter
  const [issueFilter, setIssueFilter] = useState<'all' | 'violations' | 'warnings'>('all');
  
  // Get report data (in a real app, we would fetch this from an API)
  const report = useMemo(() => mockReportData, []);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get issue severity class
  const getSeverityClass = (impact: string): string => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'serious':
        return 'bg-orange-100 text-orange-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>WCAG Accessibility Audit - Report Details</title>
        <meta name="description" content="Detailed accessibility test report" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  Report: {sanitizeText(report.url)}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(report.date)} • {report.standard}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                  to="/reports"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Reports
                </Link>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="px-4 sm:px-0">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'overview' | 'issues' | 'pages')}
              >
                <option value="overview">Overview</option>
                <option value="issues">Issues</option>
                <option value="pages">Pages</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    className={`${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`${
                      activeTab === 'issues'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                    onClick={() => setActiveTab('issues')}
                  >
                    Issues
                  </button>
                  <button
                    className={`${
                      activeTab === 'pages'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                    onClick={() => setActiveTab('pages')}
                  >
                    Pages
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="mt-6">
            {/* Overview tab */}
            {activeTab === 'overview' && (
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900">Summary</h2>
                    
                    {/* Summary stats */}
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                      <div className="bg-red-50 rounded-lg overflow-hidden shadow">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dt className="text-sm font-medium text-red-800 truncate">Violations</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-red-900">{report.summary.violations}</div>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg overflow-hidden shadow">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dt className="text-sm font-medium text-yellow-800 truncate">Warnings</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-yellow-900">{report.summary.warnings}</div>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg overflow-hidden shadow">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dt className="text-sm font-medium text-green-800 truncate">Passed</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-green-900">{report.summary.passed}</div>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg overflow-hidden shadow">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                              <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dt className="text-sm font-medium text-gray-800 truncate">Total Tests</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{report.summary.total}</div>
                              </dd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top issues */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900">Top Issues</h3>
                      <div className="mt-4">
                        <div className="flow-root">
                          <ul className="-my-5 divide-y divide-gray-200">
                            {report.issues.slice(0, 3).map(issue => (
                              <li key={issue.id} className="py-5">
                                <div className="relative focus-within:ring-2 focus-within:ring-blue-500">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    <button
                                      onClick={() => {
                                        setActiveTab('issues');
                                        setIssueFilter('all');
                                      }}
                                      className="hover:underline focus:outline-none text-left"
                                    >
                                      <span className="absolute inset-0" aria-hidden="true" />
                                      {issue.description}
                                    </button>
                                  </h4>
                                  <div className="mt-1 flex items-center">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(issue.impact)}`}>
                                      {issue.impact}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                      WCAG {issue.guideline} • {issue.occurrences.length} occurrences
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {issue.remediation}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => setActiveTab('issues')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View all issues
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Issues tab */}
            {activeTab === 'issues' && (
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {/* Issue filters */}
                    <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Issues</h2>
                      <div>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                          <button
                            type="button"
                            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                              issueFilter === 'all' ? 'bg-blue-50 text-blue-700 z-10' : 'bg-white text-gray-700'
                            } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                            onClick={() => setIssueFilter('all')}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              issueFilter === 'violations' ? 'bg-blue-50 text-blue-700 z-10' : 'bg-white text-gray-700'
                            } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                            onClick={() => setIssueFilter('violations')}
                          >
                            Violations
                          </button>
                          <button
                            type="button"
                            className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                              issueFilter === 'warnings' ? 'bg-blue-50 text-blue-700 z-10' : 'bg-white text-gray-700'
                            } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                            onClick={() => setIssueFilter('warnings')}
                          >
                            Warnings
                          </button>
                        </span>
                      </div>
                    </div>
                    
                    {/* Issues list */}
                    <div className="space-y-8">
                      {report.issues.map(issue => (
                        <div key={issue.id} className="overflow-hidden border rounded-lg">
                          <div className="px-4 py-5 sm:px-6 bg-gray-50">
                            <div className="flex flex-wrap items-center justify-between">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {issue.description}
                              </h3>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(issue.impact)}`}>
                                  {issue.impact}
                                </span>
                                <span className="ml-2">
                                  WCAG {issue.guideline} • {issue.principle}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Occurrences ({issue.occurrences.length})</h4>
                            <div className="space-y-4">
                              {issue.occurrences.map((occurrence, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-md p-4">
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-800 mb-1">Element: {occurrence.element}</p>
                                    <p className="text-gray-600 mb-1">Location: {occurrence.location}</p>
                                    <div className="bg-gray-100 rounded p-2 font-mono text-xs overflow-x-auto whitespace-pre">
                                      {occurrence.html}
                                    </div>
                                    {occurrence.contrast && (
                                      <p className="mt-2 text-gray-600">
                                        Contrast ratio: <span className="font-medium">{occurrence.contrast}</span> (required: {occurrence.requiredContrast})
                                      </p>
                                    )}
                                    {occurrence.missingAttributes && (
                                      <p className="mt-2 text-gray-600">
                                        Missing attributes: <span className="font-medium">{occurrence.missingAttributes.join(', ')}</span>
                                      </p>
                                    )}
                                    {occurrence.type && (
                                      <p className="mt-2 text-gray-600">
                                        Issue type: <span className="font-medium">{occurrence.type}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-900 mt-6 mb-2">Remediation</h4>
                            <p className="text-sm text-gray-600">{issue.remediation}</p>
                            
                            {issue.resources && issue.resources.length > 0 && (
                              <>
                                <h4 className="text-sm font-medium text-gray-900 mt-6 mb-2">Resources</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {issue.resources.map((resource, idx) => (
                                    <li key={idx} className="text-sm">
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-500"
                                      >
                                        {resource.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages tab */}
            {activeTab === 'pages' && (
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Pages Tested</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Violations
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Warnings
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {report.pages.map((page, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div className="max-w-xs truncate" title={sanitizeText(page.url)}>
                                  {sanitizeText(page.url)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  {page.violations}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {page.warnings}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default ReportDetailPage;