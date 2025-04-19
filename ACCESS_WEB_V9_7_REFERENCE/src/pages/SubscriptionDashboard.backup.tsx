import { useState } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Settings,
  FileText,
  Bell,
  Users,
  Activity,
  Download,
  Calendar,
  BarChart2,
  AlertOctagon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LineChart,
  RefreshCw,
  Shield,
  Layers,
  MonitorPlay,
  Gauge,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for monitoring and analytics
const monitoringData = {
  configs: [
    {
      id: 'mon-1',
      site_id: 'example.com',
      frequency: 'daily',
      enabled: true,
      last_check: new Date().toISOString(),
      notification_email: 'admin@example.com',
      excluded_paths: ['/admin/*']
    },
    {
      id: 'mon-2',
      site_id: 'testsite.org',
      frequency: 'weekly',
      enabled: false,
      last_check: new Date().toISOString(),
      notification_email: 'admin@example.com',
      excluded_paths: []
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      message: 'Missing alt text on images',
      type: 'error',
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      data: { url: 'https://example.com/about', elements: 5, duration: 2200 }
    },
    {
      id: 'alert-2',
      message: 'Low contrast text detected',
      type: 'warning',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      acknowledged_at: null,
      data: { url: 'https://example.com/home', elements: 2, duration: 1800 }
    },
    {
      id: 'alert-3',
      message: 'Site check completed successfully',
      type: 'info',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      acknowledged_at: new Date(Date.now() - 86400000).toISOString(),
      data: { url: 'https://example.com', duration: 2500 }
    }
  ]
};

const analyticsData = {
  chartData: [
    { date: '01/01', issues: 24, fixes: 10, compliance: 65 },
    { date: '01/08', issues: 18, fixes: 14, compliance: 72 },
    { date: '01/15', issues: 15, fixes: 5, compliance: 75 },
    { date: '01/22', issues: 12, fixes: 8, compliance: 80 },
    { date: '01/29', issues: 10, fixes: 6, compliance: 85 },
    { date: '02/05', issues: 8, fixes: 7, compliance: 90 }
  ],
  issuesByType: [
    { name: 'Contrast', value: 32 },
    { name: 'Alt Text', value: 28 },
    { name: 'ARIA', value: 18 },
    { name: 'Keyboard', value: 12 },
    { name: 'Other', value: 10 }
  ]
};

