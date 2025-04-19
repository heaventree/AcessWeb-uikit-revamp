import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: 999,
    description: 'Perfect for small websites and personal projects',
    features: [
      'Up to 5 pages per scan',
      'Weekly automated scans',
      'Basic accessibility reports',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    name: 'Professional',
    price: 2999,
    description: 'Ideal for growing businesses and agencies',
    features: [
      'Up to 25 pages per scan',
      'Daily automated scans',
      'Advanced accessibility reports',
      'Priority email support',
      'Custom badge styles',
      'API access',
      'Multiple team members'
    ],
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 9999,
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited pages per scan',
      'Real-time monitoring',
      'Custom scan schedules',
      'Dedicated support manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced analytics',
      'Multiple domains'
    ]
  }
];

export function PricingPlans() {
  const handleSubscribe = async (plan: Plan) => {
    try {
      // TODO: Replace with actual backend call once implemented
      alert('Backend implementation pending. Selected plan: ' + plan.name);
    } catch (error) {
      console.error('Error processing subscription:', error);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your accessibility testing needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.recommended ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                  Recommended
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                
                <div className="mt-6">
                  <p className="text-5xl font-bold text-gray-900">
                    ${(plan.price / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-600 mt-1">/month</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`mt-8 w-full flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                    plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Need a custom plan? <a href="#contact" className="text-blue-600 hover:text-blue-700">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}