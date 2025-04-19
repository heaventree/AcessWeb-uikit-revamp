import {
  CreditCard,
  Settings,
  Bell,
  Users,
  Activity,
  BarChart2,
  MonitorPlay,
  Gauge
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export function AccountLayout() {
  const menuItems = [
    {
      path: "/my-account",
      label: "Overview",
      icon: <Gauge className="w-5 h-5" />,
      end: true
    },
    {
      path: "/my-account/monitoring",
      label: "Monitoring",
      icon: <MonitorPlay className="w-5 h-5" />
    },
    {
      path: "/my-account/analytics",
      label: "Analytics",
      icon: <BarChart2 className="w-5 h-5" />
    },
    {
      path: "/my-account/alerts",
      label: "Alerts",
      icon: <Bell className="w-5 h-5" />
    },
    {
      path: "/my-account/connections",
      label: "Connections",
      icon: <Activity className="w-5 h-5" />
    },
    {
      path: "/my-account/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />
    },
    {
      path: "/my-account/billing",
      label: "Billing",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      path: "/my-account/team",
      label: "Team",
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      title="Account"
      showBackToHome={false}
      notifications={3}
      userName="John Doe"
    />
  );
}