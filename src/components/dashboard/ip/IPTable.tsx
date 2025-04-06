
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
import { IPItem, IPType } from "@/types/grants";

interface IPTableProps {
  items: IPItem[];
}

const IPTable: React.FC<IPTableProps> = ({ items }) => {
  const getTypeLabel = (type: IPType) => {
    switch (type) {
      case "patent": return "Patent";
      case "copyright": return "Copyright";
      case "trademark": return "Trademark";
      case "trade_secret": return "Trade Secret";
      default: return type;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "protected":
        return "bg-blue-100 text-blue-800";
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
            <TableHead>Registration Number</TableHead>
            <TableHead>Filing Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{getTypeLabel(item.type)}</TableCell>
                <TableCell>{item.registrationNumber}</TableCell>
                <TableCell>{item.filingDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No intellectual property items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default IPTable;
