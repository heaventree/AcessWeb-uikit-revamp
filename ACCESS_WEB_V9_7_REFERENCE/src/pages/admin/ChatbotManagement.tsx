import React, { useState, useEffect } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { ChatStatistics, TrainingTopic } from '../../types/chat';
import { ChatAnalytics } from '../../components/support/ChatAnalytics';
import { useChatbot } from '../../hooks/useChatbot';
import { scanWebsiteContent, getLatestAuditResults } from '../../services/chatbotContentAudit';

export function ChatbotManagement() {
  const { settings, updateSettings, clearHistory } = useChatbot();
  
  // Content Audit State
  const [scanning, setScanning] = useState(false);
  const [auditResults, setAuditResults] = useState(getLatestAuditResults());
  
  // Analytics State (in a real app, these would come from an API)
  const [stats, setStats] = useState<ChatStatistics>({
    totalSessions: 487,
    totalMessages: 2893,
    averageSessionLength: 6.2,
    averageResponseTime: 0.8,
    userSatisfactionScore: 4.3,
    commonTopics: [
      { topic: 'WCAG Compliance', count: 98 },
      { topic: 'Color Contrast', count: 76 },
      { topic: 'Screen Readers', count: 53 },
      { topic: 'Keyboard Navigation', count: 47 },
      { topic: 'Form Accessibility', count: 42 },
    ],
    dailyActivity: [
      { date: '2025-03-28', sessions: 21 },
      { date: '2025-03-29', sessions: 18 },
      { date: '2025-03-30', sessions: 24 },
      { date: '2025-03-31', sessions: 29 },
      { date: '2025-04-01', sessions: 34 },
      { date: '2025-04-02', sessions: 32 },
      { date: '2025-04-03', sessions: 28 },
      { date: '2025-04-04', sessions: 27 },
    ],
  });
  
  // Training Data State (in a real app, this would come from an API)
  const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>([
    {
      id: '1',
      name: 'WCAG Compliance',
      examples: [
        'What is WCAG compliance?',
        'How do I make my site WCAG compliant?',
        'What are the WCAG levels?'
      ],
      responses: [
        'WCAG (Web Content Accessibility Guidelines) are developed through the W3C process in cooperation with individuals and organizations around the world, with a goal of providing a single shared standard for web content accessibility.',
        'WCAG has three conformance levels: A (minimum), AA (standard), and AAA (enhanced). Most organizations aim for AA compliance.'
      ],
      priority: 1
    },
    {
      id: '2',
      name: 'Color Contrast',
      examples: [
        'How do I check color contrast?',
        'What contrast ratio is needed for accessibility?',
        'Are my colors accessible?'
      ],
      responses: [
        'You can check color contrast using our contrast checker tool. WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.',
        'For enhanced accessibility (AAA), aim for 7:1 contrast ratio for normal text and 4.5:1 for large text.'
      ],
      priority: 2
    },
  ]);
  
  // Initiate content scan
  const startContentScan = async () => {
    setScanning(true);
    try {
      const results = await scanWebsiteContent();
      setAuditResults(results);
      console.log('Content scan completed:', results);
    } catch (error) {
      console.error('Error scanning content:', error);
    } finally {
      setScanning(false);
    }
  };
  
  // Clear chat history with confirmation
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      clearHistory();
      alert('Chat history has been cleared.');
    }
  };
  
  return (
    <div className="p-6">
      <PageHeader 
        title="Chatbot Management" 
        description="Configure and monitor your WCAG Accessibility Support Chatbot"
      />
      
      <Tabs
        tabs={[
          {
            id: 'settings',
            label: 'Settings',
            content: (
              <div className="space-y-6">
                {/* General Settings */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Enable Chatbot</h4>
                          <p className="text-sm text-gray-500">Show the chat widget to users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-suggestions</h4>
                          <p className="text-sm text-gray-500">Suggest responses based on user input</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Learning Mode</h4>
                          <p className="text-sm text-gray-500">Improve responses based on user interactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoLearningEnabled}
                            onChange={(e) => updateSettings({ autoLearningEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bot Name
                          </label>
                          <input
                            type="text"
                            value={settings.greeting}
                            onChange={(e) => updateSettings({ greeting: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Greeting Message
                          </label>
                          <input
                            type="text"
                            value={settings.greeting}
                            onChange={(e) => updateSettings({ greeting: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            After Hours Message
                          </label>
                          <input
                            type="text"
                            value={settings.greeting}
                            onChange={(e) => updateSettings({ greeting: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Human Transfer Threshold
                          </label>
                          <select
                            value={settings.maxHistoryLength}
                            onChange={(e) => updateSettings({ maxHistoryLength: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="2">After 2 failed responses</option>
                            <option value="3">After 3 failed responses</option>
                            <option value="4">After 4 failed responses</option>
                            <option value="5">After 5 failed responses</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Voice Input</h4>
                          <p className="text-sm text-gray-500">Allow users to speak instead of typing</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">File Attachments</h4>
                          <p className="text-sm text-gray-500">Allow users to upload files in chat</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Feedback Collection</h4>
                          <p className="text-sm text-gray-500">Ask users to rate responses</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Usage Analytics</h4>
                          <p className="text-sm text-gray-500">Collect anonymous usage data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableAutoSuggestions}
                            onChange={(e) => updateSettings({ enableAutoSuggestions: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Scanning */}
                <Card>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Content Scanning</h3>
                        <p className="text-sm text-gray-500">Automatically scan website content to improve chatbot responses</p>
                      </div>
                      <div className="mt-2 sm:mt-0 inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          onClick={startContentScan}
                          disabled={scanning}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {scanning ? 'Scanning...' : 'Scan Now'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto Scanning</h4>
                          <p className="text-sm text-gray-500">Automatically scan content for chatbot training</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableContentScanning}
                            onChange={(e) => updateSettings({ enableContentScanning: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Scanning Frequency
                        </label>
                        <select
                          value={settings.scanningFrequency}
                          onChange={(e) => updateSettings({ scanningFrequency: e.target.value as 'hourly' | 'daily' | 'weekly' })}
                          disabled={!settings.enableContentScanning}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      
                      {auditResults && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Last Scan Results</h4>
                          <div className="bg-gray-50 p-4 rounded-md text-sm">
                            <p><span className="font-medium">Last Scan:</span> {new Date(auditResults.lastScan).toLocaleString()}</p>
                            <p><span className="font-medium">Pages Scanned:</span> {auditResults.scannedPages}</p>
                            <p><span className="font-medium">Topics Extracted:</span> {auditResults.extractedTopics.length}</p>
                            {auditResults.newTopics.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">New Topics Discovered:</p>
                                <ul className="list-disc list-inside mt-1 pl-2">
                                  {auditResults.newTopics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {auditResults.contentGaps.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">Content Gaps:</p>
                                <ul className="list-disc list-inside mt-1 pl-2">
                                  {auditResults.contentGaps.map((gap, i) => (
                                    <li key={i}>{gap.topic} - {gap.suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Advanced Settings */}
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          AI Model
                        </label>
                        <select
                          value={settings.aiModel}
                          onChange={(e) => updateSettings({ aiModel: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="gpt-3.5">GPT-3.5 (Standard)</option>
                          <option value="gpt-4">GPT-4 (Enhanced)</option>
                          <option value="custom">Custom Model</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message History Length
                        </label>
                        <select
                          value={settings.maxHistoryLength}
                          onChange={(e) => updateSettings({ maxHistoryLength: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="10">10 messages</option>
                          <option value="20">20 messages</option>
                          <option value="50">50 messages</option>
                          <option value="100">100 messages</option>
                        </select>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                        <button
                          type="button"
                          onClick={handleClearHistory}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Clear Chat History
                        </button>
                        <p className="mt-1 text-xs text-gray-500">This will delete all chat history and cannot be undone.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'analytics',
            label: 'Analytics & Insights',
            content: <ChatAnalytics />,
          },
          {
            id: 'training',
            label: 'Knowledge Base',
            content: (
              <div className="space-y-6">
                <Card>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Training Topics</h3>
                        <p className="text-sm text-gray-500">Manage the topics your chatbot is trained on</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add Topic
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Topic</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Examples</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {trainingTopics.map((topic) => (
                            <tr key={topic.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{topic.name}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{topic.examples.length} examples</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {topic.priority === 1 ? 'High' : topic.priority === 2 ? 'Medium' : 'Low'}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button 
                                  type="button" 
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Edit
                                </button>
                                <button 
                                  type="button" 
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Integration with Help Center</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Your chatbot automatically integrates with your knowledge base and help center articles.
                      When content scanning is enabled, new articles are automatically detected and used to improve responses.
                    </p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Content scanning is currently {settings.enableContentScanning ? 'enabled' : 'disabled'}.
                            {settings.enableContentScanning 
                              ? ' Your chatbot will automatically update its knowledge when new content is published.' 
                              : ' Enable content scanning in the Settings tab to keep your chatbot up to date.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}