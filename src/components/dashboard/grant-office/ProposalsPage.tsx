
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Plus, Search } from "lucide-react";

const ProposalsPage: React.FC = () => {
  const proposals = [
    {
      id: 1,
      title: "Climate Change Research Initiative",
      description: "Funding for innovative research addressing climate change impacts in Africa.",
      deadline: "2023-12-15",
      amount: "$50,000 - $250,000",
      category: "Environmental Science",
      status: "Open",
    },
    {
      id: 2,
      title: "Agricultural Innovation Grant",
      description: "Support for developing sustainable agricultural practices and technologies.",
      deadline: "2023-11-30",
      amount: "$25,000 - $100,000",
      category: "Agriculture",
      status: "Open",
    },
    {
      id: 3,
      title: "Public Health Research Fund",
      description: "Grants supporting research on pressing public health challenges.",
      deadline: "2023-12-01",
      amount: "$75,000 - $200,000",
      category: "Health Sciences",
      status: "Open",
    },
    {
      id: 4,
      title: "Education Technology Development",
      description: "Funding for innovative educational technology solutions.",
      deadline: "2024-01-15",
      amount: "$20,000 - $80,000",
      category: "Education",
      status: "Draft",
    },
    {
      id: 5,
      title: "Renewable Energy Solutions",
      description: "Supporting research and development of sustainable energy solutions.",
      deadline: "2023-10-30",
      amount: "$100,000 - $300,000",
      category: "Engineering",
      status: "Closed",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Call for Proposals</h1>
        <Button variant="red" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Call
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="active">Active Calls</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search calls..." 
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-8 w-full"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.filter(p => p.status === "Open").map((proposal) => (
              <Card key={proposal.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">
                      {proposal.category}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Open
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proposal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{proposal.deadline}</span>
                  </div>
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium ml-1">{proposal.amount}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button variant="red" className="flex-1">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center h-[280px] cursor-pointer hover:border-[#cf2e2e]/30 hover:bg-[#cf2e2e]/5 transition-colors">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Create New Call</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Set up a new call for research proposals
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.filter(p => p.status === "Draft").map((proposal) => (
              <Card key={proposal.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">
                      {proposal.category}
                    </Badge>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      Draft
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proposal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{proposal.deadline}</span>
                  </div>
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium ml-1">{proposal.amount}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button variant="red" className="flex-1">Publish</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {proposals.filter(p => p.status === "Draft").length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Draft Calls</h3>
              <p className="text-center text-muted-foreground max-w-sm mb-6">
                You don't have any draft calls for proposals. Create a new one to get started.
              </p>
              <Button variant="red" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Call
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.filter(p => p.status === "Closed").map((proposal) => (
              <Card key={proposal.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mb-2">
                      {proposal.category}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                      Closed
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proposal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ended:</span>
                    <span className="font-medium">{proposal.deadline}</span>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium ml-1">{proposal.amount}</span>
                  </div>
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium ml-1">{Math.floor(Math.random() * 20) + 5}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Review</Button>
                    <Button variant="outline" className="flex-1">Archive</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {proposals.filter(p => p.status === "Closed").length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Closed Calls</h3>
              <p className="text-center text-muted-foreground max-w-sm">
                You don't have any closed calls for proposals yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalsPage;
