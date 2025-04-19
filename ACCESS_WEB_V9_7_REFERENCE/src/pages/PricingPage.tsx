import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PricingPlans } from '../components/subscription/PricingPlans';
import { useAuth } from '../hooks/useAuth';

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto pt-[130px] px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Pricing Plans" 
        description="Choose the right plan for your accessibility needs"
        actions={
          !isAuthenticated && (
            <Link
              to="/login?redirect=/pricing" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </Link>
          )
        }
      />
      
      <div className="mt-8">
        <PricingPlans />
      </div>
      
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Can I change plans later?</h3>
            <p className="mt-2 text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately,
              and downgrades take effect at the end of your current billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">How do I cancel my subscription?</h3>
            <p className="mt-2 text-gray-600">
              You can cancel your subscription from your account settings. You'll continue to have access 
              until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Do you offer a free trial?</h3>
            <p className="mt-2 text-gray-600">
              We offer a 14-day free trial for all plans. No credit card required to start your trial.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
            <p className="mt-2 text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Is there a discount for non-profits?</h3>
            <p className="mt-2 text-gray-600">
              Yes, we offer special pricing for non-profit organizations. Please contact our support team
              for more information.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Can I use the tool on multiple websites?</h3>
            <p className="mt-2 text-gray-600">
              The number of websites you can scan depends on your plan. Basic plan includes 1 website,
              while Professional and Enterprise plans include multiple websites.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-blue-700 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to make your website accessible?</h2>
        <p className="mt-4 text-lg text-blue-100">
          Start your 14-day free trial today. No credit card required.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
          </Link>
        </div>
      </div>
    </div>
  );
}