import { useFloatingTools } from '../contexts/FloatingToolsContext';
import { MessageSquare, EyeOff } from 'lucide-react';

/**
 * A compact toggle component for enabling/disabling the feedback system
 */
export function FeedbackToggle() {
  const { isFeedbackEnabled, toggleFeedbackSystem } = useFloatingTools();

  return (
    <button
      onClick={toggleFeedbackSystem}
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors ${
        isFeedbackEnabled 
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={isFeedbackEnabled ? 'Disable feedback system' : 'Enable feedback system'}
    >
      {isFeedbackEnabled ? (
        <MessageSquare className="h-3.5 w-3.5" />
      ) : (
        <EyeOff className="h-3.5 w-3.5" />
      )}
    </button>
  );
}