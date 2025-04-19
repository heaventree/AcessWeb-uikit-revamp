import { Sparkles } from 'lucide-react';

interface SuggestedActionsProps {
  onSelect: (question: string) => void;
}

/**
 * Pre-defined questions that users can quickly select
 */
export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  const commonQuestions = [
    "What are the WCAG standards?",
    "How do I check color contrast?",
    "Tell me about keyboard navigation",
    "What is ARIA and when should I use it?"
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 mb-1 font-medium">Suggested questions:</p>
      
      <div className="space-y-2">
        {commonQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="w-full text-left p-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 group"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500 group-hover:text-blue-600" />
            <span className="text-gray-800">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}