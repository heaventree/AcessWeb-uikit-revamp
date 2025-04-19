import React, { useState, useEffect } from 'react';
import { Brain, Code, BookOpen, ExternalLink, Info, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { AccessibilityIssue } from '../types';
import { getAIRecommendations } from '../utils/aiRecommendations';

interface AIRecommendationsProps {
  issue: AccessibilityIssue;
}

interface AIRecommendation {
  explanation: string;
  suggestedFix: string;
  codeExample: string;
  additionalResources: string[];
}

const loadingMessages = [
  "Analyzing accessibility issue...",
  "Generating recommendations...",
  "Checking best practices...",
  "Preparing code examples...",
  "Finalizing suggestions...",
  "One moment, I'm just putting my thoughts together...",
  "Thinking cap is on... Almost there!",
  "Hold tight, I'm making sure this makes sense...",
  "Just connecting the dots—won't be long!",
  "Processing... Or as humans call it, thinking!",
  "I see what you're asking—let me shape this properly!",
  "One sec, I'm making sure this is as thorough as possible..."
];

export function AIRecommendations({ issue }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(() => 
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  // Dynamic loading message effect
  useEffect(() => {
    if (!loading) return;
    
    // Change message every 3-5 seconds to create a more dynamic loading experience
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, [loading]);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiRecommendations = await getAIRecommendations(issue);
      setRecommendations(aiRecommendations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate recommendations';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {!recommendations && !loading && (
        <button
          onClick={generateRecommendations}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Brain className="w-4 h-4 mr-2" />
          Get AI Suggestions
          <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-yellow-400 text-blue-800 rounded">PRO</span>
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{loadingMessage}</span>
        </div>
      )}

      {error && !recommendations && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {recommendations && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          {/* Explanation */}
          <div>
            <h4 className="flex items-center text-lg font-medium text-gray-900 mb-3">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              Issue Explanation
            </h4>
            <p className="text-gray-700">{recommendations.explanation}</p>
          </div>

          {/* Fix Suggestion */}
          <div>
            <h4 className="flex items-center text-lg font-medium text-gray-900 mb-3">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              Suggested Fix
            </h4>
            <p className="text-gray-700 mb-4">{recommendations.suggestedFix}</p>
            
            {recommendations.codeExample && (
              <div className="relative">
                <SyntaxHighlighter
                  language="html"
                  style={tomorrow}
                  className="rounded-lg text-sm"
                >
                  {recommendations.codeExample}
                </SyntaxHighlighter>
              </div>
            )}
          </div>

          {/* Additional Resources */}
          {recommendations.additionalResources?.length > 0 && (
            <div>
              <h4 className="flex items-center text-lg font-medium text-gray-900 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                Additional Resources
              </h4>
              <ul className="space-y-2">
                {recommendations.additionalResources.map((resource, index) => (
                  <li key={index} className="flex items-center text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WCAG Criteria */}
          {issue.wcagCriteria?.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Code className="w-4 h-4 mr-2" />
                WCAG Criteria: {issue.wcagCriteria.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}