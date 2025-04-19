import { OpenAI } from 'openai';
import type { AccessibilityIssue } from '../types';
import { getWCAGInfo } from './wcagHelper';

const API_KEY_ERROR = 'OpenAI API key not configured or invalid';
const RATE_LIMIT_ERROR = 'Too many requests. Please try again later.';
const TIMEOUT_ERROR = 'Request timed out. Please try again.';

// Use environment variable for the API key
// If process.env is not available in Vite, fallback to import.meta.env
const OPENAI_API_KEY = typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY 
  ? process.env.OPENAI_API_KEY 
  : import.meta.env.VITE_OPENAI_API_KEY;

interface AIRecommendation {
  explanation: string;
  suggestedFix: string;
  codeExample: string;
  additionalResources: string[];
}

export async function getAIRecommendations(issue: AccessibilityIssue): Promise<AIRecommendation> {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY.trim() === '') {
      console.error(API_KEY_ERROR);
      return getFallbackRecommendation(issue);
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const prompt = `
      Analyze this accessibility issue and provide:
      1. Brief explanation of why this is an issue
      2. Specific steps to fix it
      3. Code example showing the fix
      4. Any relevant WCAG success criteria

      Issue Details:
      - Description: ${issue.description}
      - Impact: ${issue.impact}
      - WCAG Criteria: ${issue.wcagCriteria.join(', ')}
      - HTML: ${issue.nodes.join('\n')}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a WCAG expert. Provide practical accessibility fixes with code examples."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content generated');
    }

    const response = completion.choices[0].message.content;
    const parsedResponse = parseAIResponse(response);

    return {
      explanation: parsedResponse.explanation || 'No explanation available.',
      suggestedFix: parsedResponse.suggestedFix || 'No fix suggestion available.',
      codeExample: parsedResponse.codeExample || '',
      additionalResources: parsedResponse.additionalResources.length > 0 
        ? parsedResponse.additionalResources 
        : [issue.helpUrl || 'https://www.w3.org/WAI/WCAG21/quickref/']
    };
  } catch (error: any) {
    console.error('AI Recommendations Error:', error);

    // Handle specific error types
    let errorMessage;
    
    // Extract the OpenAI error code if available
    const openaiError = error.error || error;
    const errorCode = openaiError.code || '';
    
    switch (errorCode) {
      case 'insufficient_quota':
        errorMessage = 'API quota exceeded';
        break;
      case 'context_length_exceeded':
        errorMessage = 'Issue description too long for analysis';
        break;
      case 'invalid_api_key':
        errorMessage = API_KEY_ERROR;
        break;
      case 'rate_limit_exceeded':
        errorMessage = RATE_LIMIT_ERROR;
        break;
      case 'timeout':
        errorMessage = TIMEOUT_ERROR;
        break;
      default:
        // Check for other common error patterns in the error object or message
        if (error.status === 401 || (error.message && error.message.includes('API key'))) {
          errorMessage = API_KEY_ERROR;
        } else if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
          errorMessage = RATE_LIMIT_ERROR;
        } else if (error.status === 504 || (error.message && error.message.includes('timeout'))) {
          errorMessage = TIMEOUT_ERROR;
        } else {
          errorMessage = 'Unable to generate AI recommendations';
        }
    }

    console.error('AI Recommendations Error:', errorMessage);
    return getFallbackRecommendation(issue);
  }
}

function getFallbackRecommendation(issue: AccessibilityIssue): AIRecommendation {
  // Get WCAG info as fallback
  const wcagInfo = getWCAGInfo(issue.id);
  
  return {
    explanation: wcagInfo?.description || 'Please refer to WCAG documentation for details.',
    suggestedFix: wcagInfo?.suggestedFix || 'Review WCAG guidelines for proper implementation.',
    codeExample: wcagInfo?.codeExample || '',
    additionalResources: [
      issue.helpUrl || 'https://www.w3.org/WAI/WCAG21/quickref/',
      'https://www.w3.org/WAI/tips/',
      'https://www.w3.org/WAI/WCAG21/Understanding/'
    ]
  };
}

function parseAIResponse(markdown: string): AIRecommendation {
  // We'll use a more direct approach to parse the response rather than using DOM
  // This avoids issues with marked returning a Promise in some environments

  const sections = {
    explanation: '',
    suggestedFix: '',
    codeExample: '',
    additionalResources: [] as string[]
  };

  let currentSection = '';
  let inCodeBlock = false;

  // Process each line of the response
  markdown.split('\n').forEach(line => {
    const trimmedLine = line.trim();

    // Check for section headers
    if (trimmedLine.match(/^#+\s/)) {
      currentSection = determineSection(trimmedLine);
      return;
    }

    // Check for numbered list items
    if (trimmedLine.match(/^\d+\./)) {
      currentSection = determineSection(trimmedLine);
      return;
    }

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        currentSection = 'codeExample';
      }
      return;
    }

    // Add content to appropriate section
    if (currentSection && trimmedLine) {
      if (currentSection === 'additionalResources') {
        const urls = trimmedLine.match(/https?:\/\/[^\s)]+/g);
        if (urls && Array.isArray(urls)) {
          sections.additionalResources = [...sections.additionalResources, ...urls];
        }
      } else if (currentSection === 'codeExample' && inCodeBlock) {
        sections.codeExample += trimmedLine + '\n';
      } else if (currentSection === 'explanation') {
        sections.explanation += (sections.explanation ? '\n' : '') + trimmedLine;
      } else if (currentSection === 'suggestedFix') {
        sections.suggestedFix += (sections.suggestedFix ? '\n' : '') + trimmedLine;
      }
    }
  });

  return {
    explanation: sections.explanation.trim(),
    suggestedFix: sections.suggestedFix.trim(),
    codeExample: sections.codeExample.trim(),
    additionalResources: sections.additionalResources
  };
}

function determineSection(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('explanation') || lowerText.includes('why') || lowerText.includes('issue')) {
    return 'explanation';
  }
  if (lowerText.includes('fix') || lowerText.includes('solution') || lowerText.includes('steps')) {
    return 'suggestedFix';
  }
  if (lowerText.includes('code') || lowerText.includes('example')) {
    return 'codeExample';
  }
  if (lowerText.includes('resource') || lowerText.includes('reference') || lowerText.includes('url')) {
    return 'additionalResources';
  }
  return '';
}