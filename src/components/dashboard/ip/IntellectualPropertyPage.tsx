
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import IPTable from "./IPTable";
import IPForm from "./IPForm";
import DashboardHeader from "../DashboardHeader";
import { IPItem, IPType } from "@/types/grants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IntellectualPropertyPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [ipItems, setIpItems] = useState<IPItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch IP items
  useEffect(() => {
    const fetchIPItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('intellectual_property')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to match the IPItem interface
        const transformedData: IPItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type as IPType,
          registrationNumber: item.registration_number,
          filingDate: new Date(item.filing_date).toISOString().split('T')[0],
          grantId: item.grant_id,
          researchers: item.researchers,
          status: item.status,
          description: item.description
        }));

        setIpItems(transformedData);
      } catch (error) {
        console.error("Error fetching IP items:", error);
        toast.error("Failed to load intellectual property items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIPItems();
  }, [refreshTrigger]);
  
  const filteredItems = activeTab === "all" 
    ? ipItems 
    : ipItems.filter(item => item.type === activeTab);
  
  const handleAddIP = (newIP: Omit<IPItem, "id">) => {
    setShowForm(false);
    // Trigger a refresh to fetch the latest data
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div>
      <DashboardHeader 
        title="Intellectual Property Management" 
        subtitle="Track and manage intellectual property assets from research grants"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Intellectual Property Assets</CardTitle>
              <CardDescription>
                Manage patents, copyrights, trademarks, and trade secrets
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowForm(true)} 
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add IP Asset
            </Button>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <IPForm onSubmit={handleAddIP} onCancel={() => setShowForm(false)} />
            ) : (
              <>
                <Tabs 
                  defaultValue="all" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mb-6"
                >
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="patent">Patents</TabsTrigger>
                    <TabsTrigger value="copyright">Copyrights</TabsTrigger>
                    <TabsTrigger value="trademark">Trademarks</TabsTrigger>
                    <TabsTrigger value="trade_secret">Trade Secrets</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-au-purple"></div>
                  </div>
                ) : (
                  <IPTable items={filteredItems} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntellectualPropertyPage;
