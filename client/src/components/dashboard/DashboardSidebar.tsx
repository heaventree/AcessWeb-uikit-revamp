import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  BarChart2,
  CheckSquare,
  Settings,
  Home,
  FileText,
  Users,
  Tool,
  Zap,
  BookOpen,
  HelpCircle,
  ExternalLink,
  PanelRight,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  hasBadge?: boolean;
  badgeText?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  path,
  label,
  icon,
  isCollapsed,
  hasBadge = false,
  badgeText = '',
  isExternal = false,
  onClick
}: NavItemProps) => {
  const [location] = useLocation();
  const isActive = location === path || location.startsWith(`${path}/`);
  
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium transition-all",
        isActive 
          ? "bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!isCollapsed && hasBadge && (
        <Badge 
          variant="secondary" 
          className="text-xs font-semibold h-5 px-1.5 ml-auto"
        >
          {badgeText}
        </Badge>
      )}
      {!isCollapsed && isExternal && (
        <ExternalLink className="h-3.5 w-3.5 ml-1 text-gray-400" />
      )}
    </div>
  );

  if (isExternal) {
    return (
      <a 
        href={path} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
        onClick={onClick}
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {content}
              </TooltipTrigger>
              <TooltipContent side="right">
                {label}
                {hasBadge && ` (${badgeText})`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : content}
      </a>
    );
  }

  return (
    <Link 
      to={path} 
      onClick={onClick}
      className="block"
    >
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right">
              {label}
              {hasBadge && ` (${badgeText})`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : content}
    </Link>
  );
};

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

const NavSection = ({ title, children, isCollapsed }: NavSectionProps) => {
  if (isCollapsed) {
    return (
      <div className="mt-2 px-2">
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
        {children}
      </div>
    );
  }

  return (
    <div className="mt-2 px-2">
      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-1 space-y-1">
        {children}
      </div>
    </div>
  );
};

interface DashboardSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const DashboardSidebar = ({
  isOpen,
  isMobile,
  mobileSidebarOpen,
  closeMobileSidebar
}: DashboardSidebarProps) => {
  const onClick = isMobile ? closeMobileSidebar : undefined;
  
  return (
    <aside
      className={cn(
        "fixed z-40 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isMobile
          ? cn(
              "w-64 -translate-x-full lg:translate-x-0 lg:w-auto",
              mobileSidebarOpen && "translate-x-0"
            )
          : cn(
              "w-64 lg:translate-x-0",
              !isOpen && "lg:w-[72px]"
            )
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <NavItem
              path="/dashboard"
              label="Dashboard"
              icon={<Home />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/analytics"
              label="Analytics"
              icon={<BarChart2 />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/compliance"
              label="Compliance"
              icon={<CheckSquare />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/reports"
              label="Reports"
              icon={<FileText />}
              isCollapsed={!isOpen && !isMobile}
              hasBadge
              badgeText="New"
              onClick={onClick}
            />
          </nav>
          
          <NavSection title="Management" isCollapsed={!isOpen && !isMobile}>
            <NavItem
              path="/monitoring"
              label="Monitoring"
              icon={<PanelRight />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/alerts"
              label="Alerts"
              icon={<Bell />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/team"
              label="Team"
              icon={<Users />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
          </NavSection>
          
          <NavSection title="Tools" isCollapsed={!isOpen && !isMobile}>
            <NavItem
              path="/tools/wcag-color-palette"
              label="WCAG Color Palette"
              icon={<Tool />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/tools/image-alt-scanner"
              label="Image Alt Scanner"
              icon={<Tool />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/tools/color-simulator"
              label="Color Simulator"
              icon={<Tool />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
          </NavSection>
          
          <NavSection title="Integrations" isCollapsed={!isOpen && !isMobile}>
            <NavItem
              path="/integrations"
              label="All Integrations"
              icon={<Zap />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/integrations/wordpress"
              label="WordPress"
              icon={<Zap />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/integrations/shopify"
              label="Shopify"
              icon={<Zap />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/integrations/api"
              label="API Integration"
              icon={<Zap />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
          </NavSection>
          
          <NavSection title="Resources" isCollapsed={!isOpen && !isMobile}>
            <NavItem
              path="/help"
              label="Help Center"
              icon={<HelpCircle />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/docs"
              label="Documentation"
              icon={<BookOpen />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
            <NavItem
              path="/wcag-resources"
              label="WCAG Resources"
              icon={<BookOpen />}
              isCollapsed={!isOpen && !isMobile}
              onClick={onClick}
            />
          </NavSection>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isOpen && !isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/settings">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link 
              to="/settings"
              onClick={onClick}
              className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;