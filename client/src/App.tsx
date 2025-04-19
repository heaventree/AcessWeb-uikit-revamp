import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppShell from "@/components/shell/AppShell";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function Router() {
  const [location] = useLocation();
  
  // Determine if we're on the landing page
  const isLandingPage = location === "/";
  
  if (isLandingPage) {
    // For the landing page, don't use the app shell
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  // For all other pages, use the app shell
  return (
    <AppShell title="AccessWebPro">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the AccessWebPro dashboard. Your accessibility compliance reports will appear here.
            </p>
          </div>
        </Route>
        <Route path="/reports">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View detailed accessibility reports for your websites here.
            </p>
          </div>
        </Route>
        <Route path="/wcag-checker">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">WCAG Checker</h1>
            <p className="text-muted-foreground">
              Test your website against WCAG 2.1 accessibility standards.
            </p>
          </div>
        </Route>
        <Route path="/settings">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AccessWebPro account settings.
            </p>
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="accessweb-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
