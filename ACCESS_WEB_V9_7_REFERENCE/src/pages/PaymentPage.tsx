import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PaymentFormWrapper } from '../components/PaymentForm';
import { createPaymentIntent } from '../utils/stripe';
import { ArrowLeft } from 'lucide-react';

const planDetails = {
  basic: {
    name: 'Basic Plan',
    price: 999,
    description: 'Perfect for small websites and personal projects'
  },
  pro: {
    name: 'Professional Plan',
    price: 2999,
    description: 'Ideal for growing businesses and agencies'
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 9999,
    description: 'For large organizations with complex needs'
  }
};

export function PaymentPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const plan = planId && planDetails[planId as keyof typeof planDetails];

  useEffect(() => {
    if (!plan) {
      navigate('/pricing');
      return;
    }

    async function initializePayment() {
      try {
        const { clientSecret } = await createPaymentIntent(plan.price);
        setClientSecret(clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    initializePayment();
  }, [plan, navigate]);

  const handlePaymentSuccess = () => {
    navigate('/dashboard');
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Pricing
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
            <p className="mt-2 text-blue-100">{plan.description}</p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
                  <p className="text-gray-600">Monthly subscription</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(plan.price / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : clientSecret && (
              <PaymentFormWrapper
                clientSecret={clientSecret}
                amount={plan.price}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}