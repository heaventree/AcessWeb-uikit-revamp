import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Gauge, Palette, FileText, Zap, Settings, Store, Globe, Activity, ActivitySquare, Book, HelpCircle, BarChart2, Bell, Shield, Building, LayoutDashboard, CreditCard, Users, User, Image } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { FeedbackToggle } from './FeedbackToggle';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Close menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle body scroll lock
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

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

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

  const integrations = [
    {
      name: 'Shopify',
      path: '/integrations/shopify',
      icon: Store,
      description: 'Shopify theme accessibility'
    },
    {
      name: 'WordPress',
      path: '/wordpressint',
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
      icon: ActivitySquare,
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

  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.2,
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
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AccessWeb
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</Link>
            <div className="relative dropdown-trigger">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('tools');
                }}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Settings className="w-5 h-5 mr-2" />
                Tools
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'tools' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    {tools.map(tool => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <tool.icon className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.description}</div>
                        </div>
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
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-4"
              >
                <Globe className="w-5 h-5 mr-2" />
                Integrations
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'integrations' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'integrations' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    {integrations.map(integration => (
                      <Link
                        key={integration.path}
                        to={integration.path}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <integration.icon className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-xs text-gray-500">{integration.description}</div>
                        </div>
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
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Book className="w-5 h-5 mr-2" />
                Resources
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    {resources.map(resource => (
                      <Link
                        key={resource.path}
                        to={resource.path}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <resource.icon className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link>

            <div className="relative dropdown-trigger">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('account');
                }}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="w-5 h-5 mr-2" />
                My Account
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'account' && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    {accountItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <div className="ml-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <HelpCircle className="w-5 h-5" />
            </Link>
            <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Settings className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            <FeedbackToggle />
            <Link
              to="/signup"
              className="ml-8 inline-flex items-center justify-center px-4 py-2 border-none rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded={isMenuOpen}
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-900"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                {tools.map(tool => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <tool.icon className="w-5 h-5 mr-3" />
                      {tool.name}
                    </div>
                  </Link>
                ))}
                {integrations.map(integration => (
                  <Link
                    key={integration.path}
                    to={integration.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <integration.icon className="w-5 h-5 mr-3" />
                      {integration.name}
                    </div>
                  </Link>
                ))}
                {resources.map(resource => (
                  <Link
                    key={resource.path}
                    to={resource.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <resource.icon className="w-5 h-5 mr-3" />
                      {resource.name}
                    </div>
                  </Link>
                ))}
                <Link
                  to="/pricing"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    Admin
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white border-none bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Free Trial
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}