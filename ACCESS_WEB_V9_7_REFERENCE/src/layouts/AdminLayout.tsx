import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  CreditCard,
  FileEdit,
  Wallet,
  List,
  Bug,
  MessageSquare
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export function AdminLayout() {
  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true
    },
    {
      path: "/admin/packages",
      label: "Packages",
      icon: <Package className="w-5 h-5" />
    },
    {
      path: "/admin/clients",
      label: "Clients",
      icon: <Users className="w-5 h-5" />
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: <FileText className="w-5 h-5" />
    },
    {
      path: "/admin/payments",
      label: "Payments",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      path: "/admin/payment-gateways",
      label: "Payment Gateways",
      icon: <Wallet className="w-5 h-5" />
    },
    {
      path: "/admin/cms",
      label: "CMS",
      icon: <FileEdit className="w-5 h-5" />
    },
    {
      path: "/admin/roadmap",
      label: "Roadmap Items",
      icon: <List className="w-5 h-5" />
    },
    {
      path: "/admin/debug",
      label: "Debug List",
      icon: <Bug className="w-5 h-5" />
    },
    {
      path: "/admin/completion",
      label: "Project Completion",
      icon: <FileText className="w-5 h-5" />
    },
    {
      path: "/admin/chatbot",
      label: "Chatbot Management",
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      title="Admin"
      showBackToHome={true}
      notifications={5}
      userName="Admin User"
    />
  );
}