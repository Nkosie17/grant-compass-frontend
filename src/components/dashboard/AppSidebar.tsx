
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Home,
  File,
  MessageSquare,
  BarChart2,
  Calendar,
  Settings,
  LogOut,
  Users,
  FileText,
  Search,
  Bell,
} from "lucide-react";

export const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const isActiveRoute = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const menuItems = (() => {
    // Base menu items for all roles
    const baseItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Home className="h-4 w-4 mr-2" />,
      },
      {
        name: "Messages",
        path: "/messages",
        icon: <MessageSquare className="h-4 w-4 mr-2" />,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <Settings className="h-4 w-4 mr-2" />,
      },
    ];

    // Role-specific menu items
    switch (user.role) {
      case "researcher":
        return [
          ...baseItems,
          {
            name: "My Grants",
            path: "/my-grants",
            icon: <File className="h-4 w-4 mr-2" />,
          },
          {
            name: "Find Opportunities",
            path: "/opportunities",
            icon: <Search className="h-4 w-4 mr-2" />,
          },
          {
            name: "Reports",
            path: "/reports",
            icon: <FileText className="h-4 w-4 mr-2" />,
          },
          {
            name: "Calendar",
            path: "/calendar",
            icon: <Calendar className="h-4 w-4 mr-2" />,
          },
        ];
      case "grant_office":
        return [
          ...baseItems,
          {
            name: "Applications",
            path: "/applications",
            icon: <File className="h-4 w-4 mr-2" />,
          },
          {
            name: "Reporting",
            path: "/reporting",
            icon: <BarChart2 className="h-4 w-4 mr-2" />,
          },
          {
            name: "Financial Management",
            path: "/finance",
            icon: <FileText className="h-4 w-4 mr-2" />,
          },
          {
            name: "Call-for-Proposals",
            path: "/proposals",
            icon: <Calendar className="h-4 w-4 mr-2" />,
          },
        ];
      case "admin":
        return [
          ...baseItems,
          {
            name: "User Management",
            path: "/users",
            icon: <Users className="h-4 w-4 mr-2" />,
          },
          {
            name: "System Reports",
            path: "/system-reports",
            icon: <BarChart2 className="h-4 w-4 mr-2" />,
          },
          {
            name: "Settings",
            path: "/admin-settings",
            icon: <Settings className="h-4 w-4 mr-2" />,
          },
        ];
      default:
        return baseItems;
    }
  })();

  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader className="border-b py-3 px-4 flex justify-between items-center bg-[#cf2e2e] text-white">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/4af217f9-8ca2-4acc-8ba4-9320b16cf567.png" 
            alt="Africa University" 
            className="h-8"
          />
          <span className="text-lg font-semibold">AU Grant</span>
        </div>
        <SidebarTrigger className="text-white" />
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                isActiveRoute(item.path)
                  ? "bg-[#cf2e2e]/10 text-[#cf2e2e] font-medium"
                  : "text-au-neutral-600 hover:bg-au-neutral-100"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center mb-4 space-x-3">
          <Avatar>
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role.replace("_", " ")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
