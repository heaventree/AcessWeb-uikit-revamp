import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface DashboardLayoutProps {
  menuItems: MenuItem[];
  title: string;
  showBackToHome?: boolean;
  notifications?: number;
  userAvatar?: string;
  userName?: string;
}

export function DashboardLayout({
  menuItems,
  title,
  showBackToHome = false,
  notifications = 0,
  userAvatar = '',
  userName = 'User'
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-white dark:bg-gray-800 p-2 m-2 text-primary-600 dark:text-primary-400">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white dark:bg-card-bg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left section: Logo and hamburger */}
          <div className="flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="mr-2 text-gray-500 dark:text-gray-400 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 dark:text-gray-400 hidden md:block"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center">
              <Link 
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              >
                AccessWeb
              </Link>
              <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-1">
                {title}
              </span>
            </div>
          </div>

          {/* Right section: Search, Notifications, Settings, Theme, Avatar */}
          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search..." 
              />
            </div>

            <button 
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            <button 
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>

            <ThemeToggle />

            {/* User Avatar/Info */}
            <div className="relative hidden md:block mr-2">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={`${userName}'s avatar`} 
                    className="w-8 h-8 rounded-full" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-sm font-medium">
                    {userName.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium">{userName}</span>
              </button>
            </div>

            <div className="relative">
              <button 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-card-bg border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <nav className="space-y-2 mt-2">
            {showBackToHome && (
              <>
                <NavLink
                  to="/"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {sidebarOpen && <span>Back to Home</span>}
                  </span>
                </NavLink>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              </>
            )}

            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex items-center">
                  <span className={sidebarOpen ? 'mr-3' : ''}>{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50">
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Menu</h2>
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {showBackToHome && (
                <>
                  <NavLink
                    to="/"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Back to Home</span>
                    </span>
                  </NavLink>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                </>
              )}

              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main 
        id="main-content" 
        className={`pt-16 min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'md:pl-64' 
            : 'md:pl-20'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}