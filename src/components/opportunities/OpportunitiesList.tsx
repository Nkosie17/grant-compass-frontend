
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GrantOpportunity } from "@/types/grants";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Calendar, 
  ExternalLink, 
  Megaphone,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { db } from "@/integrations/supabase/typedClient";

const OpportunitiesList: React.FC = () => {
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Fetch opportunities from the database
  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await db
        .from('grant_opportunities')
        .select('*')
        .order('deadline', { ascending: true });
      
      if (error) throw error;
      
      // Transform data to match GrantOpportunity type
      const transformedOpportunities: GrantOpportunity[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        applicationUrl: item.application_url || "",
        eligibility: item.eligibility,
        fundingAmount: item.funding_amount,
        fundingSource: item.funding_source as any,
        category: item.category as any,
        deadline: item.deadline,
        postedBy: item.posted_by || "",
        postedDate: item.posted_date,
      }));
      
      setOpportunities(transformedOpportunities);
    } catch (error: any) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load grant opportunities");
      
      // Fallback to localStorage for demo purposes
      try {
        const storedOpportunities = JSON.parse(localStorage.getItem("au_gms_opportunities") || "[]");
        setOpportunities(storedOpportunities);
      } catch (e) {
        console.error("Error loading fallback opportunities:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (opportunity: GrantOpportunity) => {
    if (opportunity.applicationUrl) {
      // Open external application URL in a new tab
      window.open(opportunity.applicationUrl, "_blank");
    } else {
      // Navigate to the internal application form with pre-populated fields
      navigate("/grant-application", { 
        state: { 
          category: opportunity.category,
          fundingSource: opportunity.fundingSource,
          opportunityTitle: opportunity.title
        }
      });
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    // Text search filter
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || opportunity.category === categoryFilter;
    
    // Source filter
    const matchesSource = sourceFilter === "all" || opportunity.fundingSource === sourceFilter;
    
    return matchesSearch && matchesCategory && matchesSource;
  });

  const isUpcoming = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate > now;
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Grant Opportunities</h1>
          <p className="text-muted-foreground">Explore available grant opportunities</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search opportunities..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="infrastructure">Infrastructure</SelectItem>
            <SelectItem value="innovation">Innovation</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sourceFilter}
          onValueChange={setSourceFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Funding Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="external">External</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map(opportunity => (
            <Card key={opportunity.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={
                    opportunity.fundingSource === "internal" ? "default" : "outline"
                  }>
                    {opportunity.fundingSource === "internal" ? "Internal" : "External"}
                  </Badge>
                  <Badge variant="secondary">
                    {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span 
                    className={isUpcoming(opportunity.deadline) ? 
                      'text-xs text-muted-foreground' : 
                      'text-xs text-destructive'}
                  >
                    {isUpcoming(opportunity.deadline) 
                      ? `${getDaysRemaining(opportunity.deadline)} days remaining` 
                      : "Deadline passed"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                <div className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {opportunity.description}
                </div>
                <div>
                  <div className="font-semibold">${opportunity.fundingAmount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <div className="p-3 pt-0 mt-auto">
                <Button
                  variant={opportunity.applicationUrl ? "outline" : "default"}
                  className="w-full"
                  disabled={!isUpcoming(opportunity.deadline)}
                  onClick={() => handleApply(opportunity)}
                >
                  {opportunity.applicationUrl ? (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Externally
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
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
              There are no grant opportunities matching your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpportunitiesList;
