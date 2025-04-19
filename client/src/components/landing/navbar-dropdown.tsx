import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle } from 'lucide-react';
import NavigationIcons from '../navigation/NavigationIconGuide';

interface DropdownItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItemProps[];
}

const NavDropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, label, description, href }) => {
  return (
    <div className="flex flex-col hover:bg-primary/5 dark:hover:bg-slate-800 cursor-pointer p-3 rounded-md transition-colors" 
         onClick={() => window.location.href = href}>
      <div className="flex items-center mb-1">
        <Icon className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4] mr-2 flex-shrink-0" />
        <span className="font-medium text-base dark:text-white">{label}</span>
      </div>
      <div className="text-base text-muted-foreground dark:text-[#5eead4] whitespace-nowrap text-ellipsis overflow-hidden pl-7">
        {description}
      </div>
    </div>
  );
};

export const NavDropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        className="flex items-center text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-border dark:border-slate-800 w-80 p-2 space-y-1">
              {items.map((item, index) => (
                <NavDropdownItem key={index} {...item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;