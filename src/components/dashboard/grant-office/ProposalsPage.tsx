
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GrantOpportunity } from "@/types/grants";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Trash2, 
  Edit, 
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProposalsPage: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch grant opportunities from localStorage (in a real app, this would be an API call)
    const fetchOpportunities = () => {
      try {
        const storedOpportunities = JSON.parse(localStorage.getItem("au_gms_opportunities") || "[]");
        setOpportunities(storedOpportunities);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  const handleCreateOpportunity = () => {
    navigate("/create-opportunity");
  };

  const handleDeleteOpportunity = (id: string) => {
    try {
      // Filter out the deleted opportunity
      const updatedOpportunities = opportunities.filter(opp => opp.id !== id);
      
      // Update local state
      setOpportunities(updatedOpportunities);
      
      // Update localStorage
      localStorage.setItem("au_gms_opportunities", JSON.stringify(updatedOpportunities));
      
      // Show success message
      toast.success("Grant opportunity deleted successfully");
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      toast.error("Failed to delete opportunity");
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => 
    opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUpcoming = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Call for Proposals</h1>
          <p className="text-muted-foreground">Manage grant opportunities and calls for proposals</p>
        </div>
        <Button onClick={handleCreateOpportunity}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Opportunity
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search opportunities..." 
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map(opportunity => (
            <Card key={opportunity.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant={opportunity.fundingSource === "internal" ? "default" : "outline"}
                    className="mb-2"
                  >
                    {opportunity.fundingSource === "internal" ? "Internal" : "External"}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this grant opportunity.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90" 
                            onClick={() => handleDeleteOpportunity(opportunity.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-xs ${isUpcoming(opportunity.deadline) ? 'text-muted-foreground' : 'text-red-500'}`}>
                    {isUpcoming(opportunity.deadline) 
                      ? `Deadline: ${new Date(opportunity.deadline).toLocaleDateString()}` 
                      : `Expired: ${new Date(opportunity.deadline).toLocaleDateString()}`}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {opportunity.description}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">${opportunity.fundingAmount.toLocaleString()}</span>
                  <Badge variant="secondary">
                    {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                  </Badge>
                </div>
              </CardContent>
              <div className="p-3 pt-0 flex justify-end">
                {opportunity.applicationUrl ? (
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    External Application
                  </Button>
                ) : (
                  <Button size="sm" className="w-full">View Details</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Megaphone className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Grant Opportunities</h3>
            <p className="text-center text-muted-foreground max-w-md mx-auto">
              There are no grant opportunities posted yet. Click the button below to create your first opportunity.
            </p>
            <Button className="mt-4" onClick={handleCreateOpportunity}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProposalsPage;
