import { Lightbulb, ChevronRight } from 'lucide-react';
import { FollowUpSuggestion } from '../../types/chat';

interface FollowUpSuggestionsProps {
  suggestions: FollowUpSuggestion[];
  onSelect: (suggestion: FollowUpSuggestion) => void;
}

/**
 * Displays follow-up suggestions for continuing the conversation
 */
export function FollowUpSuggestions({ suggestions, onSelect }: FollowUpSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-1">
        <Lightbulb className="h-3 w-3 text-amber-500" />
        <span>Follow-up questions:</span>
      </p>
      
      <div className="space-y-1.5">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left py-1.5 px-2.5 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between group"
          >
            <div className="flex-1">
              <span className="text-gray-800 font-medium">{suggestion.text}</span>
              {suggestion.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{suggestion.description}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-1 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}