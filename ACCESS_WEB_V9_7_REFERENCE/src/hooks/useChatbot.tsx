import { useState, useCallback } from 'react';
import { Message } from '../types/chat';

/**
 * Hook for chatbot functionality
 * This is a simplified version for demonstration purposes
 */
export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Send a message to the chatbot
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate response based on input
    let responseContent = '';
    
    if (content.toLowerCase().includes('contrast')) {
      responseContent = `# Color Contrast Guidelines\n\nEnsuring sufficient color contrast is essential for accessibility. WCAG 2.1 requires a contrast ratio of:\n\n- **4.5:1** for normal text (AA)\n- **3:1** for large text (AA)\n- **7:1** for normal text (AAA)\n- **4.5:1** for large text (AAA)\n\nYou can use tools like the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify your color combinations.`;
    } 
    else if (content.toLowerCase().includes('keyboard')) {
      responseContent = `# Keyboard Navigation Best Practices\n\nMaking your site navigable via keyboard is a fundamental accessibility requirement. Here are key guidelines:\n\n- Ensure all interactive elements are focusable\n- Use logical tab order (matches visual order)\n- Provide visible focus indicators\n- Implement keyboard shortcuts for common actions\n- Avoid keyboard traps where focus cannot escape\n\nTest your site by unplugging your mouse and using only Tab, Shift+Tab, Enter, and arrow keys.`;
    }
    else if (content.toLowerCase().includes('wcag')) {
      responseContent = `# Web Content Accessibility Guidelines (WCAG)\n\nWCAG is developed by the W3C to provide a single shared standard for web content accessibility.\n\n## Current Versions:\n- WCAG 2.0 (2008)\n- WCAG 2.1 (2018)\n- WCAG 2.2 (2023)\n\n## Conformance Levels:\n- **Level A**: Minimum level (must satisfy)\n- **Level AA**: Mid-range level (should satisfy)\n- **Level AAA**: Highest level (may satisfy)\n\nMost organizations aim for WCAG 2.1 Level AA compliance as a baseline standard.`;
    }
    else if (content.toLowerCase().includes('aria')) {
      responseContent = `# ARIA (Accessible Rich Internet Applications)\n\nARIA is a set of attributes that define ways to make web content more accessible to people with disabilities.\n\n## Key principles:\n\n1. **Use native HTML elements whenever possible**\n2. **Only use ARIA when necessary**\n3. **Do not change native semantics**\n\nCommon ARIA attributes include:\n- role\n- aria-label\n- aria-labelledby\n- aria-describedby\n- aria-expanded\n- aria-hidden\n\nARIA doesn't change behavior - you must add JavaScript for interactive components.`;
    }
    else if (content.toLowerCase().includes('hi') || content.toLowerCase().includes('hello')) {
      responseContent = "Hello! I'm your accessibility assistant. How can I help you with WCAG compliance or accessibility questions today?";
    }
    else {
      responseContent = "I'm here to help with accessibility and WCAG compliance questions. Could you provide more specific details about what you'd like to know?";
    }
    
    // Add assistant response
    const assistantMessage: Message = {
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    
    // Log the interaction for analytics (in production this would save to a database)
    console.log('[Chat Analytics] New interaction:', {
      query: content,
      response: responseContent.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });
    
  }, []);

  return {
    messages,
    sendMessage,
    isLoading
  };
}