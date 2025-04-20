import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, Zap, Globe, FileText, FileImage, Video, Headphones, LayoutGrid, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { id: 'en301549', label: 'EN 301 549', color: 'bg-orange-100 text-orange-700' },
    { id: 'eaa', label: 'EAA', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-700' },
    { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-700' },
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
      <div className="max-w-4xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 dark:text-white">
          WCAG Accessibility Checker
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-8 dark:text-[#94a3b8]">
          Test your website against WCAG 2.1 and 2.2 standards.
        </p>

        {/* Country Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {countries.map(country => (
            <button
              key={country.id}
              className={`px-4 py-2 rounded-full text-base font-medium transition-all ${
                selectedCountry === country.id 
                  ? 'bg-[#0fae96]/10 text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]' 
                  : 'bg-background text-muted-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10'
              }`}
              onClick={() => setSelectedCountry(country.id)}
            >
              {country.label}
            </button>
          ))}
        </div>
        
        {/* Standards Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {standards.map(standard => (
            <button
              key={standard.id}
              className={`px-4 py-1.5 rounded-full text-base font-medium transition-all ${
                selectedStandards.includes(standard.id)
                  ? standard.color
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
              onClick={() => toggleStandard(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing Options */}
        <div className="bg-background/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 flex flex-wrap gap-4 justify-center mb-8">
          {testingOptions.map(option => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] mr-2 h-5 w-5"
              />
              <label htmlFor={option.id} className="text-base cursor-pointer flex items-center">
                {option.label}
                <span className="ml-2 bg-[#0fae96] dark:bg-[#5eead4] text-white dark:text-slate-900 text-xs px-2 py-0.5 rounded-full">
                  {option.badge}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* URL Input */}
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-1 relative z-10 mb-4 flex overflow-hidden">
          <Input
            type="url"
            placeholder="Enter website URL (e.g., example.com)"
            className="border-0 text-base py-6 px-4 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Website URL"
          />
          <Button 
            onClick={handleCheckSite}
            disabled={isLoading || !url}
            className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white m-1 px-6 py-2 rounded-xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4" />
                Check Site
              </div>
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          The scan typically takes 30-60 seconds depending on the size of your website
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {featureCards.map(feature => (
          <motion.div
            key={feature.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
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