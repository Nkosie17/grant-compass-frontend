
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

const CalendarPage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const events = [
    {
      id: 1,
      title: "Grant Application Deadline",
      date: "2023-11-15",
      time: "11:59 PM",
      type: "deadline",
      description: "Final deadline for the Climate Research Fund application",
    },
    {
      id: 2,
      title: "Progress Report Due",
      date: "2023-11-20",
      time: "5:00 PM",
      type: "report",
      description: "Quarterly progress report for Urban Development Grant",
    },
    {
      id: 3,
      title: "Grant Panel Review Meeting",
      date: "2023-11-22",
      time: "10:00 AM - 12:00 PM",
      type: "meeting",
      description: "Panel review of renewable energy research proposals",
    },
    {
      id: 4,
      title: "Workshop: Grant Writing Best Practices",
      date: "2023-11-28",
      time: "2:00 PM - 4:00 PM",
      type: "workshop",
      description: "Learn effective strategies for successful grant applications",
    },
  ];

  // Format today's date to display current events
  const today = new Date().toISOString().split('T')[0];
  const todaysEvents = events.filter(event => event.date === today);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Research Calendar</h1>
        <Button variant="red" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>
                Track important dates and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaysEvents.length > 0 ? (
                <div className="space-y-3">
                  {todaysEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="border rounded-lg p-3 hover:border-[#cf2e2e]/30 hover:bg-[#cf2e2e]/5 transition-colors"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                      <p className="text-sm mt-1">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <p>No events scheduled for today</p>
                  <Button variant="outline" className="mt-2" size="sm">
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Grants deadlines, reporting due dates, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:border-[#cf2e2e]/30 hover:bg-[#cf2e2e]/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        event.type === "deadline" 
                          ? "bg-red-100 text-red-800" 
                          : event.type === "report"
                          ? "bg-yellow-100 text-yellow-800"
                          : event.type === "meeting"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-2 text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
