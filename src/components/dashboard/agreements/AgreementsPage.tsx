
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "../DashboardHeader";
import AgreementsTable from "./AgreementsTable";
import UploadAgreementForm from "./UploadAgreementForm";

// Mock data for agreements
const MOCK_AGREEMENTS = [
  {
    id: "agr1",
    title: "Research Collaboration Agreement - University of Zimbabwe",
    type: "collaboration",
    grantId: "grant123",
    parties: ["Africa University", "University of Zimbabwe"],
    startDate: "2023-01-15",
    endDate: "2025-01-14",
    status: "active",
    documentUrl: "#"
  },
  {
    id: "agr2",
    title: "Data Sharing Agreement - Ministry of Health",
    type: "data_sharing",
    grantId: "grant456",
    parties: ["Africa University", "Ministry of Health"],
    startDate: "2023-03-10",
    endDate: "2024-03-09",
    status: "active",
    documentUrl: "#"
  },
  {
    id: "agr3",
    title: "Funding Agreement - Gates Foundation",
    type: "funding",
    grantId: "grant789",
    parties: ["Africa University", "Gates Foundation"],
    startDate: "2023-05-01",
    endDate: "2026-04-30",
    status: "active",
    documentUrl: "#"
  },
  {
    id: "agr4",
    title: "Intellectual Property Agreement - Research Team",
    type: "ip",
    grantId: "grant123",
    parties: ["Africa University", "Research Team Members"],
    startDate: "2023-02-20",
    endDate: "2025-02-19",
    status: "active",
    documentUrl: "#"
  }
];

const AgreementsPage: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [agreements, setAgreements] = useState(MOCK_AGREEMENTS);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredAgreements = activeTab === "all" 
    ? agreements 
    : agreements.filter(agreement => agreement.type === activeTab);
  
  const handleAddAgreement = (newAgreement: any) => {
    setAgreements([...agreements, { id: `agr${agreements.length + 1}`, ...newAgreement }]);
    setShowUploadForm(false);
  };
  
  return (
    <div>
      <DashboardHeader 
        title="Agreements Management" 
        subtitle="Track and manage agreements related to research grants"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Grant Agreements</CardTitle>
              <CardDescription>
                Manage collaboration, funding, and data sharing agreements
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowUploadForm(true)} 
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Agreement
            </Button>
          </CardHeader>
          <CardContent>
            {showUploadForm ? (
              <UploadAgreementForm 
                onSubmit={handleAddAgreement} 
                onCancel={() => setShowUploadForm(false)} 
              />
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
                    <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                    <TabsTrigger value="funding">Funding</TabsTrigger>
                    <TabsTrigger value="data_sharing">Data Sharing</TabsTrigger>
                    <TabsTrigger value="ip">IP Agreements</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <AgreementsTable agreements={filteredAgreements} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgreementsPage;
