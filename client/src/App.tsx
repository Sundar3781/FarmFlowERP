import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";

// Pages
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import AttendancePage from "@/pages/attendance";
import CultivationPage from "@/pages/cultivation";
import InventoryPage from "@/pages/inventory";
import EquipmentPage from "@/pages/equipment";
import LivestockPage from "@/pages/livestock";
import FinancePage from "@/pages/finance";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardPage} />
      </Route>
      <Route path="/attendance">
        <ProtectedRoute component={AttendancePage} />
      </Route>
      <Route path="/cultivation">
        <ProtectedRoute component={CultivationPage} />
      </Route>
      <Route path="/inventory">
        <ProtectedRoute component={InventoryPage} />
      </Route>
      <Route path="/equipment">
        <ProtectedRoute component={EquipmentPage} />
      </Route>
      <Route path="/livestock">
        <ProtectedRoute component={LivestockPage} />
      </Route>
      <Route path="/finance">
        <ProtectedRoute component={FinancePage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Router />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <LanguageToggle />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <AppLayout />
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
