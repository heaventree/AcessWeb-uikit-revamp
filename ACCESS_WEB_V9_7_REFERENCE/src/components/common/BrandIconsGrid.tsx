import React from 'react';
import { FaReact, FaGithub, FaSlack, FaGoogle, FaAws } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiVite, SiFirebase } from 'react-icons/si';

// Define types for our integration categories
type IntegrationType = 'current' | 'upcoming';

interface Integration {
  name: string;
  type: IntegrationType;
  iconTag: string;
  iconColor: string;
  description: string;
}

interface BrandIconsGridProps {
  title?: string;
  description?: string;
  showUpcoming?: boolean;
  className?: string;
}

// Create an icon map for easy rendering
const IconMap = {
  'react': FaReact,
  'typescript': SiTypescript,
  'tailwindcss': SiTailwindcss,
  'vite': SiVite,
  'github': FaGithub,
  'aws': FaAws,
  'slack': FaSlack,
  'google': FaGoogle,
  'firebase': SiFirebase
};

// List of integrations with corresponding icons
const integrations: Integration[] = [
  {
    name: 'React',
    type: 'current',
    iconTag: 'react',
    iconColor: 'text-blue-500',
    description: 'Built with React for component-based development'
  },
  {
    name: 'TypeScript',
    type: 'current',
    iconTag: 'typescript',
    iconColor: 'text-blue-700',
    description: 'Type-safe codebase with TypeScript'
  },
  {
    name: 'Tailwind CSS',
    type: 'current',
    iconTag: 'tailwindcss',
    iconColor: 'text-teal-500',
    description: 'Styled using Tailwind CSS utilities'
  },
  {
    name: 'Vite',
    type: 'current',
    iconTag: 'vite',
    iconColor: 'text-purple-600',
    description: 'Lightning-fast build tool'
  },
  {
    name: 'GitHub',
    type: 'current',
    iconTag: 'github',
    iconColor: 'text-gray-800',
    description: 'Version control and repository'
  },
  {
    name: 'AWS',
    type: 'upcoming',
    iconTag: 'aws',
    iconColor: 'text-orange-600',
    description: 'Upcoming cloud hosting integration'
  },
  {
    name: 'Slack',
    type: 'upcoming',
    iconTag: 'slack',
    iconColor: 'text-green-600',
    description: 'Upcoming notifications integration'
  },
  {
    name: 'Google',
    type: 'upcoming',
    iconTag: 'google',
    iconColor: 'text-red-500',
    description: 'Upcoming OAuth integration'
  },
  {
    name: 'Firebase',
    type: 'upcoming',
    iconTag: 'firebase',
    iconColor: 'text-yellow-500',
    description: 'Upcoming database integration'
  }
];

export const BrandIconsGrid: React.FC<BrandIconsGridProps> = ({
  title = 'Platform Integrations',
  description = 'Our accessibility platform seamlessly integrates with industry-standard tools and services.',
  showUpcoming = true,
  className = '',
}) => {
  // Filter integrations based on the showUpcoming prop
  const filteredIntegrations = showUpcoming 
    ? integrations 
    : integrations.filter(integration => integration.type === 'current');

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      )}
      
      {description && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredIntegrations.map((integration) => (
          <div 
            key={integration.name}
            className={`flex flex-col items-center p-4 rounded-lg border ${
              integration.type === 'upcoming' 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-blue-100 bg-blue-50'
            }`}
          >
            <div className="w-12 h-12 mb-3">
              {React.createElement(IconMap[integration.iconTag as keyof typeof IconMap], {
                className: `w-full h-full ${integration.iconColor}`
              })}
            </div>
            <span className="text-sm font-medium text-gray-800">{integration.name}</span>
            {integration.type === 'upcoming' && (
              <span className="text-xs px-2 py-1 bg-gray-200 rounded-full mt-2">Upcoming</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandIconsGrid;