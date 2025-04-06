
import React, { useState } from "react";
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

// Mock data for intellectual property items
const MOCK_IP_ITEMS: IPItem[] = [
  {
    id: "ip1",
    title: "Novel Approach for Sustainable Agriculture",
    type: "patent" as IPType,
    registrationNumber: "PAT123456",
    filingDate: "2023-05-15",
    grantId: "grant123",
    researchers: ["John Doe", "Jane Smith"],
    status: "registered"
  },
  {
    id: "ip2",
    title: "Africa University Research Methodology Handbook",
    type: "copyright" as IPType,
    registrationNumber: "CR789012",
    filingDate: "2023-02-10",
    grantId: "grant456",
    researchers: ["Alice Johnson"],
    status: "registered"
  },
  {
    id: "ip3",
    title: "AU Research Analytics Platform",
    type: "trademark" as IPType,
    registrationNumber: "TM345678",
    filingDate: "2023-07-22",
    grantId: "grant789",
    researchers: ["Robert Brown", "Sarah Davis"],
    status: "pending"
  },
  {
    id: "ip4",
    title: "Innovative Water Purification Process",
    type: "trade_secret" as IPType,
    registrationNumber: "TS901234",
    filingDate: "2023-03-30",
    grantId: "grant123",
    researchers: ["Michael Wilson"],
    status: "protected"
  }
];

const IntellectualPropertyPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [ipItems, setIpItems] = useState<IPItem[]>(MOCK_IP_ITEMS);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredItems = activeTab === "all" 
    ? ipItems 
    : ipItems.filter(item => item.type === activeTab);
  
  const handleAddIP = (newIP: Omit<IPItem, "id">) => {
    setIpItems([...ipItems, { id: `ip${ipItems.length + 1}`, ...newIP }]);
    setShowForm(false);
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
                
                <IPTable items={filteredItems} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntellectualPropertyPage;
