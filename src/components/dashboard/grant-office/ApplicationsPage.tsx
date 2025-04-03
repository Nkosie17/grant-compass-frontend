
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { File, Filter, Search } from "lucide-react";

const ApplicationsPage: React.FC = () => {
  const applications = [
    {
      id: 1,
      title: "Impact of Climate Change on Agricultural Productivity",
      researcher: "John Doe",
      department: "Agriculture",
      submittedDate: "2023-10-15",
      amount: "$125,000",
      status: "Under Review",
    },
    {
      id: 2,
      title: "Renewable Energy Solutions for Rural Communities",
      researcher: "Jane Smith",
      department: "Engineering",
      submittedDate: "2023-10-12",
      amount: "$180,000",
      status: "Pending Review",
    },
    {
      id: 3,
      title: "Water Purification Technologies for Developing Nations",
      researcher: "Robert Johnson",
      department: "Environmental Science",
      submittedDate: "2023-10-08",
      amount: "$95,000",
      status: "Under Review",
    },
    {
      id: 4,
      title: "AI Applications in Early Disease Detection",
      researcher: "Emma Wilson",
      department: "Computer Science",
      submittedDate: "2023-09-28",
      amount: "$210,000",
      status: "Approved",
    },
    {
      id: 5,
      title: "Educational Interventions for Marginalized Communities",
      researcher: "David Lee",
      department: "Education",
      submittedDate: "2023-09-20",
      amount: "$75,000",
      status: "Approved",
    },
    {
      id: 6,
      title: "Mental Health Support Systems in Universities",
      researcher: "Sarah Thompson",
      department: "Psychology",
      submittedDate: "2023-09-18",
      amount: "$85,000",
      status: "Rejected",
    },
    {
      id: 7,
      title: "Sustainable Urban Planning for Developing Cities",
      researcher: "Michael Brown",
      department: "Urban Planning",
      submittedDate: "2023-09-15",
      amount: "$150,000",
      status: "Rejected",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grant Applications</h1>
        <div className="flex gap-2">
          <div className="relative w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search applications..." 
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-8 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="review" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="review">Needs Review</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Applications Pending Review</CardTitle>
              <CardDescription>
                Grant applications awaiting review and decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Project</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                </div>
                {applications.filter(app => app.status === "Under Review" || app.status === "Pending Review").map((app) => (
                  <div 
                    key={app.id}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-5 font-medium flex items-center gap-2">
                      <File className="h-4 w-4 text-[#cf2e2e]" />
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-xs text-muted-foreground">{app.department}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback>{app.researcher.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{app.researcher}</span>
                    </div>
                    <div className="col-span-1">
                      {app.amount}
                    </div>
                    <div className="col-span-2">
                      {app.submittedDate}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${app.status === "Under Review" 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"}
                          `}
                        >
                          {app.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {applications.filter(app => app.status === "Under Review" || app.status === "Pending Review").length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <File className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Applications Pending Review</h3>
                  <p className="text-center text-muted-foreground">
                    There are no grant applications awaiting review at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Grant Applications</CardTitle>
              <CardDescription>
                Complete list of all grant applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Project</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                </div>
                {applications.map((app) => (
                  <div 
                    key={app.id}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-5 font-medium flex items-center gap-2">
                      <File className="h-4 w-4 text-[#cf2e2e]" />
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-xs text-muted-foreground">{app.department}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback>{app.researcher.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{app.researcher}</span>
                    </div>
                    <div className="col-span-1">
                      {app.amount}
                    </div>
                    <div className="col-span-2">
                      {app.submittedDate}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${app.status === "Approved" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : app.status === "Under Review"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"}
                          `}
                        >
                          {app.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>1-7</strong> of <strong>7</strong> applications
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                Grant applications that have been approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Project</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {applications.filter(app => app.status === "Approved").map((app) => (
                  <div 
                    key={app.id}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-5 font-medium flex items-center gap-2">
                      <File className="h-4 w-4 text-[#cf2e2e]" />
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-xs text-muted-foreground">{app.department}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback>{app.researcher.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{app.researcher}</span>
                    </div>
                    <div className="col-span-1">
                      {app.amount}
                    </div>
                    <div className="col-span-2">
                      {app.submittedDate}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Process</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {applications.filter(app => app.status === "Approved").length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <File className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Approved Applications</h3>
                  <p className="text-center text-muted-foreground">
                    There are no approved grant applications at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                Grant applications that have been rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Project</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {applications.filter(app => app.status === "Rejected").map((app) => (
                  <div 
                    key={app.id}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-5 font-medium flex items-center gap-2">
                      <File className="h-4 w-4 text-[#cf2e2e]" />
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-xs text-muted-foreground">{app.department}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback>{app.researcher.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{app.researcher}</span>
                    </div>
                    <div className="col-span-1">
                      {app.amount}
                    </div>
                    <div className="col-span-2">
                      {app.submittedDate}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Reconsider</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {applications.filter(app => app.status === "Rejected").length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <File className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Rejected Applications</h3>
                  <p className="text-center text-muted-foreground">
                    There are no rejected grant applications at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;
