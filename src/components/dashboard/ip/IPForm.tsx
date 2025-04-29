
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { IPItem, IPType } from "@/types/grants";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface IPFormProps {
  onSubmit: (data: Omit<IPItem, "id">) => void;
  onCancel: () => void;
}

const IPForm: React.FC<IPFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<IPItem, "id" | "researchers"> & { researchers: string }>({
    title: "",
    type: "patent" as IPType,
    registrationNumber: "",
    filingDate: new Date().toISOString().split("T")[0],
    grantId: "",
    researchers: user ? user.name : "",
    status: "pending",
    description: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const researchersArray = formData.researchers.split(",").map(r => r.trim());
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('intellectual_property')
        .insert({
          title: formData.title,
          type: formData.type,
          registration_number: formData.registrationNumber,
          filing_date: formData.filingDate,
          grant_id: formData.grantId,
          researchers: researchersArray,
          status: formData.status,
          description: formData.description
        })
        .select();
        
      if (error) throw error;
      
      toast.success("IP asset saved successfully");
      
      // Call the parent's onSubmit with the data
      onSubmit({
        ...formData,
        researchers: researchersArray
      });
    } catch (error) {
      console.error("Error saving IP asset:", error);
      toast.error("Failed to save IP asset");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select IP type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patent">Patent</SelectItem>
                <SelectItem value="copyright">Copyright</SelectItem>
                <SelectItem value="trademark">Trademark</SelectItem>
                <SelectItem value="trade_secret">Trade Secret</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="protected">Protected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filingDate">Filing Date</Label>
            <Input
              id="filingDate"
              name="filingDate"
              type="date"
              value={formData.filingDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grantId">Related Grant ID</Label>
            <Input
              id="grantId"
              name="grantId"
              value={formData.grantId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="researchers">Researchers (comma-separated)</Label>
            <Input
              id="researchers"
              name="researchers"
              value={formData.researchers}
              onChange={handleChange}
              placeholder="John Doe, Jane Smith"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save IP Asset"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default IPForm;
