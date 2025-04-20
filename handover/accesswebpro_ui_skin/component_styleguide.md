# AccessWebPro Component Style Guide

This document provides detailed styling specifications for all components in the AccessWebPro UI kit, ensuring consistent implementation across the application.

## Buttons

### Primary Button
```jsx
<button className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full">
  Primary Action
</button>
```

### Secondary Button
```jsx
<button className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-6 py-2 rounded-full">
  Secondary Action
</button>
```

### Small Button
```jsx
<button className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-4 py-1.5 rounded-full text-sm">
  Small Action
</button>
```

### Icon Button
```jsx
<button className="rounded-full p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 text-gray-700 dark:text-gray-300">
  <svg>...</svg>
</button>
```

### Disabled Button
```jsx
<button className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-2 rounded-full cursor-not-allowed" disabled>
  Disabled Action
</button>
```

## Form Elements

### Text Input
```jsx
<input 
  className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none"
  type="text" 
  placeholder="Enter text"
/>
```

### Text Input with Label
```jsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Label</label>
  <input 
    className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none"
    type="text" 
    placeholder="Enter text"
  />
</div>
```

### Checkbox
```jsx
<div className="flex items-center">
  <input 
    type="checkbox" 
    id="checkbox-id"
    className="rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-5 w-5" 
  />
  <label htmlFor="checkbox-id" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
    Checkbox Label
  </label>
</div>
```

### Radio Button
```jsx
<div className="flex items-center">
  <input 
    type="radio" 
    id="radio-id"
    className="border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-5 w-5" 
  />
  <label htmlFor="radio-id" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
    Radio Label
  </label>
</div>
```

### Select
```jsx
<select className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>
```

## Cards and Containers

### Basic Card
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
  Card content goes here
</div>
```

### Feature Card
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
  <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
    <svg className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]">...</svg>
  </div>
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Feature Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Feature description text goes here.</p>
</div>
```

### Hoverable Card
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
  Hoverable card content
</div>
```

### Card with Header
```jsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
  <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Card Header</h3>
  </div>
  <div className="p-6">
    Card content goes here
  </div>
</div>
```

## Navigation

### Tabs
```jsx
<div className="border-b border-gray-200 dark:border-slate-700">
  <div className="flex space-x-6">
    <button className="text-[#0fae96] dark:text-[#5eead4] border-b-2 border-[#0fae96] dark:border-[#5eead4] pb-2 font-medium">
      Active Tab
    </button>
    <button className="text-gray-600 dark:text-gray-400 pb-2 font-medium hover:text-gray-900 dark:hover:text-white">
      Inactive Tab
    </button>
    <button className="text-gray-600 dark:text-gray-400 pb-2 font-medium hover:text-gray-900 dark:hover:text-white">
      Another Tab
    </button>
  </div>
</div>
```

### Pill Tabs
```jsx
<div className="flex space-x-2">
  <button className="px-4 py-2 rounded-full bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]">
    Active Pill
  </button>
  <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
    Inactive Pill
  </button>
  <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
    Another Pill
  </button>
</div>
```

### Breadcrumbs
```jsx
<nav className="flex space-x-2 text-sm">
  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Home</a>
  <span className="text-gray-400 dark:text-gray-600">/</span>
  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Category</a>
  <span className="text-gray-400 dark:text-gray-600">/</span>
  <span className="text-gray-900 dark:text-white font-medium">Current Page</span>
</nav>
```

## Data Display

### Badges and Pills

#### Standard Badge
```jsx
<span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
  Badge
</span>
```

#### Colored Badge (Success)
```jsx
<span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
  Success
</span>
```

#### Colored Badge (Warning)
```jsx
<span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-400">
  Warning
</span>
```

#### Colored Badge (Error)
```jsx
<span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-400">
  Error
</span>
```

#### PRO Badge
```jsx
<span className="inline-flex items-center rounded-full bg-[#0fae96] px-2.5 py-0.5 text-xs font-medium text-white">
  PRO
</span>
```

### Tables

#### Basic Table
```jsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-slate-800">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">John Doe</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Developer</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">Active</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Admin</td>
      </tr>
      <!-- More rows... -->
    </tbody>
  </table>
</div>
```

## Feedback Components

### Alerts

#### Success Alert
```jsx
<div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-4 border-l-4 border-green-400 dark:border-green-500">
  <div className="flex">
    <div className="flex-shrink-0">
      <!-- Success Icon -->
    </div>
    <div className="ml-3">
      <p className="text-sm text-green-800 dark:text-green-400">Success message goes here.</p>
    </div>
  </div>
</div>
```

#### Warning Alert
```jsx
<div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-4 border-l-4 border-amber-400 dark:border-amber-500">
  <div className="flex">
    <div className="flex-shrink-0">
      <!-- Warning Icon -->
    </div>
    <div className="ml-3">
      <p className="text-sm text-amber-800 dark:text-amber-400">Warning message goes here.</p>
    </div>
  </div>
</div>
```

#### Error Alert
```jsx
<div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4 border-l-4 border-red-400 dark:border-red-500">
  <div className="flex">
    <div className="flex-shrink-0">
      <!-- Error Icon -->
    </div>
    <div className="ml-3">
      <p className="text-sm text-red-800 dark:text-red-400">Error message goes here.</p>
    </div>
  </div>
</div>
```

#### Info Alert
```jsx
<div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4 border-l-4 border-blue-400 dark:border-blue-500">
  <div className="flex">
    <div className="flex-shrink-0">
      <!-- Info Icon -->
    </div>
    <div className="ml-3">
      <p className="text-sm text-blue-800 dark:text-blue-400">Information message goes here.</p>
    </div>
  </div>
</div>
```

### Tooltips

#### Basic Tooltip
```jsx
<div className="relative inline-block">
  <button className="rounded-full p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 text-gray-700 dark:text-gray-300">
    <svg><!-- Info Icon --></svg>
  </button>
  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-1 px-2 min-w-[150px]">
    Tooltip text
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
  </div>
</div>
```

## WCAG Specific Components

### WCAG Level Badge
```jsx
<span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-400">
  WCAG AA
</span>
```

### Contrast Ratio Display
```jsx
<div className="flex items-center space-x-2">
  <div className="w-4 h-4 rounded-full bg-white border border-gray-200"></div>
  <div className="w-4 h-4 rounded-full bg-[#0fae96]"></div>
  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4.5:1</span>
  <span className="text-xs text-green-600 dark:text-green-400">Passes AA</span>
</div>
```

### Accessibility Results Item
```jsx
<div className="border-b border-gray-200 dark:border-gray-700 py-4">
  <div className="flex items-start">
    <div className="mt-0.5 mr-3 flex-shrink-0">
      <svg className="h-5 w-5 text-red-500 dark:text-red-400"><!-- Error Icon --></svg>
    </div>
    <div>
      <h4 className="text-base font-medium text-gray-900 dark:text-white">Missing alt text on images</h4>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Images must have alternative text for screen readers.</p>
      <div className="mt-2">
        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-400">
          WCAG 1.1.1
        </span>
      </div>
    </div>
  </div>
</div>
```