
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessagesPage: React.FC = () => {
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      avatar: "",
      content: "Hello, I wanted to discuss the research grant application.",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Jane Smith",
      avatar: "",
      content: "Please review the updated grant proposal documents.",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Grant Office",
      avatar: "",
      content: "Your application for the Science Innovation Fund has been received.",
      timestamp: "3 days ago",
      unread: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button variant="red" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <span className="text-sm bg-[#cf2e2e] text-white rounded-full px-2 py-1">
                {messages.filter(m => m.unread).length}
              </span>
            </CardTitle>
            <CardDescription>
              <div className="relative">
                <Input 
                  placeholder="Search messages..." 
                  className="pl-8"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    message.unread
                      ? "bg-[#cf2e2e]/10 font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{message.sender}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </p>
                      </div>
                      <p className="text-sm truncate">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
            <CardDescription>
              Select a conversation to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[400px] justify-center items-center text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-sm max-w-md">
                Select a conversation from the list or start a new message to begin chatting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
