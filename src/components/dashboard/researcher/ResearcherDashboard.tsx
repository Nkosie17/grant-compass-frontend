
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RESEARCHER_GRANTS } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ArrowRight, FileText, Calendar, BarChart2, Search } from "lucide-react";

const ResearcherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const activeGrants = RESEARCHER_GRANTS.filter(grant => 
    grant.status === "active" || grant.status === "approved"
  );
  
  const pendingGrants = RESEARCHER_GRANTS.filter(grant => 
    grant.status === "submitted" || grant.status === "under_review" || grant.status === "modifications_requested"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-orange-100 text-orange-800";
      case "modifications_requested":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title={`Welcome, ${user.name}`}
        subtitle="Researcher Dashboard"
      />
      
      <div className="p-6 flex-1">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-hover col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" className="w-full bg-au-purple hover:bg-au-purple-dark mb-2">
                <Link to="/new-application">Start New Application</Link>
              </Button>
              <p className="text-sm text-muted-foreground">Begin a new grant application</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" variant="outline" className="w-full mb-2">
                <Link to="/opportunities">
                  <Search className="h-4 w-4 mr-2" />
                  Find Opportunities
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Browse available grants</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" variant="outline" className="w-full mb-2">
                <Link to="/reports/new">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Report
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">For active grants</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" variant="outline" className="w-full mb-2">
                <Link to="/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">See upcoming deadlines</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Grants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeGrants.length}</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(
                  activeGrants.reduce((total, grant) => total + grant.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingGrants.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Active and Pending Grants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Active Grants</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-au-purple">
                  <Link to="/my-grants" className="flex items-center">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Your currently active grant projects</CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {activeGrants.length > 0 ? (
                <div className="space-y-4">
                  {activeGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className="border rounded-lg p-4 hover:bg-au-neutral-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{grant.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grant.status)}`}>
                          {grant.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {grant.description.length > 100
                          ? `${grant.description.substring(0, 100)}...`
                          : grant.description}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{formatCurrency(grant.amount)}</span>
                        <span>
                          {grant.startDate} - {grant.endDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  You have no active grants at this time.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Pending Applications</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-au-purple">
                  <Link to="/my-grants" className="flex items-center">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Your submitted grant applications</CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {pendingGrants.length > 0 ? (
                <div className="space-y-4">
                  {pendingGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className="border rounded-lg p-4 hover:bg-au-neutral-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{grant.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grant.status)}`}>
                          {grant.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {grant.description.length > 100
                          ? `${grant.description.substring(0, 100)}...`
                          : grant.description}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{formatCurrency(grant.amount)}</span>
                        <span>Submitted: {grant.submittedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  You have no pending applications.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