export function SubscriptionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Navigation items
  const navigationItems = [
    { name: 'Overview', icon: Gauge, value: 'overview' },
    { name: 'Monitoring', icon: MonitorPlay, value: 'monitoring' },
    { name: 'Analytics', icon: BarChart2, value: 'analytics' },
    { name: 'Alerts', icon: Bell, value: 'alerts' },
    { name: 'Connections', icon: Activity, value: 'connections', path: '/my-account/connections' },
    { name: 'Settings', icon: Settings, value: 'settings', path: '/my-account/settings' },
    { name: 'Billing', icon: CreditCard, value: 'billing', path: '/my-account/billing' },
    { name: 'Team', icon: Users, value: 'team', path: '/my-account/team' }
  ];
  
  const subscription = {
    plan: 'Professional',
    status: 'active',
    nextBilling: new Date(2024, 2, 15),
    paymentMethod: '**** **** **** 4242',
    usageStats: {
      scansThisMonth: 45,
      totalScans: 156,
      pagesScanned: 225,
      teamMembers: 3
    },
    recentScans: [
      {
        id: 1,
        url: 'https://example.com',
        date: new Date(2024, 1, 28),
        issues: 12
      },
      {
        id: 2,
        url: 'https://test.com',
        date: new Date(2024, 1, 27),
        issues: 5
      }
    ]
  };

  // Helper function for alert icons
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 flex h-full">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          mobileSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Account Dashboard</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="overflow-y-auto pt-4">
            <nav className="flex-1 space-y-1 px-2">
              {navigationItems.map((item) => (
                item.path ? (
                  <Link
                    key={item.value}
                    to={item.path}
                    className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                      activeTab === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        activeTab === item.value
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.value}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-base font-medium ${
                      activeTab === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveTab(item.value);
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        activeTab === item.value
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </button>
                )
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="ml-2 text-sm font-medium text-blue-800">Current Plan</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-blue-900">{subscription.plan}</p>
              <p className="mt-1 text-xs text-blue-700">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-col px-4 pt-5">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Account Dashboard</h1>
            </div>
            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => (
                item.path ? (
                  <Link
                    key={item.value}
                    to={item.path}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      activeTab === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        activeTab === item.value
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.value}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                      activeTab === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab(item.value)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        activeTab === item.value
                          ? 'text-gray-900'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </button>
                )
              ))}
            </nav>
            <div className="mt-auto py-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-blue-800">Current Plan</span>
                </div>
                <p className="mt-1 text-lg font-semibold text-blue-900">{subscription.plan}</p>
                <p className="mt-1 text-xs text-blue-700">
                  Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
                </p>
                <button
                  className="mt-3 w-full rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top nav */}
        <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 md:hidden">
                {navigationItems.find((item) => item.value === activeTab)?.name}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
                    John Doe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 pb-10">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Content header with action buttons */}
              <div className="border-b border-gray-200 pb-4 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="hidden text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl md:block">
                    {navigationItems.find((item) => item.value === activeTab)?.name}
                  </h2>
                </div>
                <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </button>
                  )}
                  {activeTab === 'monitoring' && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Add Monitor
                    </button>
                  )}
                  {activeTab === 'analytics' && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </button>
                  )}
                  {activeTab === 'alerts' && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Acknowledge All
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="mt-6 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Scans This Month
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {subscription.usageStats.scansThisMonth}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                            <Calendar className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Total Scans
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {subscription.usageStats.totalScans}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-indigo-100 p-3">
                            <Download className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Pages Scanned
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {subscription.usageStats.pagesScanned}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Team Members
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {subscription.usageStats.teamMembers}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
                      <Link
                        to="/my-account/settings"
                        className="flex flex-col items-center p-6 hover:bg-gray-50"
                      >
                        <Settings className="mb-3 h-8 w-8 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Settings</span>
                      </Link>
                      <Link
                        to="/my-account/billing"
                        className="flex flex-col items-center p-6 hover:bg-gray-50"
                      >
                        <FileText className="mb-3 h-8 w-8 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Billing History</span>
                      </Link>
                      <Link
                        to="/my-account/alerts"
                        className="flex flex-col items-center p-6 hover:bg-gray-50"
                      >
                        <Bell className="mb-3 h-8 w-8 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Notifications</span>
                      </Link>
                      <Link
                        to="/my-account/team"
                        className="flex flex-col items-center p-6 hover:bg-gray-50"
                      >
                        <Users className="mb-3 h-8 w-8 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Team</span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Recent Scans */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Scans</h3>
                      <Link
                        to="/checker"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Run a new scan
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              URL
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Issues
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {subscription.recentScans.map((scan) => (
                            <tr key={scan.id}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {scan.url}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {format(scan.date, 'MMM d, yyyy')}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  {scan.issues} issues
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900">
                                  View Report
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Monitoring Tab */}
              {activeTab === 'monitoring' && (
                <div className="mt-6 space-y-6">
                  {/* Monitoring Content */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Monitoring Status Cards */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Active Monitors
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {monitoringData.configs.filter(c => c.enabled).length}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Success Rate
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {monitoringData.alerts.length ? 
                                  `${((monitoringData.alerts.filter(a => a.type === 'info').length / monitoringData.alerts.length) * 100).toFixed(1)}%` 
                                  : '0%'}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                            <AlertOctagon className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Issues Found
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {monitoringData.alerts.filter(a => a.type === 'error').length}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                            <Clock className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Avg Response Time
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">
                                {monitoringData.alerts.length ? 
                                  `${(monitoringData.alerts.reduce((sum, alert) => sum + (alert.data.duration || 0), 0) / monitoringData.alerts.length / 1000).toFixed(1)}s` 
                                  : '0s'}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monitoring Configurations */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Monitoring Configurations</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Site ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Frequency
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Last Check
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {monitoringData.configs.map((config) => (
                            <tr key={config.id}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {config.site_id}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {config.frequency}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <span 
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {config.enabled ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {new Date(config.last_check).toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                <button className="mr-4 text-blue-600 hover:text-blue-900">Edit</button>
                                <button 
                                  className={config.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                                >
                                  {config.enabled ? 'Disable' : 'Enable'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 text-right sm:px-6">
                      <Link to="/my-account/monitoring" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View detailed monitoring dashboard →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="mt-6 space-y-6">
                  {/* Analytics Content */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-indigo-100 p-3">
                            <Shield className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Compliance Score
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">85%</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                            <Layers className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Issues Fixed
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">42</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Outstanding Issues
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">18</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                            <LineChart className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="truncate text-sm font-medium text-gray-500">
                                Improvement Rate
                              </dt>
                              <dd className="text-2xl font-semibold text-gray-900">+12%</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Charts */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Compliance Trend</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Chart: Compliance trend over time</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 text-right sm:px-6">
                      <Link to="/my-account/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View detailed analytics reports →
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Issues by Type</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Chart: Issues distribution by category</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="mt-6 space-y-6">
                  {/* Alerts Content */}
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Alerts</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {monitoringData.alerts.map((alert) => (
                        <li key={alert.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(alert.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                {alert.data.url}
                                {alert.data.elements && ` (${alert.data.elements} elements affected)`}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-gray-50 px-4 py-4 text-right sm:px-6">
                      <Link to="/my-account/alerts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View all alerts →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}