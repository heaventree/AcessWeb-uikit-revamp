import { useState } from 'react';
import { format } from 'date-fns';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Settings,
  Bell,
  Users,
  Activity,
  Menu,
  BarChart2,
  MonitorPlay,
  Gauge,
  XCircle,
  LogOut,
  Home
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

// Mock subscription data
const subscription = {
  plan: 'Professional',
  status: 'active',
  nextBilling: new Date(2024, 2, 15),
};

export function AccountLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation items for the account sidebar
  const navigationItems = [
    { name: 'Overview', icon: Gauge, value: 'overview', path: '/my-account' },
    { name: 'Monitoring', icon: MonitorPlay, value: 'monitoring', path: '/my-account/monitoring' },
    { name: 'Analytics', icon: BarChart2, value: 'analytics', path: '/my-account/analytics' },
    { name: 'Alerts', icon: Bell, value: 'alerts', path: '/my-account/alerts' },
    { name: 'Connections', icon: Activity, value: 'connections', path: '/my-account/connections' },
    { name: 'Settings', icon: Settings, value: 'settings', path: '/my-account/settings' },
    { name: 'Billing', icon: CreditCard, value: 'billing', path: '/my-account/billing' },
    { name: 'Team', icon: Users, value: 'team', path: '/my-account/team' }
  ];

  // Helper function to check if the current path is active
  const isActive = (path: string) => {
    // Handle the root account path differently
    if (path === '/my-account' && location.pathname === '/my-account') {
      return true;
    }
    
    // For other paths, check if the current location starts with the path
    return location.pathname !== '/my-account' && location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AccessWeb
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                <Bell className="w-6 h-6" />
              </button>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 transition duration-300 ease-in-out md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">My Account</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Home className="w-5 h-5 mr-3" />
            Back to Home
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          
          {navigationItems.map((item) => (
            <Link
              key={item.value}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          
          <div className="mt-6 px-4">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                <span className="ml-2 text-sm font-medium text-blue-700 dark:text-blue-300">Current Plan</span>
              </div>
              <p className="mt-1 text-lg font-medium text-blue-900 dark:text-blue-200">{subscription.plan}</p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
              <button
                className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg pt-16 hidden md:block">
        <nav className="mt-5 px-2">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3"
          >
            <Home className="w-5 h-5 mr-3" />
            Back to Home
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          
          {navigationItems.map((item) => (
            <Link
              key={item.value}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          
          <div className="mt-6 px-4">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                <span className="ml-2 text-sm font-medium text-blue-700 dark:text-blue-300">Current Plan</span>
              </div>
              <p className="mt-1 text-lg font-medium text-blue-900 dark:text-blue-200">{subscription.plan}</p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
              <button
                className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main id="main-content" className="md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto py-6 px-4">
          {/* Mobile menu toggle button */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              className="flex items-center text-gray-500 hover:text-gray-600"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 mr-2" />
              <span>Menu</span>
            </button>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}