import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SubscriptionOverview } from '../components/subscription/SubscriptionOverview';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';

export default function BillingPage() {
  const { invoices, loading: invoicesLoading, error: invoicesError, fetchInvoices } = useSubscription();
  const { user } = useAuth();
  
  const [showBillingPortal, setShowBillingPortal] = useState(false);
  
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);
  
  const handleManageSubscription = () => {
    setShowBillingPortal(true);
  };
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Billing & Subscription" 
        description="Manage your subscription and billing details"
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionOverview onManage={handleManageSubscription} />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Account Details</h3>
            </div>
            
            {user && (
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {invoicesLoading ? (
            <div className="px-4 py-16 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading invoice history...</p>
            </div>
          ) : invoicesError ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-red-500">{invoicesError}</p>
              <button
                onClick={() => fetchInvoices()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Try Again
              </button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="px-4 py-6 text-center border-t border-gray-200">
              <p className="text-sm text-gray-500">No invoices found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">
                            Invoice {invoice.number}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            from {new Date(invoice.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              ${invoice.amount} • {invoice.status}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0">
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {showBillingPortal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Manage Billing
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      You'll be redirected to our secure payment portal where you can:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      <li>Update your payment method</li>
                      <li>Change your subscription plan</li>
                      <li>Download past invoices</li>
                      <li>Update billing information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  // In a real application, we would redirect to the Stripe billing portal
                  console.log('Redirecting to billing portal...');
                  // In development mode, just close the modal
                  setShowBillingPortal(false);
                }}
              >
                Continue to Billing Portal
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowBillingPortal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}