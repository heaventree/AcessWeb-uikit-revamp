# WCAG Checker Page Style Guide

This document provides detailed styling specifications for the WCAG Checker page, ensuring consistent implementation of the AccessWebPro UI kit.

## Page Structure

The WCAG Checker page consists of the following key components:
1. Page title and description
2. Region tabs (country selection)
3. Standards selection pills
4. Testing options with checkboxes
5. URL input field with check button
6. Information text about scanning time

## Styling Specifications

### Page Container
```jsx
<div className="container mx-auto p-6">
  <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8">
    {/* Page content */}
  </div>
</div>
```

### Page Title and Description
```jsx
<h1 className="text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
  WCAG Accessibility Checker
</h1>
<p className="text-gray-600 dark:text-gray-400 text-center mb-6">
  Test your website against WCAG 2.1 and 2.2 standards
</p>
```

### Region Tabs
```jsx
<div className="flex flex-wrap justify-center gap-2 mb-6">
  {['EU', 'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Global'].map(country => (
    <button
      key={country.toLowerCase()}
      className={`px-4 py-2 rounded-full transition ${
        selectedCountry === country.toLowerCase()
          ? 'bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]'
          : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
      }`}
      onClick={() => setSelectedCountry(country.toLowerCase())}
    >
      {country}
    </button>
  ))}
</div>
```

### Standards Pills
```jsx
<div className="flex flex-wrap justify-center gap-2 mb-8">
  {[
    { id: 'en301549', label: 'EN 301 549', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' },
    { id: 'eaa', label: 'EAA', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]' },
    { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
  ].map(standard => (
    <button
      key={standard.id}
      className={`px-4 py-1.5 rounded-full transition ${
        selectedStandards.includes(standard.id)
          ? standard.color
          : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
      }`}
      onClick={() => toggleStandard(standard.id)}
    >
      {standard.label}
    </button>
  ))}
</div>
```

### Testing Options
```jsx
<div className="bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg p-4 mb-8">
  <div className="grid grid-cols-2 gap-4">
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
          className="rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-4 w-4 mr-2"
        />
        <label htmlFor={option.id} className="text-sm text-gray-700 dark:text-gray-300">
          {option.label}
          <span className="ml-1 bg-[#0fae96] text-white text-xs px-1.5 py-0.5 rounded-full">PRO</span>
        </label>
        <span className="ml-1 text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        </span>
      </div>
    ))}
  </div>
</div>
```

### URL Input and Button
```jsx
<div className="flex flex-col sm:flex-row gap-3 mb-4">
  <input
    type="url"
    placeholder="Enter website URL (e.g., example.com)"
    className="flex-1 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
  />
  <button
    onClick={handleCheckSite}
    disabled={isLoading || !url}
    className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? 'Checking...' : (
      <>
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
        </svg>
        Check Site
      </>
    )}
  </button>
</div>
```

### Information Text
```jsx
<p className="text-[#0fae96] dark:text-[#5eead4] text-sm text-center">
  The scan typically takes 30-60 seconds depending on the size of your website
</p>
```

## Full Page Implementation

Here's the complete styling implementation for the WCAG Checker page:

```jsx
import React, { useState } from 'react';

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
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckSite = () => {
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const toggleStandard = (id) => {
    if (selectedStandards.includes(id)) {
      setSelectedStandards(selectedStandards.filter(item => item !== id));
    } else {
      setSelectedStandards([...selectedStandards, id]);
    }
  };

  const toggleOption = (id) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-semibold text-center mb-2 text-gray-900 dark:text-white">WCAG Accessibility Checker</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Test your website against WCAG 2.1 and 2.2 standards</p>
        
        {/* Region tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['EU', 'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Global'].map(country => (
            <button
              key={country.toLowerCase()}
              className={`px-4 py-2 rounded-full transition ${
                selectedCountry === country.toLowerCase()
                  ? 'bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
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
            { id: 'wcag21', label: 'WCAG 2.1', color: 'bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]' },
            { id: 'wcag22', label: 'WCAG 2.2', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
          ].map(standard => (
            <button
              key={standard.id}
              className={`px-4 py-1.5 rounded-full transition ${
                selectedStandards.includes(standard.id)
                  ? standard.color
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              onClick={() => toggleStandard(standard.id)}
            >
              {standard.label}
            </button>
          ))}
        </div>
        
        {/* Testing options */}
        <div className="bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
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
                  className="rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-4 w-4 mr-2"
                />
                <label htmlFor={option.id} className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                  <span className="ml-1 bg-[#0fae96] text-white text-xs px-1.5 py-0.5 rounded-full">PRO</span>
                </label>
                <span className="ml-1 text-gray-400"><InfoIcon /></span>
              </div>
            ))}
          </div>
        </div>
        
        {/* URL Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="url"
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-1 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleCheckSite}
            disabled={isLoading || !url}
            className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                </svg>
                Check Site
              </>
            )}
          </button>
        </div>
        
        <p className="text-[#0fae96] dark:text-[#5eead4] text-sm text-center">
          The scan typically takes 30-60 seconds depending on the size of your website
        </p>
      </div>
    </div>
  );
}
```