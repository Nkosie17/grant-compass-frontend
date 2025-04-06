
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface UploadAgreementFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UploadAgreementForm: React.FC<UploadAgreementFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "collaboration",
    grantId: "",
    parties: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "active",
    description: "",
    documentUrl: "#" // In a real app, this would be a file upload
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file and get a URL
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0].name);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      parties: formData.parties.split(",").map(p => p.trim())
    });
  };
  
  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Agreement Title</Label>
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
            <Label htmlFor="type">Agreement Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agreement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collaboration">Collaboration Agreement</SelectItem>
                <SelectItem value="funding">Funding Agreement</SelectItem>
                <SelectItem value="data_sharing">Data Sharing Agreement</SelectItem>
                <SelectItem value="ip">IP Agreement</SelectItem>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
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
            <Label htmlFor="parties">Parties (comma-separated)</Label>
            <Input
              id="parties"
              name="parties"
              value={formData.parties}
              onChange={handleChange}
              placeholder="Africa University, Partner Organization"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Agreement Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document">Upload Agreement Document</Label>
          <Input
            id="document"
            name="document"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <p className="text-xs text-muted-foreground">
            Accepted formats: PDF, DOC, DOCX (Max: 10MB)
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Upload Agreement</Button>
        </div>
      </form>
    </Card>
  );
};

export default UploadAgreementForm;
