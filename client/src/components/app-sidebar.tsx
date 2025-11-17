import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Sprout, 
  Package, 
  Wrench, 
  Beef, 
  DollarSign,
  User,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "dashboard", path: "/dashboard", icon: LayoutDashboard, color: "text-blue-600" },
  { title: "attendance", path: "/attendance", icon: ClipboardCheck, color: "text-purple-600" },
  { title: "cultivation", path: "/cultivation", icon: Sprout, color: "text-green-600" },
  { title: "inventory", path: "/inventory", icon: Package, color: "text-orange-600" },
  { title: "equipment", path: "/equipment", icon: Wrench, color: "text-gray-600" },
  { title: "livestock", path: "/livestock", icon: Beef, color: "text-amber-600" },
  { title: "finance", path: "/finance", icon: DollarSign, color: "text-indigo-600" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base">Farm ERP</span>
            <span className="text-xs text-muted-foreground">Management System</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`link-${item.title}`}>
                      <Link href={item.path}>
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : item.color}`} />
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{user?.fullName}</span>
              <span className="text-xs text-muted-foreground">{user?.role}</span>
            </div>
          </div>
          <Separator />
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            size="sm"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
