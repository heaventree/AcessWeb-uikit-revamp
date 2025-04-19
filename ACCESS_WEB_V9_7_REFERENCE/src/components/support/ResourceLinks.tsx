import { ExternalLink } from 'lucide-react';
import { ResourceLink } from '../../types/chat';

interface ResourceLinksProps {
  links: ResourceLink[];
}

/**
 * Displays relevant resource links suggested by the chatbot
 */
export function ResourceLinks({ links }: ResourceLinksProps) {
  if (!links || links.length === 0) return null;
  
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-2">
        Relevant resources:
      </p>
      
      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="block p-2 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-1 group-hover:text-blue-800">
                  {link.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {link.description}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-500 flex-shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}