
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface Agreement {
  id: string;
  title: string;
  type: string;
  grantId: string;
  parties: string[];
  startDate: string;
  endDate: string;
  status: string;
  documentUrl: string;
}

interface AgreementsTableProps {
  agreements: Agreement[];
}

const AgreementsTable: React.FC<AgreementsTableProps> = ({ agreements }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "collaboration": return "Collaboration";
      case "funding": return "Funding";
      case "data_sharing": return "Data Sharing";
      case "ip": return "IP Agreement";
      default: return type;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Parties</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements.length > 0 ? (
            agreements.map((agreement) => (
              <TableRow key={agreement.id}>
                <TableCell className="font-medium">{agreement.title}</TableCell>
                <TableCell>{getTypeLabel(agreement.type)}</TableCell>
                <TableCell>{agreement.parties.join(", ")}</TableCell>
                <TableCell>{agreement.startDate} to {agreement.endDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(agreement.status)}>
                    {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No agreements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgreementsTable;
