import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { useHelpCategories } from './useHelpCategories';

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { categories } = useHelpCategories();

  useEffect(() => {
    // Generate a session ID when component mounts
    setSessionId(uuidv4());

    // Retrieve previous chat history from localStorage if exists
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved chat messages:', error);
        // Reset if parsing fails
        localStorage.removeItem('chatMessages');
      }
    }

    // Clean up old sessions (older than 30 days)
    const cleanupSessions = () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('chatSession_')) {
          try {
            const session = JSON.parse(localStorage.getItem(key) || '');
            const sessionDate = new Date(session.updatedAt);
            if (sessionDate < thirtyDaysAgo) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Invalid session, remove it
            localStorage.removeItem(key);
          }
        }
      });
    };
    
    cleanupSessions();
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      
      // Also save session
      localStorage.setItem(`chatSession_${sessionId}`, JSON.stringify({
        id: sessionId,
        messages,
        updatedAt: new Date().toISOString(),
        createdAt: messages[0]?.timestamp || new Date().toISOString()
      }));
    }
  }, [messages, sessionId]);

  // Log queries for analysis
  const logQuery = useCallback((query: string, response: string) => {
    const queryLog = {
      id: uuidv4(),
      query,
      response,
      timestamp: new Date().toISOString(),
      sessionId
    };
    
    // Get existing logs or initialize empty array
    const existingLogs = JSON.parse(localStorage.getItem('chatQueryLogs') || '[]');
    const updatedLogs = [...existingLogs, queryLog];
    
    // Store only the last 1000 queries to prevent localStorage overflow
    if (updatedLogs.length > 1000) {
      updatedLogs.splice(0, updatedLogs.length - 1000);
    }
    
    localStorage.setItem('chatQueryLogs', JSON.stringify(updatedLogs));
    
    // In a real implementation, this would send the log to the server
    // api.logChatQuery(queryLog).catch(error => console.error('Failed to log chat query:', error));
  }, [sessionId]);

  // Simple content-based response system
  // In a real implementation, this would be replaced with an actual API call
  const getResponse = useCallback((query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedQuery = query.toLowerCase();
        
        // Check if we have any help categories that match the query
        let bestMatchContent = '';
        let bestMatchScore = 0;
        
        // Look through all categories and their articles for content that matches the query
        categories?.forEach(category => {
          const categoryRelevance = normalizedQuery.includes(category.name.toLowerCase()) ? 0.5 : 0;
          
          if (categoryRelevance > 0 && categoryRelevance > bestMatchScore) {
            bestMatchContent = `I can help you with ${category.name}. What specific information are you looking for?`;
            bestMatchScore = categoryRelevance;
          }
          
          // We'd check article content here in a real implementation
          // For now, just check titles for simplicity
          category.articles.forEach(article => {
            const titleWords = article.title.toLowerCase().split(' ');
            const queryWords = normalizedQuery.split(' ');
            
            // Calculate word overlap
            const overlap = titleWords.filter(word => queryWords.includes(word)).length;
            const relevance = overlap / Math.max(titleWords.length, queryWords.length);
            
            if (relevance > 0.3 && relevance > bestMatchScore) {
              bestMatchContent = `You might find the article "${article.title}" helpful. You can find it in our Help Center under the ${category.name} category.`;
              bestMatchScore = relevance;
            }
          });
        });
        
        // Common WCAG related terms
        if (normalizedQuery.includes('wcag') || normalizedQuery.includes('accessibility')) {
          bestMatchContent = 'WCAG (Web Content Accessibility Guidelines) are standards for making web content more accessible. Our platform helps you meet these standards.';
          bestMatchScore = 0.8;
        }
        
        if (normalizedQuery.includes('contrast') || normalizedQuery.includes('color')) {
          bestMatchContent = 'Color contrast is important for accessibility. WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.';
          bestMatchScore = 0.8;
        }
        
        if (normalizedQuery.includes('alt text') || normalizedQuery.includes('image')) {
          bestMatchContent = 'All images should have appropriate alt text that describes the content and function of the image for screen reader users.';
          bestMatchScore = 0.8;
        }
        
        // Fallback response if no match found
        if (bestMatchScore === 0) {
          bestMatchContent = "I'm not sure I understand your question. Could you please provide more details or try asking in a different way?";
        }
        
        resolve(bestMatchContent);
      }, 1000); // Simulate network delay
    });
  }, [categories]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get bot response
      const responseContent = await getResponse(content);
      
      // Add bot message
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Log the query and response for analysis
      logQuery(content, responseContent);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [getResponse, logQuery]);

  return {
    messages,
    sendMessage,
    isLoading
  };
}