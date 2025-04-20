import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, Zap, Globe, FileText, FileImage, Video, Headphones, LayoutGrid, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

// SVG for information icon
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default function CheckerPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckSite = () => {
    if (!url) return;
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Country tabs
  const countries = [
    { id: 'eu', label: 'EU' },
    { id: 'uk', label: 'UK' },
    { id: 'usa', label: 'USA' },
    { id: 'canada', label: 'Canada' },
    { id: 'australia', label: 'Australia' },
    { id: 'japan', label: 'Japan' },
    { id: 'global', label: 'Global' },
  ];

  // Standards tabs
  const standards = [
    { id: 'en301549', label: 'EN 301 549', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
    { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
  ];

  // Feature cards
  const featureCards = [
    {
      id: 'deep-analysis',
      title: 'Deep Analysis',
      description: 'Thorough scanning of HTML, ARIA, and dynamic content',
      icon: <FileText className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'ai-powered',
      title: 'AI-Powered Fixes',
      description: 'Get instant suggestions with code examples',
      icon: <Zap className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'global-standards',
      title: 'Global Standards',
      description: 'Support for WCAG 2.1 & 2.2, ADA, and Section 508',
      icon: <Globe className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'pdf-accessibility',
      title: 'PDF Accessibility',
      description: 'Test PDFs for tags, reading order, and document structure',
      icon: <FileText className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'office-document',
      title: 'Office Document Testing',
      description: 'Check Word, Excel, and PowerPoint files for accessibility',
      icon: <FileText className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'video-accessibility',
      title: 'Video Accessibility',
      description: 'Check for captions, audio descriptions, and accessible controls',
      icon: <Video className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'audio-accessibility',
      title: 'Audio Accessibility',
      description: 'Verify transcripts and keyboard-accessible audio controls',
      icon: <Headphones className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'structure-analysis',
      title: 'Structure Analysis',
      description: 'Evaluate heading hierarchy, semantic elements, and URL design',
      icon: <LayoutGrid className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
    {
      id: 'responsive-design',
      title: 'Responsive Design',
      description: 'Check mobile accessibility including touch targets and viewport settings',
      icon: <Smartphone className="w-7 h-7 text-[#0fae96] dark:text-[#5eead4]" />,
    },
  ];

  // Testing options
  const testingOptions = [
    { id: 'document', label: 'Document Testing', badge: 'Pro' },
    { id: 'pdf', label: 'PDF Accessibility', badge: 'Pro' },
    { id: 'office', label: 'Test Office Documents', badge: 'Pro' },
    { id: 'media', label: 'Test Media Files', badge: 'Pro' },
  ];

  const [selectedCountry, setSelectedCountry] = useState('eu');
  const [selectedStandards, setSelectedStandards] = useState(['wcag21', 'wcag22']);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleStandard = (id: string) => {
    if (selectedStandards.includes(id)) {
      setSelectedStandards(selectedStandards.filter(item => item !== id));
    } else {
      setSelectedStandards([...selectedStandards, id]);
    }
  };

  const toggleOption = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto mb-16 bg-[#f8fafc] dark:bg-slate-900 rounded-xl shadow-md p-8 border border-gray-100 dark:border-slate-800">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 dark:text-white bg-gradient-to-r from-[#0066FF] to-[#0fae96] dark:from-[#0066FF] dark:to-[#5eead4] bg-clip-text text-transparent">
          WCAG Accessibility Checker
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-10 dark:text-[#94a3b8]">
          Test your website against WCAG 2.1 and 2.2 standards
        </p>

        {/* Country Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {countries.map(country => (
            <button
              key={country.id}
              className={`px-6 py-2.5 rounded-full text-lg font-medium transition-all ${
                selectedCountry === country.id 
                  ? 'bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4] border-2 border-[#0fae96] dark:border-[#5eead4]' 
                  : 'bg-white dark:bg-slate-800 text-muted-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 border border-gray-200 dark:border-slate-700'
              }`}
              onClick={() => setSelectedCountry(country.id)}
              aria-pressed={selectedCountry === country.id}
            >
              {country.label}
            </button>
          ))}
        </div>
        
        {/* Standards Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {standards.map(standard => (
            <button
              key={standard.id}
              className={`px-5 py-2 rounded-full text-base font-medium transition-all ${
                selectedStandards.includes(standard.id)
                  ? `${standard.color} border-2 border-current`
                  : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10'
              }`}
              onClick={() => toggleStandard(standard.id)}
              aria-pressed={selectedStandards.includes(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing Options */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-8 mb-10">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Additional Testing Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testingOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-4 p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-md transition-colors">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="h-5 w-5 rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] focus:ring-offset-2 focus-visible:outline-none"
                  />
                </div>
                <label htmlFor={option.id} className="text-base font-medium cursor-pointer flex items-center flex-1">
                  {option.label}
                  <span className="ml-2 bg-[#0fae96] dark:bg-[#5eead4] text-white dark:text-slate-900 text-xs px-2 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                </label>
                <div className="tooltip relative" aria-label={`Information about ${option.label}`}>
                  <InfoIcon />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* URL Input */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md rounded-xl relative z-10 mb-6">
          <div className="p-6 flex flex-col md:flex-row gap-4">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., example.com)"
              className="text-lg py-6 px-5 flex-1 border-gray-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-[#0fae96] focus-visible:ring-offset-2 rounded-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Website URL"
            />
            <Button 
              onClick={handleCheckSite}
              disabled={isLoading || !url}
              className="ml-0 md:ml-4 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-6 text-lg rounded-full h-auto shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckIcon className="mr-2 h-5 w-5" />
                  Check Site
                </div>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#0fae96] dark:text-[#5eead4]"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <p className="text-center text-base font-medium text-[#0fae96] dark:text-[#5eead4]">
            The scan typically takes 30-60 seconds depending on the size of your website
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {featureCards.map(feature => (
          <motion.div
            key={feature.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
          >
            <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
            <p className="text-muted-foreground dark:text-slate-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}