import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, Check, CheckCheck, Filter, MessageSquare, Search } from "lucide-react";
import { Notification } from "@/types/grants";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SendNotificationForm from "./SendNotificationForm";

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch notifications from local storage
    const fetchNotifications = () => {
      try {
        const storedNotifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
        // Filter notifications for current user
        const userNotifications = storedNotifications.filter(
          (notification: Notification) => notification.userId === user?.id || notification.userId === "all"
        );
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update local storage
    const allNotifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
    const updatedAllNotifications = allNotifications.map((notification: Notification) => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    localStorage.setItem("au_gms_notifications", JSON.stringify(updatedAllNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
    setNotifications(updatedNotifications);
    
    // Update local storage
    const allNotifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
    const updatedAllNotifications = allNotifications.map((notification: Notification) => 
      notification.userId === user?.id || notification.userId === "all" 
        ? { ...notification, isRead: true } 
        : notification
    );
    localStorage.setItem("au_gms_notifications", JSON.stringify(updatedAllNotifications));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type and related content
    if (notification.relatedType && notification.relatedId) {
      switch (notification.relatedType) {
        case "grant":
          navigate(`/my-grants/${notification.relatedId}`);
          break;
        case "report":
          navigate(`/reports/${notification.relatedId}`);
          break;
        case "opportunity":
          navigate(`/opportunities/${notification.relatedId}`);
          break;
        case "event":
          navigate(`/calendar`);
          break;
        default:
          break;
      }
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(notification => 
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (activeTab === "due_dates") {
      filtered = filtered.filter(notification => notification.type === "due_date");
    } else if (activeTab === "status") {
      filtered = filtered.filter(notification => notification.type === "status_update");
    }
    
    return filtered;
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "due_date":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case "report_submission":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "status_update":
        return <Check className="h-4 w-4 text-green-500" />;
      case "opportunity":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "due_date":
        return "Deadline Reminder";
      case "report_submission":
        return "Report Submission";
      case "status_update":
        return "Status Update";
      case "opportunity":
        return "New Opportunity";
      case "grant_response":
        return "Grant Application Update";
      case "ip_update":
        return "IP Update";
      default:
        return "Notification";
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important information and alerts
          </p>
        </div>
        
        {user?.role === "grant_office" || user?.role === "admin" ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="red" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to researchers or specific users
                </DialogDescription>
              </DialogHeader>
              <SendNotificationForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <Tabs 
          defaultValue="all" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {notifications.filter(n => !n.isRead).length > 0 && (
                <Badge className="ml-1 bg-[#cf2e2e]">
                  {notifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="due_dates">Deadlines</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notifications..." 
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row justify-between items-center">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {filteredNotifications.length} notifications
            </CardDescription>
          </div>
          {notifications.some(n => !n.isRead) && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4 pt-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                  } ${notification.relatedId ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={() => notification.relatedId ? handleNotificationClick(notification) : null}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`rounded-full p-2 ${!notification.isRead ? "bg-blue-100" : "bg-gray-100"}`}>
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{notification.message}</p>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            {getNotificationTypeIcon(notification.type)}
                            <span className="ml-1">{getNotificationTypeText(notification.type)}</span>
                          </span>
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                          {notification.relatedId && (
                            <span className="text-blue-600 underline">View details</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm max-w-md">
                You don't have any notifications at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
