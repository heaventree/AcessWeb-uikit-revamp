import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface SubscriptionStatusProps {
  status: 'active' | 'inactive' | 'past_due' | 'cancelled';
}

export function SubscriptionStatus({ status }: SubscriptionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          text: 'Active'
        };
      case 'past_due':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          text: 'Past Due'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          text: 'Cancelled'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          text: 'Inactive'
        };
    }
  };

  const { icon: Icon, color, bg, text } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${bg} ${color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </span>
  );
}