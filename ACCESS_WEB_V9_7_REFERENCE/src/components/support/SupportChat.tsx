import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Bot, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatbot } from '../../hooks/useChatbot';
import { FollowUpSuggestion } from '../../types/chat';
import { SuggestedActions } from './SuggestedActions';
import { MessageContent } from './MessageContent';
import { ResourceLinks } from './ResourceLinks';
import { FollowUpSuggestions } from './FollowUpSuggestions';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Get chatbot functionality
  const { 
    messages, 
    sendMessage, 
    isLoading
  } = useChatbot();
  
  // Dummy follow-up suggestions for demo
  const dummyFollowUps: FollowUpSuggestion[] = [
    { text: "How do I make forms accessible?", description: "Learn about accessible form controls" },
    { text: "Tell me about WCAG compliance levels", description: "A, AA, and AAA conformance explained" },
    { text: "What's new in WCAG 2.2?", description: "Latest accessibility guidelines" }
  ];
  
  // This is a simplified version without the advanced features
  // In a full implementation, these would come from useChatbot
  const selectFollowUpSuggestion = (suggestion: FollowUpSuggestion) => {
    sendMessage(suggestion.text);
  };
  
  // Show suggested actions when there are no messages or after greeting
  const showSuggestions = messages.length === 0 || 
    (messages.length === 2 && messages[0].role === 'user' && 
     (messages[0].content.toLowerCase().includes('hi') || 
      messages[0].content.toLowerCase().includes('hello')));

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Hide intro after first message
  useEffect(() => {
    if (messages.length > 0) {
      setShowIntro(false);
    }
  }, [messages.length]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Track opening in analytics (in real implementation)
    if (!isOpen) {
      console.log('[Chat Analytics] Chat opened');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle suggested question selection
  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };
  
  // Handle follow-up question selection
  const handleFollowUpSelection = (suggestion: FollowUpSuggestion) => {
    selectFollowUpSuggestion(suggestion);
  };

  return (
    <>
      {/* Chat toggle button - matching previous toolbar icon */}
      <motion.button
        aria-label={isOpen ? "Close accessibility support chat" : "Open accessibility support chat"}
        className="fixed bottom-[72px] right-5 z-40 p-0 bg-indigo-500 text-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 h-12 w-12 flex items-center justify-center"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircleQuestion className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-40 w-80 sm:w-96 h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200"
            role="dialog"
            aria-labelledby="chat-title"
          >
            {/* Chat header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5" />
                <h2 id="chat-title" className="font-semibold">Accessibility Support</h2>
              </div>
              <button
                onClick={toggleChat}
                aria-label="Close chat"
                className="text-white hover:text-blue-100 p-1 rounded-full hover:bg-blue-500/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {/* Welcome message when empty */}
              {messages.length === 0 ? (
                <div className="text-center my-8">
                  <div className="bg-blue-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-10 h-10 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Accessibility Assistant
                  </h3>
                  
                  <p className="text-gray-600 mb-6 max-w-xs mx-auto">
                    Hi! I'm here to help with your web accessibility questions and WCAG compliance needs.
                  </p>
                  
                  {/* Show suggested actions for empty chat */}
                  <SuggestedActions onSelect={handleSuggestedQuestion} />
                  
                  {showIntro && (
                    <div className="mt-6 text-xs text-gray-500">
                      <p>I can help with:</p>
                      <ul className="mt-1 space-y-1">
                        <li className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span>WCAG compliance questions</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span>Accessibility best practices</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span>Implementation guidance</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div key={index} className="space-y-2">
                      <div 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Bot avatar for assistant messages */}
                        {msg.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                            <Bot className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        
                        <div 
                          className={`max-w-[85%] rounded-lg p-3 ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <MessageContent 
                            content={msg.content}
                            isAssistant={msg.role === 'assistant'} 
                          />
                          
                          {/* Show resource links if available - Using dummy data for demo */}
                          {msg.role === 'assistant' && (
                            <ResourceLinks links={[
                              {
                                id: '1',
                                title: 'Color Contrast Guidelines',
                                url: '/resources/color-contrast',
                                description: 'WCAG requirements for accessible color contrast',
                                relevance: 95
                              },
                              {
                                id: '2',
                                title: 'Keyboard Navigation Best Practices',
                                url: '/resources/keyboard-navigation',
                                description: 'How to ensure your site is fully navigable via keyboard',
                                relevance: 85
                              }
                            ]} />
                          )}
                        </div>
                        
                        {/* User avatar for user messages */}
                        {msg.role === 'user' && (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Follow-up suggestions after assistant messages - Using dummy data for demo */}
                      {msg.role === 'assistant' && index === messages.length - 1 && (
                        <div className="ml-10">
                          <FollowUpSuggestions 
                            suggestions={dummyFollowUps} 
                            onSelect={handleFollowUpSelection}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Show suggestions after greeting */}
                  {showSuggestions && messages.length > 0 && (
                    <div className="ml-10">
                      <SuggestedActions onSelect={handleSuggestedQuestion} />
                    </div>
                  )}
                </>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="max-w-[85%] rounded-lg p-3 bg-white border border-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your accessibility question..."
                  className="flex-1 resize-none border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="p-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                <p>Ask any accessibility or WCAG compliance question</p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}