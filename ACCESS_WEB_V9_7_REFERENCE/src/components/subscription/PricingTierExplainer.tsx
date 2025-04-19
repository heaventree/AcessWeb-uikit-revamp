import { useState, Fragment } from 'react';
import { Plan } from '../../hooks/useSubscription';

interface PricingTierExplainerProps {
  plans: Plan[];
  className?: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: {
    name: string;
    description: string;
    tiers: {
      [planId: string]: {
        included: boolean;
        value?: string;
        highlight?: boolean;
      };
    };
  }[];
}

// Predefined feature categories for our pricing tiers
const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'scanning',
    name: 'Accessibility Scanning',
    description: 'Core scanning capabilities for detecting WCAG compliance issues',
    features: [
      {
        name: 'Website scanning',
        description: 'The number of websites you can scan and monitor',
        tiers: {
          basic: { included: true, value: '1 website' },
          professional: { included: true, value: 'Up to 5 websites' },
          enterprise: { included: true, value: 'Unlimited websites', highlight: true }
        }
      },
      {
        name: 'Pages per scan',
        description: 'Maximum number of pages that can be scanned per website',
        tiers: {
          basic: { included: true, value: '100 pages' },
          professional: { included: true, value: '500 pages' },
          enterprise: { included: true, value: 'Unlimited pages', highlight: true }
        }
      },
      {
        name: 'Scan frequency',
        description: 'How often automated scans are performed',
        tiers: {
          basic: { included: true, value: 'Monthly' },
          professional: { included: true, value: 'Weekly' },
          enterprise: { included: true, value: 'Daily', highlight: true }
        }
      },
      {
        name: 'Manual scans',
        description: 'Number of manual scans you can initiate per month',
        tiers: {
          basic: { included: true, value: '5 scans/month' },
          professional: { included: true, value: '20 scans/month' },
          enterprise: { included: true, value: 'Unlimited', highlight: true }
        }
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Features',
    description: 'Features for ensuring and documenting WCAG compliance',
    features: [
      {
        name: 'WCAG 2.2 reports',
        description: 'Comprehensive reports on WCAG 2.2 compliance',
        tiers: {
          basic: { included: true, value: 'Basic reports' },
          professional: { included: true, value: 'Detailed reports' },
          enterprise: { included: true, value: 'Custom reports', highlight: true }
        }
      },
      {
        name: 'Export formats',
        description: 'Available report export formats',
        tiers: {
          basic: { included: true, value: 'PDF' },
          professional: { included: true, value: 'PDF, CSV, JSON' },
          enterprise: { included: true, value: 'All formats + custom', highlight: true }
        }
      },
      {
        name: 'Compliance certification',
        description: 'Official certification for WCAG compliance',
        tiers: {
          basic: { included: false },
          professional: { included: true, value: 'Basic certificate' },
          enterprise: { included: true, value: 'Premium certificate', highlight: true }
        }
      },
      {
        name: 'Historical tracking',
        description: 'Track compliance changes over time',
        tiers: {
          basic: { included: true, value: '30 days' },
          professional: { included: true, value: '1 year' },
          enterprise: { included: true, value: 'Unlimited', highlight: true }
        }
      }
    ]
  },
  {
    id: 'support',
    name: 'Support & Services',
    description: 'Expert assistance and advanced services',
    features: [
      {
        name: 'Customer support',
        description: 'Access to customer support services',
        tiers: {
          basic: { included: true, value: 'Email' },
          professional: { included: true, value: 'Email + Chat' },
          enterprise: { included: true, value: 'Email, Chat, Phone', highlight: true }
        }
      },
      {
        name: 'Response time',
        description: 'Guaranteed support response time',
        tiers: {
          basic: { included: true, value: '48 hours' },
          professional: { included: true, value: '24 hours' },
          enterprise: { included: true, value: '4 hours', highlight: true }
        }
      },
      {
        name: 'Dedicated manager',
        description: 'Assigned account manager',
        tiers: {
          basic: { included: false },
          professional: { included: false },
          enterprise: { included: true, highlight: true }
        }
      },
      {
        name: 'Training sessions',
        description: 'Personalized training on accessibility',
        tiers: {
          basic: { included: false },
          professional: { included: true, value: '1 session/quarter' },
          enterprise: { included: true, value: 'Unlimited', highlight: true }
        }
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Features',
    description: 'Enterprise-grade capabilities for complex websites',
    features: [
      {
        name: 'API access',
        description: 'Programmatic access to scanning and reporting',
        tiers: {
          basic: { included: false },
          professional: { included: true, value: 'Limited access' },
          enterprise: { included: true, value: 'Full access', highlight: true }
        }
      },
      {
        name: 'Custom integrations',
        description: 'Integration with your existing tools',
        tiers: {
          basic: { included: false },
          professional: { included: false },
          enterprise: { included: true, highlight: true }
        }
      },
      {
        name: 'Custom rules',
        description: 'Create custom accessibility rules',
        tiers: {
          basic: { included: false },
          professional: { included: false },
          enterprise: { included: true, highlight: true }
        }
      },
      {
        name: 'Team collaboration',
        description: 'Multi-user access and collaboration features',
        tiers: {
          basic: { included: true, value: '1 user' },
          professional: { included: true, value: 'Up to 5 users' },
          enterprise: { included: true, value: 'Unlimited users', highlight: true }
        }
      }
    ]
  }
];

export function PricingTierExplainer({ plans, className = '' }: PricingTierExplainerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(FEATURE_CATEGORIES[0].id);
  const [compareAll, setCompareAll] = useState<boolean>(false);
  
  // Find the currently active category
  const currentCategory = FEATURE_CATEGORIES.find(category => category.id === activeCategory) || FEATURE_CATEGORIES[0];
  
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Plan Comparison</h2>
          <button
            onClick={() => setCompareAll(!compareAll)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {compareAll ? 'Show Categories' : 'Compare All Features'}
          </button>
        </div>
        
        {!compareAll && (
          <div className="mt-4 border-b border-gray-200 pb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {FEATURE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {currentCategory.description}
            </p>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Feature
              </th>
              {plans.map((plan) => (
                <th 
                  key={plan.id} 
                  className={`py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    plan.isPopular ? 'bg-blue-50' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mb-2">
                      Most Popular
                    </span>
                  )}
                  <div className={plan.isPopular ? 'text-blue-800' : ''}>
                    {plan.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {compareAll ? (
              // Show all categories when "Compare All" is selected
              FEATURE_CATEGORIES.map((category) => (
                <Fragment key={category.id}>
                  <tr className="bg-gray-50">
                    <td 
                      colSpan={plans.length + 1} 
                      className="py-3 px-6 text-sm font-semibold text-gray-900"
                    >
                      {category.name}
                    </td>
                  </tr>
                  {category.features.map((feature, featureIdx) => (
                    <tr 
                      key={`${category.id}-${featureIdx}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 align-top">
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{feature.description}</div>
                      </td>
                      {plans.map((plan) => {
                        const tierInfo = feature.tiers[plan.id];
                        return (
                          <td 
                            key={`${category.id}-${featureIdx}-${plan.id}`} 
                            className={`py-4 px-6 text-sm text-center ${
                              plan.isPopular ? 'bg-blue-50' : ''
                            }`}
                          >
                            {tierInfo.included ? (
                              <>
                                <span 
                                  className={`inline-flex justify-center items-center h-5 w-5 rounded-full bg-green-100 text-green-800 mb-1`}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-3 w-3" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                </span>
                                {tierInfo.value && (
                                  <div 
                                    className={`${
                                      tierInfo.highlight 
                                        ? 'font-medium text-green-800' 
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {tierInfo.value}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="inline-block h-5 w-5 text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))
            ) : (
              // Show only the active category
              currentCategory.features.map((feature, featureIdx) => (
                <tr 
                  key={`${currentCategory.id}-${featureIdx}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-5 px-6 text-sm text-gray-900">
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{feature.description}</div>
                  </td>
                  {plans.map((plan) => {
                    const tierInfo = feature.tiers[plan.id];
                    return (
                      <td 
                        key={`${currentCategory.id}-${featureIdx}-${plan.id}`} 
                        className={`py-5 px-6 text-sm text-center ${
                          plan.isPopular ? 'bg-blue-50' : ''
                        }`}
                      >
                        {tierInfo.included ? (
                          <>
                            <span 
                              className={`inline-flex justify-center items-center h-5 w-5 rounded-full bg-green-100 text-green-800 mb-1`}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-3 w-3" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </span>
                            {tierInfo.value && (
                              <div 
                                className={`${
                                  tierInfo.highlight 
                                    ? 'font-medium text-green-800' 
                                    : 'text-gray-900'
                                }`}
                              >
                                {tierInfo.value}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="inline-block h-5 w-5 text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`text-center p-4 rounded-lg ${
                plan.isPopular 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`text-lg font-medium ${plan.isPopular ? 'text-blue-800' : 'text-gray-900'}`}>
                {plan.name}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">${plan.priceMonthly}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <button 
                className={`mt-4 inline-block rounded-md py-2 px-4 text-sm font-medium ${
                  plan.isPopular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}