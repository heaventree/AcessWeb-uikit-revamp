import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Gauge,
  Palette,
  FileText,
  Zap,
  Settings,
  Store,
  Globe,
  Activity,
  Shield,
  Building,
  LayoutDashboard,
  CreditCard,
  Users,
  User,
  Image,
  Book,
  HelpCircle,
  BarChart2,
  Bell,
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle-fixed';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function MainNavigation() {
  // Menu states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const [location] = useLocation();

  // Close menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-trigger')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle keyboard navigation for dropdowns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll events to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle dark mode function
  const toggleTheme = () => {
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    
    if (isDark) {
      // Switch to light mode
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
      setDarkMode(false);
    } else {
      // Switch to dark mode
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
      setDarkMode(true);
    }
  };

  // Handle dropdown clicks
  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Tools menu items
  const tools = [
    { 
      name: 'WCAG Checker',
      path: '/checker',
      icon: Gauge,
      description: 'Test your website against WCAG standards'
    },
    { 
      name: 'Color Palette',
      path: '/tools/colors',
      icon: Palette,
      description: 'Create accessible color combinations'
    },
    { 
      name: 'Color Accessibility Simulator',
      path: '/tools/color-simulator',
      icon: Palette,
      description: 'Test colors for accessibility and simulate color blindness'
    },
    { 
      name: 'WCAG Standards',
      path: '/tools/wcag-standards',
      icon: FileText,
      description: 'Browse WCAG 2.1 standards and requirements'
    },
    { 
      name: 'Image Alt Scanner',
      path: '/tools/image-alt-scanner',
      icon: Image,
      description: 'Find and fix image accessibility issues'
    }
  ];

  // Integrations menu items
  const integrations = [
    {
      name: 'Shopify',
      path: '/integrations/shopify',
      icon: Store,
      description: 'Shopify theme accessibility'
    },
    {
      name: 'WordPress',
      path: '/integrations/wordpress',
      icon: Globe,
      description: 'WordPress site accessibility'
    },
    {
      name: 'Custom API',
      path: '/integrations/api',
      icon: Activity,
      description: 'API integration & webhooks'
    },
    {
      name: 'Compliance',
      path: '/integrations/compliance',
      icon: Shield,
      description: 'Compliance monitoring & reporting'
    },
    {
      name: 'Enterprise',
      path: '/integrations/enterprise',
      icon: Building,
      description: 'Enterprise-grade solutions'
    }
  ];

  // Resources menu items
  const resources = [
    {
      name: 'Documentation',
      path: '/docs',
      icon: Book,
      description: 'Technical guides and API docs'
    },
    {
      name: 'Help Center',
      path: '/help',
      icon: HelpCircle,
      description: 'FAQs and troubleshooting'
    },
    {
      name: 'Non-Destructive Fixes',
      path: '/non-destructive-fixes',
      icon: Zap,
      description: 'CSS-based accessibility fixes'
    },
    {
      name: 'Blog',
      path: '/blog',
      icon: FileText,
      description: 'Articles and updates'
    }
  ];

  // Account menu items
  const accountItems = [
    {
      name: 'Account Dashboard',
      path: '/my-account',
      icon: LayoutDashboard,
      description: 'View your account dashboard'
    },
    {
      name: 'Monitoring & Compliance',
      path: '/my-account/monitoring',
      icon: Activity,
      description: 'Real-time monitoring & compliance'
    },
    {
      name: 'Analytics',
      path: '/my-account/analytics',
      icon: BarChart2,
      description: 'Accessibility analytics and insights'
    },
    {
      name: 'Alerts',
      path: '/my-account/alerts',
      icon: Bell,
      description: 'Configure accessibility alerts'
    },
    {
      name: 'Connections',
      path: '/my-account/connections',
      icon: Globe,
      description: 'Manage API and platform connections'
    },
    {
      name: 'Settings',
      path: '/my-account/settings',
      icon: Settings,
      description: 'Manage account settings'
    },
    {
      name: 'Billing',
      path: '/my-account/billing',
      icon: CreditCard,
      description: 'Manage billing and subscriptions'
    },
    {
      name: 'Team',
      path: '/my-account/team',
      icon: Users,
      description: 'Manage team members'
    }
  ];

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -4,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm' 
          : 'bg-white dark:bg-gray-900'
      }`}
      aria-label="Main navigation"
    >
      {/* Skip to content link - hidden until focused */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:bg-primary focus:text-white focus:z-50 focus:p-4 focus:m-4 focus:rounded-lg"
      >
        Skip to content
      </a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <span className="ml-2 text-xl font-bold text-foreground dark:text-foreground">
                AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <div className="relative dropdown-trigger">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('tools');
                }}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-1"
                aria-expanded={activeDropdown === 'tools'}
                aria-haspopup="true"
              >
                <Settings className="w-5 h-5 mr-1" />
                <span>Tools</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'tools' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {tools.map((tool, index) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <a 
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <tool.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative dropdown-trigger">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('integrations');
                }}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-1"
                aria-expanded={activeDropdown === 'integrations'}
                aria-haspopup="true"
              >
                <Globe className="w-5 h-5 mr-1" />
                <span>Integrations</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'integrations' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'integrations' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {integrations.map((integration, index) => (
                      <Link
                        key={integration.path}
                        href={integration.path}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <a 
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <integration.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                          <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{integration.description}</div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative dropdown-trigger">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('resources');
                }}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-1"
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                <Book className="w-5 h-5 mr-1" />
                <span>Resources</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {resources.map((resource, index) => (
                      <Link
                        key={resource.path}
                        href={resource.path}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <a 
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <resource.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{resource.description}</div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Pricing
            </Link>

            <div className="relative dropdown-trigger">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('account');
                }}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-1"
                aria-expanded={activeDropdown === 'account'}
                aria-haspopup="true"
              >
                <User className="w-5 h-5 mr-1" />
                <span>Account</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'account' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {accountItems.map((item, index) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <a 
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <item.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{darkMode ? "Switch to light mode" : "Switch to dark mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Login / Free trial buttons */}
            <Link href="/login">
              <a className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Login
              </a>
            </Link>

            <Link href="/signup">
              <a className="inline-flex items-center justify-center px-4 py-2 border-none rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0066FF] to-[#0fae96] hover:from-[#0052cc] hover:to-[#0c9a86] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-background transition-all duration-300">
                Start Free Trial
              </a>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-background"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden w-full overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 pt-4 pb-8 space-y-3">
              <Link href="/">
                <a className="block px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  Home
                </a>
              </Link>
              
              {/* Mobile tools accordion */}
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(activeDropdown === 'tools-mobile' ? null : 'tools-mobile');
                  }}
                  className="flex justify-between items-center w-full px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  aria-expanded={activeDropdown === 'tools-mobile'}
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                    <span>Tools</span>
                  </div>
                  <ChevronDown
                    className={`ml-2 h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      activeDropdown === 'tools-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'tools-mobile' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 pl-8 border-l border-gray-200 dark:border-gray-700"
                    >
                      <div className="py-2 space-y-2">
                        {tools.map((tool) => (
                          <Link key={tool.path} href={tool.path}>
                            <a className="flex items-center py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                              <tool.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                              <span>{tool.name}</span>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile integrations accordion */}
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(activeDropdown === 'integrations-mobile' ? null : 'integrations-mobile');
                  }}
                  className="flex justify-between items-center w-full px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  aria-expanded={activeDropdown === 'integrations-mobile'}
                >
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                    <span>Integrations</span>
                  </div>
                  <ChevronDown
                    className={`ml-2 h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      activeDropdown === 'integrations-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'integrations-mobile' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 pl-8 border-l border-gray-200 dark:border-gray-700"
                    >
                      <div className="py-2 space-y-2">
                        {integrations.map((integration) => (
                          <Link key={integration.path} href={integration.path}>
                            <a className="flex items-center py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                              <integration.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                              <span>{integration.name}</span>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile resources accordion */}
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(activeDropdown === 'resources-mobile' ? null : 'resources-mobile');
                  }}
                  className="flex justify-between items-center w-full px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  aria-expanded={activeDropdown === 'resources-mobile'}
                >
                  <div className="flex items-center">
                    <Book className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                    <span>Resources</span>
                  </div>
                  <ChevronDown
                    className={`ml-2 h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      activeDropdown === 'resources-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'resources-mobile' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 pl-8 border-l border-gray-200 dark:border-gray-700"
                    >
                      <div className="py-2 space-y-2">
                        {resources.map((resource) => (
                          <Link key={resource.path} href={resource.path}>
                            <a className="flex items-center py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                              <resource.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                              <span>{resource.name}</span>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link href="/pricing">
                <a className="block px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  Pricing
                </a>
              </Link>
              
              {/* Account items for mobile */}
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(activeDropdown === 'account-mobile' ? null : 'account-mobile');
                  }}
                  className="flex justify-between items-center w-full px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  aria-expanded={activeDropdown === 'account-mobile'}
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                    <span>Account</span>
                  </div>
                  <ChevronDown
                    className={`ml-2 h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      activeDropdown === 'account-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'account-mobile' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-3 pl-8 border-l border-gray-200 dark:border-gray-700"
                    >
                      <div className="py-2 space-y-2">
                        {accountItems.map((item) => (
                          <Link key={item.path} href={item.path}>
                            <a className="flex items-center py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                              <item.icon className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" />
                              <span>{item.name}</span>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Login and signup buttons for mobile */}
              <div className="pt-6 pb-3 space-y-4">
                <Link href="/login">
                  <a className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Login
                  </a>
                </Link>
                
                <Link href="/signup">
                  <a className="block w-full text-center px-4 py-3 rounded-full shadow-sm font-medium text-white bg-gradient-to-r from-[#0066FF] to-[#0fae96] hover:from-[#0052cc] hover:to-[#0c9a86] transition-all duration-300">
                    Start Free Trial
                  </a>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default MainNavigation;