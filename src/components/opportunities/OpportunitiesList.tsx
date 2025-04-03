
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GRANT_OPPORTUNITIES } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrantOpportunity, GrantCategory, FundingSource } from "@/types/grants";
import { Calendar, DollarSign, FileText, Search } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const OpportunitiesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GrantCategory | "all">("all");
  const [fundingSourceFilter, setFundingSourceFilter] = useState<FundingSource | "all">("all");
  
  const filteredOpportunities = GRANT_OPPORTUNITIES.filter(opportunity => {
    // Search query filter
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || opportunity.category === categoryFilter;
    
    // Funding source filter
    const matchesFundingSource = fundingSourceFilter === "all" || opportunity.fundingSource === fundingSourceFilter;
    
    return matchesSearch && matchesCategory && matchesFundingSource;
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDeadline = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let color = "text-gray-600";
    if (diffDays <= 7) color = "text-red-600 font-semibold";
    else if (diffDays <= 30) color = "text-yellow-600";
    
    return (
      <span className={color}>
        {new Date(deadlineStr).toLocaleDateString()} 
        {diffDays > 0 && ` (${diffDays} days left)`}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="Funding Opportunities"
        subtitle="Browse and search for available grant opportunities"
      />
      
      <div className="p-6 flex-1">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Opportunities</CardTitle>
            <CardDescription>Filter and search for relevant grant opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by keyword..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category-filter" className="text-sm mb-2 block">
                  Category
                </Label>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value as GrantCategory | "all")}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Filter by category" />
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
              </div>
              
              <div>
                <Label htmlFor="funding-filter" className="text-sm mb-2 block">
                  Funding Source
                </Label>
                <Select
                  value={fundingSourceFilter}
                  onValueChange={(value) => setFundingSourceFilter(value as FundingSource | "all")}
                >
                  <SelectTrigger id="funding-filter">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results */}
        <div className="grid grid-cols-1 gap-6">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg mb-1">No Matching Opportunities</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OpportunityCard: React.FC<{ opportunity: GrantOpportunity }> = ({ opportunity }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getCategoryBadgeColor = (category: GrantCategory) => {
    switch (category) {
      case "research":
        return "bg-blue-100 text-blue-800";
      case "education":
        return "bg-green-100 text-green-800";
      case "community":
        return "bg-yellow-100 text-yellow-800";
      case "infrastructure":
        return "bg-purple-100 text-purple-800";
      case "innovation":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getFundingSourceBadgeColor = (source: FundingSource) => {
    switch (source) {
      case "internal":
        return "bg-gray-100 text-gray-800";
      case "external":
        return "bg-orange-100 text-orange-800";
      case "government":
        return "bg-blue-100 text-blue-800";
      case "private":
        return "bg-indigo-100 text-indigo-800";
      case "foundation":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatDeadline = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let color = "text-gray-600";
    if (diffDays <= 7) color = "text-red-600 font-semibold";
    else if (diffDays <= 30) color = "text-yellow-600";
    
    return (
      <span className={color}>
        {new Date(deadlineStr).toLocaleDateString()} 
        {diffDays > 0 && ` (${diffDays} days left)`}
      </span>
    );
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
          <CardTitle>{opportunity.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryBadgeColor(opportunity.category)}`}>
              {opportunity.category.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${getFundingSourceBadgeColor(opportunity.fundingSource)}`}>
              {opportunity.fundingSource.replace('_', ' ')}
            </span>
          </div>
        </div>
        <CardDescription>{opportunity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm font-medium">Grant Amount</p>
              <p className="text-lg font-semibold text-au-purple">
                {formatCurrency(opportunity.fundingAmount)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm font-medium">Application Deadline</p>
              <p className="text-base">{formatDeadline(opportunity.deadline)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm font-medium">Eligibility</p>
              <p className="text-sm">{opportunity.eligibility}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        <Button asChild className="bg-au-purple hover:bg-au-purple-dark">
          <Link to={`/new-application?opportunity=${opportunity.id}`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunitiesList;
