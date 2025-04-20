import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from 'lucide-react';

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </svg>
);

export default function CheckerPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('eu');
  const [selectedStandards, setSelectedStandards] = useState(['wcag21', 'wcag22']);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckSite = () => {
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

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
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-2">WCAG Accessibility Checker</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Test your website against WCAG 2.1 and 2.2 standards</p>
        
        {/* Region tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['EU', 'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Global'].map(country => (
            <button
              key={country.toLowerCase()}
              className={`px-4 py-2 rounded-full transition ${
                selectedCountry === country.toLowerCase()
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCountry(country.toLowerCase())}
            >
              {country}
            </button>
          ))}
        </div>
        
        {/* Standards */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'en301549', label: 'EN 301 549', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' },
            { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
            { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
          ].map(standard => (
            <button
              key={standard.id}
              className={`px-4 py-1.5 rounded-full transition ${
                selectedStandards.includes(standard.id)
                  ? standard.color
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => toggleStandard(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { id: 'document', label: 'Document Testing' },
            { id: 'pdf', label: 'PDF Accessibility' },
            { id: 'office', label: 'Test Office Documents' },
            { id: 'media', label: 'Test Media Files' }
          ].map(option => (
            <div key={option.id} className="flex items-center">
              <input
                type="checkbox"
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor={option.id} className="text-sm">
                {option.label}
                <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">PRO</span>
              </label>
              <span className="ml-1 text-gray-400"><InfoIcon /></span>
            </div>
          ))}
        </div>
        
        {/* URL Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            type="url"
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            onClick={handleCheckSite}
            disabled={isLoading || !url}
            className="bg-blue-600"
          >
            {isLoading ? 'Checking...' : 'Check Site'}
          </Button>
        </div>
        
        <p className="text-blue-600 dark:text-blue-400 text-sm text-center">
          The scan typically takes 30-60 seconds depending on the size of your website
        </p>
      </div>
    </div>
  );
}