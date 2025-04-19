import React from 'react';
import { IconPreview } from '@/components/navigation/NavigationIconGuide';
import Navbar from '@/components/landing/navbar';

export default function IconGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-6 text-center">AccessWebPro Navigation Icon Guide</h1>
        <p className="text-center mb-8 max-w-3xl mx-auto">
          This guide demonstrates the recommended icons for navigation items across the application.
          Using consistent, meaningful icons helps users quickly recognize navigation options and improves the overall user experience.
        </p>
        
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <IconPreview />
        </div>
        
        <div className="mt-12 bg-card rounded-lg shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold mb-4">Icon Selection Principles</h2>
          <ul className="space-y-2 list-disc pl-6">
            <li>Icons should be <strong>intuitive</strong> - they should visually represent the concept they're paired with</li>
            <li>Icons should be <strong>consistent</strong> - similar concepts should use similar icons</li>
            <li>Icons should be <strong>simple</strong> - avoid complex illustrations in navigation</li>
            <li>Icons should <strong>support text</strong> - they should reinforce rather than replace text labels</li>
            <li>Icons should <strong>scale well</strong> - they should be legible at various sizes</li>
          </ul>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Implementation Notes</h3>
            <p className="mb-4">
              All icons are from the <code>lucide-react</code> library, which provides consistent styling and accessibility features.
              The icon objects are organized by section, making it easy to import only the icons needed for a specific component.
            </p>
            <p>
              For custom icons (such as platform-specific logos), we recommend using SVG imports to maintain consistency with the Lucide icon styling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}