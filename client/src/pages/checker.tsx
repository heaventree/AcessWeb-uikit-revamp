import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from 'lucide-react';

export default function CheckerPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckSite = () => {
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Country regions
  const regions = [
    { id: 'eu', label: 'EU' },
    { id: 'uk', label: 'UK' },
    { id: 'usa', label: 'USA' },
    { id: 'canada', label: 'Canada' },
    { id: 'australia', label: 'Australia' },
    { id: 'japan', label: 'Japan' },
    { id: 'global', label: 'Global' },
  ];

  // Standards
  const standards = [
    { id: 'en301549', label: 'EN 301 549', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ];

  // Advanced testing options
  const testingOptions = [
    { id: 'document', label: 'Document Testing', badge: 'PRO' },
    { id: 'pdf', label: 'PDF Accessibility', badge: 'PRO' },
    { id: 'office', label: 'Office Documents', badge: 'PRO' },
    { id: 'media', label: 'Media Files', badge: 'PRO' },
  ];

  const [selectedRegion, setSelectedRegion] = useState('eu');
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
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eff6ff] dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#0fae96]">
              WCAG Accessibility Checker
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Test your website against WCAG 2.1 and 2.2 standards
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Regions Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              {regions.map(region => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedRegion === region.id
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Standards Selection */}
              <div className="flex flex-wrap gap-2 mb-6">
                {standards.map(standard => (
                  <button
                    key={standard.id}
                    onClick={() => toggleStandard(standard.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedStandards.includes(standard.id)
                        ? standard.color
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {standard.label}
                  </button>
                ))}
              </div>

              {/* Pro Options */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {testingOptions.map(option => (
                  <div 
                    key={option.id} 
                    className="flex items-center space-x-2"
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                      selectedOptions.includes(option.id)
                        ? 'bg-[#0066FF] border-[#0066FF]'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <CheckIcon className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{option.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#0066FF] text-white font-medium">
                      {option.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* URL Input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., example.com)"
                  className="flex-1 text-base py-6 px-4 border-slate-300 dark:border-slate-600 focus-visible:ring-[#0066FF]"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  onClick={handleCheckSite}
                  disabled={isLoading || !url}
                  className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white py-6 px-6 rounded-md font-medium shadow-sm h-auto"
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
                    <span>Check Site</span>
                  )}
                </Button>
              </div>

              {/* Message */}
              <p className="text-center text-[#0066FF] dark:text-blue-400 mt-6 text-sm">
                The scan typically takes 30-60 seconds depending on the size of your website
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-white">Deep Analysis</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Thorough scanning of HTML, ARIA attributes, and dynamic content for accessibility issues.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-white">WCAG Compliance</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Check against the latest WCAG 2.1 and 2.2 standards to ensure accessibility compliance.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-white">Detailed Reports</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Get comprehensive reports with actionable fixes to improve accessibility.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}