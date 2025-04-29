import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface IPTableProps {
  items?: IPItem[];
  refresh?: number; // Add a refresh trigger
}

const IPTable: React.FC<IPTableProps> = ({ items: propItems, refresh }) => {
  const [items, setItems] = useState<IPItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch IP items from Supabase
  useEffect(() => {
    const fetchIPItems = async () => {
      try {
        setLoading(true);
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
          description: item.description || ''
        }));

        setItems(transformedData);
      } catch (error) {
        console.error("Error fetching IP items:", error);
        toast.error("Failed to load intellectual property items");
      } finally {
        setLoading(false);
      }
    };

    fetchIPItems();
  }, [refresh]); // Re-fetch when refresh changes

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
  
  // Use items from props if provided, otherwise use items from state
  const displayItems = propItems || items;
  
  if (loading && !propItems) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-au-purple"></div>
      </div>
    );
  }

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
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
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

// Define the helper functions that were in the original component
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

export default IPTable;
