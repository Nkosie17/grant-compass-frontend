
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface IPFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const IPForm: React.FC<IPFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "patent",
    registrationNumber: "",
    filingDate: new Date().toISOString().split("T")[0],
    grantId: "",
    researchers: "",
    description: "",
    status: "pending"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      researchers: formData.researchers.split(",").map(r => r.trim())
    });
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
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save IP Asset</Button>
        </div>
      </form>
    </Card>
  );
};

export default IPForm;
