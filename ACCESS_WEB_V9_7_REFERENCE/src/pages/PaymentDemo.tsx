import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { CreditCardInput, CreditCardData } from '../components/payment/CreditCardInput';
import { useDemoMode } from '../hooks/useDemoMode';

export default function PaymentDemo() {
  const [cardData, setCardData] = useState<CreditCardData | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isDemoMode } = useDemoMode();

  // Handle card data changes
  const handleCardDataChange = (isValid: boolean, data: CreditCardData) => {
    setIsFormValid(isValid);
    setCardData(data);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !cardData) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success state
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Payment Demo" 
        description="Test our interactive credit card validation system"
      />
      
      {isDemoMode && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">Demo Mode:</span> This is a demonstration of our credit card validation form. 
            Try entering card details and see real-time validation feedback.
          </p>
        </div>
      )}
      
      {isSuccess ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Payment successful!</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">
                Your payment has been processed successfully. You should receive a confirmation email shortly.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsSuccess(false)}
              >
                Try another payment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <CreditCardInput onChange={handleCardDataChange} />
          
          <div className="py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="border-t border-b border-gray-200 py-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Professional Plan - Monthly</span>
                <span>$99.00</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between pt-3">
              <span className="font-medium">Total</span>
              <span className="font-bold">$99.00</span>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${!isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
              ${isSubmitting ? 'opacity-75 cursor-wait' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Pay $99.00'
              )}
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>This is a demonstration. No actual payment will be processed.</p>
          </div>
        </form>
      )}
      
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Information</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Use the following test card numbers to trigger different validation states:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
            <li><span className="font-mono font-medium">4242 4242 4242 4242</span> - Valid Visa card</li>
            <li><span className="font-mono font-medium">5555 5555 5555 4444</span> - Valid Mastercard</li>
            <li><span className="font-mono font-medium">3782 822463 10005</span> - Valid American Express</li>
            <li><span className="font-mono font-medium">6011 1111 1111 1117</span> - Valid Discover card</li>
            <li><span className="font-mono font-medium">4000 0000 0000 0002</span> - Card declined</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            For other fields:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
            <li>Any name with at least 3 letters</li>
            <li>Any future date for expiry (MM/YY format)</li>
            <li>Any 3 digits for CVC (4 digits for American Express)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}