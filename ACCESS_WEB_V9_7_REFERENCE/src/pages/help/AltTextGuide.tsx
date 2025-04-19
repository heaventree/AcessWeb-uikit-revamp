import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Copy, FileText, HelpCircle, Image, Info, Search } from 'lucide-react';

export function AltTextGuide() {
  const [activeTab, setActiveTab] = useState<'basics' | 'examples' | 'faq'>('basics');
  const [searchQuery, setSearchQuery] = useState('');

  const exampleCategories = [
    {
      name: 'Product Images',
      examples: [
        {
          description: 'Product photo showing primary features',
          badExample: 'product.jpg',
          goodExample: 'Blue denim jacket with metal buttons and front pockets',
          explanation: 'Describes the key visual elements that a customer would want to know about'
        },
        {
          description: 'Product in use/context',
          badExample: 'person wearing hat',
          goodExample: 'Woman hiking in mountains wearing red waterproof hat',
          explanation: 'Provides context and specific details about how the product is being used'
        }
      ]
    },
    {
      name: 'UI Elements',
      examples: [
        {
          description: 'Icon for navigation',
          badExample: 'settings icon image',
          goodExample: 'Settings',
          explanation: 'Simple and direct, focuses on function rather than appearance'
        },
        {
          description: 'Button with icon',
          badExample: 'download button with arrow',
          goodExample: 'Download PDF',
          explanation: 'Describes the action, not the visual appearance'
        }
      ]
    },
    {
      name: 'Charts and Graphs',
      examples: [
        {
          description: 'Bar chart showing data',
          badExample: 'sales chart',
          goodExample: 'Bar chart showing monthly sales from January to December 2024, with peak in November',
          explanation: 'Summarizes the key information conveyed by the chart'
        },
        {
          description: 'Infographic with multiple data points',
          badExample: 'customer satisfaction infographic',
          goodExample: 'Infographic showing 92% customer satisfaction rate with breakdown by service area',
          explanation: 'Captures the essential data points without unnecessary detail'
        }
      ]
    },
    {
      name: 'Decorative Images',
      examples: [
        {
          description: 'Background texture/pattern',
          badExample: 'blue pattern background',
          goodExample: '',
          explanation: 'Empty alt text (alt="") because the image is purely decorative'
        },
        {
          description: 'Divider or spacer',
          badExample: 'divider line',
          goodExample: '',
          explanation: 'Empty alt text for decorative elements that don\'t convey content'
        }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How long should alt text be?',
      answer: 'Alt text should be concise yet descriptive, typically between 10-15 words. Screen readers often cut off alt text after about 125 characters, so aim to stay under that limit while still conveying the essential information.'
    },
    {
      question: 'Should I use alt text for all images?',
      answer: 'All meaningful images should have appropriate alt text. Decorative images that don\'t add content value should have empty alt text (alt="") to indicate to screen readers that they can be skipped.'
    },
    {
      question: 'Do I need to include "image of" or "picture of" in my alt text?',
      answer: 'No. Screen readers already announce that an element is an image before reading the alt text. Adding "image of" or "picture of" is redundant and wastes valuable space in your alt text.'
    },
    {
      question: 'What about complex images like infographics?',
      answer: 'For complex images like charts, graphs, and infographics, provide a concise summary in the alt text and consider adding a longer description elsewhere on the page. Focus on the key data points and conclusions rather than describing every visual aspect.'
    },
    {
      question: 'Should I include keywords for SEO in alt text?',
      answer: 'While alt text does contribute to SEO, its primary purpose is accessibility. Write alt text for human users first. Include relevant keywords only if they naturally fit the description of the image, and avoid keyword stuffing.'
    },
    {
      question: 'How do I handle images that contain text?',
      answer: 'For images containing text, include that text in the alt attribute. If the image is a complex infographic or chart with text, provide the key information in the alt text and consider adding a more complete text alternative elsewhere on the page.'
    },
    {
      question: 'What\'s the difference between alt text and title attributes?',
      answer: 'Alt text is essential for accessibility and is read by screen readers in place of the image. Title attributes create tooltip text that appears when users hover over an element and are not consistently read by screen readers. Focus on writing good alt text rather than relying on title attributes.'
    },
    {
      question: 'How do I handle images in emails?',
      answer: 'Email clients handle images differently, but the principles are the same. Include descriptive alt text for meaningful images in emails, as many clients block images by default. This ensures your message is accessible even when images aren\'t displayed.'
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="content-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Alt Text Guide
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Learn how to write effective alt text for maximum accessibility
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="sm:hidden">
            <select
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'basics' | 'examples' | 'faq')}
            >
              <option value="basics">Basics</option>
              <option value="examples">Examples</option>
              <option value="faq">FAQs</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('basics')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'basics'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Info className="w-4 h-4 mr-2 inline" />
                Basics
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'examples'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Examples
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'faq'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <HelpCircle className="w-4 h-4 mr-2 inline" />
                FAQs
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Basics Tab */}
          {activeTab === 'basics' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Alt Text Basics
              </h2>
              
              <div className="prose dark:prose-invert max-w-none">
                <h3>What is Alt Text?</h3>
                <p>
                  Alternative text (alt text) is a written description of an image that appears in HTML code. 
                  It's read by screen readers, displayed when images fail to load, and used by search engines 
                  to understand image content.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg my-4">
                  <h4 className="font-medium mb-2">HTML Syntax:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                    <code>&lt;img src="image.jpg" alt="Description of the image" /&gt;</code>
                  </pre>
                </div>
                
                <h3>Why Alt Text Matters</h3>
                <ul>
                  <li><strong>Accessibility</strong>: Makes your content accessible to people with visual impairments</li>
                  <li><strong>SEO</strong>: Helps search engines understand your images and improves rankings</li>
                  <li><strong>User Experience</strong>: Provides context when images can't be loaded</li>
                  <li><strong>Legal Compliance</strong>: Required by accessibility laws in many countries</li>
                </ul>
                
                <h3>Core Principles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" /> Do's
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Be specific and concise (10-15 words)</li>
                      <li>Focus on the purpose and context of the image</li>
                      <li>Include text that appears in the image</li>
                      <li>Use empty alt text (alt="") for decorative images</li>
                      <li>Prioritize the most important details first</li>
                      <li>Test with a screen reader when possible</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" /> Don'ts
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Start with "image of" or "picture of"</li>
                      <li>Include redundant information</li>
                      <li>Stuff keywords for SEO purposes</li>
                      <li>Use vague descriptions ("photo1.jpg")</li>
                      <li>Write overly lengthy descriptions</li>
                      <li>Rely on automated/AI-generated alt text without review</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="mt-6">When to Use Empty Alt Text</h3>
                <p>
                  Use empty alt text (alt="") for images that are purely decorative and don't convey content 
                  that's necessary for understanding the page. This tells screen readers to skip the image.
                </p>
                <p>Examples of decorative images that should have empty alt text:</p>
                <ul>
                  <li>Background textures or patterns</li>
                  <li>Decorative dividers or spacers</li>
                  <li>Purely aesthetic elements</li>
                  <li>Images that repeat information already provided in text</li>
                </ul>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center">
                    <Info className="h-5 w-5 mr-2" /> Important Note
                  </h4>
                  <p className="text-sm mt-1">
                    Never omit the alt attribute entirely, as screen readers will often read the file name instead. 
                    Either provide descriptive alt text or use alt="" for decorative images.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Alt Text Examples by Category
              </h2>
              
              <div className="space-y-8">
                {exampleCategories.map((category, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Image className="w-5 h-5 mr-2 text-primary-500" />
                      {category.name}
                    </h3>
                    
                    <div className="space-y-6">
                      {category.examples.map((example, exIndex) => (
                        <div key={exIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <div className="p-4 bg-gray-100 dark:bg-gray-600">
                            <h4 className="font-medium">{example.description}</h4>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1 flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1" /> Poor Alt Text
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-mono bg-white dark:bg-gray-800 py-1 px-2 rounded">
                                    alt="{example.badExample}"
                                  </p>
                                  <button 
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    aria-label="Copy bad example"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-1" /> Good Alt Text
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-mono bg-white dark:bg-gray-800 py-1 px-2 rounded">
                                    alt="{example.goodExample}"
                                  </p>
                                  <button 
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    aria-label="Copy good example"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                              <strong>Why it works:</strong> {example.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="p-4 bg-gray-100 dark:bg-gray-600">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No FAQs match your search criteria. Try different keywords.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AltTextGuide;