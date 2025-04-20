import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from 'lucide-react';

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
    { id: 'en301549', label: 'EN 301 549', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
    { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ];

  // Testing options
  const testingOptions = [
    { id: 'document', label: 'Document Testing', badge: 'PRO' },
    { id: 'pdf', label: 'PDF Accessibility', badge: 'PRO' },
    { id: 'office', label: 'Test Office Documents', badge: 'PRO' },
    { id: 'media', label: 'Test Media Files', badge: 'PRO' },
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
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-200 dark:border-slate-800 p-8">
        <h1 className="text-3xl font-bold text-center mb-3 dark:text-white">
          WCAG Accessibility Checker
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-8 dark:text-slate-300">
          Test your website against WCAG 2.1 and 2.2 standards
        </p>

        {/* Country Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {countries.map(country => (
            <button
              key={country.id}
              className={`px-6 py-2.5 rounded-full text-base font-medium transition-all ${
                selectedCountry === country.id 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 text-muted-foreground hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
              onClick={() => setSelectedCountry(country.id)}
              aria-pressed={selectedCountry === country.id}
            >
              {country.label}
            </button>
          ))}
        </div>
        
        {/* Standards Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {standards.map(standard => (
            <button
              key={standard.id}
              className={`px-5 py-1.5 rounded-full text-base font-medium transition-all ${
                selectedStandards.includes(standard.id)
                  ? standard.color
                  : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
              }`}
              onClick={() => toggleStandard(standard.id)}
              aria-pressed={selectedStandards.includes(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing Options */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {testingOptions.map(option => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="h-5 w-5 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-2"
              />
              <label htmlFor={option.id} className="text-base cursor-pointer flex items-center">
                {option.label}
                <span className="ml-2 bg-[#0066FF] text-white text-xs px-2 py-0.5 rounded-full">
                  {option.badge}
                </span>
              </label>
              <InfoIcon />
            </div>
          ))}
        </div>

        {/* URL Input */}
        <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <Input
            type="url"
            placeholder="Enter website URL (e.g., example.com)"
            className="text-base py-5 px-5 flex-1 border-gray-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 rounded-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Website URL"
          />
          <Button 
            onClick={handleCheckSite}
            disabled={isLoading || !url}
            className="ml-0 sm:ml-4 bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-5 text-base rounded-lg h-auto shadow-sm w-full sm:w-auto"
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
        <p className="text-center text-base text-[#0066FF] dark:text-blue-300 mt-4 font-medium">
          The scan typically takes 30-60 seconds depending on the size of your website
        </p>
      </div>
    </div>
  );
}