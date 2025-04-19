import { useState, useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';

interface PricingPlansProps {
  onSubscribe?: (planId: string) => void;
}

export function PricingPlans({ onSubscribe }: PricingPlansProps) {
  const { plans, loading, error, fetchPlans, createCheckoutSession } = useSubscription();
  const { isAuthenticated } = useAuth();
  
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly' | 'onetime'>('monthly');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  
  // Handle subscription
  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      // If using onSubscribe prop, call it
      if (onSubscribe) {
        onSubscribe(planId);
        return;
      }
      
      // Otherwise redirect to login page with plan ID
      window.location.href = `/login?redirect=/pricing&plan=${planId}`;
      return;
    }
    
    setIsProcessing(planId);
    setStatusMessage(null);
    
    try {
      const result = await createCheckoutSession(planId);
      if (result.success) {
        setStatusMessage('Redirecting to checkout...');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setStatusMessage('There was an error starting the checkout process. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pricing Plans</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Loading available subscription plans...
          </p>
        </div>
        
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white animate-pulse"
            >
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                
                <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                
                <div className="mt-8 space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex">
                      <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pricing Plans</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-red-500 sm:mt-4">
            {error}
          </p>
          <button
            onClick={() => fetchPlans()}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:flex-col sm:align-center">
        {/* Billing interval toggle */}
        <div className="relative mt-2 bg-gray-100 rounded-lg p-0.5 flex self-center">
          <button
            type="button"
            className={`relative py-2 px-6 border-0 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8 ${
              billingInterval === 'monthly'
                ? 'bg-white border-gray-200 shadow-sm text-gray-900'
                : 'bg-transparent text-gray-700'
            }`}
            onClick={() => setBillingInterval('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`relative py-2 px-6 border-0 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8 ${
              billingInterval === 'yearly'
                ? 'bg-white border-gray-200 shadow-sm text-gray-900'
                : 'bg-transparent text-gray-700'
            }`}
            onClick={() => setBillingInterval('yearly')}
          >
            Yearly <span className="text-blue-500 font-medium">(Save 15%)</span>
          </button>
          <button
            type="button"
            className={`relative py-2 px-6 border-0 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8 ${
              billingInterval === 'onetime'
                ? 'bg-white border-gray-200 shadow-sm text-gray-900'
                : 'bg-transparent text-gray-700'
            }`}
            onClick={() => setBillingInterval('onetime')}
          >
            One-time
          </button>
        </div>
      </div>
      
      {statusMessage && (
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="p-4 rounded-md bg-blue-50 text-blue-700">
            <p>{statusMessage}</p>
          </div>
        </div>
      )}
      
      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${
              plan.isPopular 
                ? 'border-blue-500 ring-2 ring-blue-500' 
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -mt-5 ml-6">
                <span className="bg-blue-500 text-white text-sm py-1 px-3 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingInterval === 'monthly' 
                      ? plan.priceMonthly 
                      : billingInterval === 'yearly'
                        ? plan.priceYearly
                        : plan.priceOnetime}
                </span>
                {billingInterval !== 'onetime' && (
                  <span className="text-base font-medium text-gray-500">
                    /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                  </span>
                )}
              </p>
              
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!isProcessing}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  plan.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                } ${isProcessing === plan.id ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isProcessing === plan.id ? 'Processing...' : 'Get Started'}
              </button>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  What's included:
                </h4>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto text-center text-sm text-gray-500">
        <p>
          All plans include access to our API, email support, and automatic updates.
          Need something custom? <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">Contact us</a> for enterprise pricing.
        </p>
      </div>
    </div>
  );
}