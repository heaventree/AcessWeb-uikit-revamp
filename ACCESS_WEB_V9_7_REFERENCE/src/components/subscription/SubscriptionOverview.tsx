import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription, Subscription } from '../../hooks/useSubscription';

interface SubscriptionOverviewProps {
  onManage?: () => void;
}

export function SubscriptionOverview({ onManage }: SubscriptionOverviewProps) {
  const { 
    subscription, 
    loading, 
    error,
    fetchCurrentSubscription,
    cancelSubscription,
    reactivateSubscription
  } = useSubscription();
  
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  // Fetch subscription data on mount
  useEffect(() => {
    fetchCurrentSubscription();
  }, [fetchCurrentSubscription]);
  
  // Cancel current subscription
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }
    
    setIsLoading(true);
    setActionMessage(null);
    
    try {
      const result = await cancelSubscription();
      if (result.success) {
        setActionMessage('Your subscription has been cancelled. You will still have access until the end of your billing period.');
      }
    } catch (error) {
      setActionMessage('Error cancelling subscription. Please try again later.');
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reactivate cancelled subscription
  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    setActionMessage(null);
    
    try {
      const result = await reactivateSubscription();
      if (result.success) {
        setActionMessage('Your subscription has been reactivated.');
      }
    } catch (error) {
      setActionMessage('Error reactivating subscription. Please try again later.');
      console.error('Error reactivating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4 mt-4"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-red-600">Error Loading Subscription</h3>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => fetchCurrentSubscription()}
          className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!subscription) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">No Active Subscription</h3>
        <p className="text-gray-600 mb-4">
          You don't have an active subscription. Upgrade to a premium plan to access all features.
        </p>
        <Link 
          to="/pricing" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          View Plans
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Your Subscription</h3>
          <div className="mt-2 flex items-center">
            <span className="font-medium text-gray-800">{subscription.planName}</span>
            <StatusBadge status={subscription.status} />
          </div>
        </div>
        
        {onManage && (
          <button
            onClick={onManage}
            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            disabled={isLoading}
          >
            Manage Subscription
          </button>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Current period</div>
          <div className="font-medium">
            {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
          </div>
        </div>
        
        {subscription.paymentMethod && (
          <div>
            <div className="text-sm text-gray-500">Payment method</div>
            <div className="font-medium capitalize">
              {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
            </div>
          </div>
        )}
      </div>
      
      {subscription.cancelAtPeriodEnd && (
        <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md">
          <p className="text-sm">
            Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You can 
            reactivate your subscription before this date to continue your service.
          </p>
          
          <button
            onClick={handleReactivateSubscription}
            className="mt-2 px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 rounded transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Reactivate Subscription'}
          </button>
        </div>
      )}
      
      {actionMessage && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p className="text-sm">{actionMessage}</p>
        </div>
      )}
      
      {!subscription.cancelAtPeriodEnd && (
        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleCancelSubscription}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Cancel Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper components and functions
function StatusBadge({ status }: { status: Subscription['status'] }) {
  let color: string;
  let label: string;
  
  switch (status) {
    case 'active':
      color = 'bg-green-100 text-green-800';
      label = 'Active';
      break;
    case 'trialing':
      color = 'bg-blue-100 text-blue-800';
      label = 'Trial';
      break;
    case 'past_due':
      color = 'bg-amber-100 text-amber-800';
      label = 'Past Due';
      break;
    case 'canceled':
      color = 'bg-gray-100 text-gray-800';
      label = 'Canceled';
      break;
    case 'unpaid':
      color = 'bg-red-100 text-red-800';
      label = 'Unpaid';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      label = status;
  }
  
  return (
    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${color}`}>
      {label}
    </span>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}