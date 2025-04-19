import React from 'react';
import { IconPreview } from '../components/navigation/NavigationIconGuide';

const IconGuidePage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">AccessWebPro Icon Guide</h1>
      <p className="text-lg mb-8">
        This guide demonstrates the recommended icons for navigation items across the AccessWebPro application.
        Using consistent icons helps maintain a unified visual language throughout the UI.
      </p>
      
      <IconPreview />
    </div>
  );
};

export default IconGuidePage;