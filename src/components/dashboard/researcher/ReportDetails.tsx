
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ReportDetailsProps {
  report: {
    id: number;
    title: string;
    grantId: string;
    type: string;
    submittedDate: string;
    status: string;
    content?: string;
    feedback?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      case "Needs Revision":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Submitted on {report.submittedDate}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Grant ID</h3>
              <p>{report.grantId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Report Type</h3>
              <p>{report.type}</p>
            </div>
          </div>
          
          {report.content && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Report Content</h3>
              <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                {report.content}
              </div>
            </div>
          )}
          
          {report.feedback && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Reviewer Feedback</h3>
              <div className="bg-muted/50 p-4 rounded-md text-sm border-l-4 border-l-blue-500">
                {report.feedback}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetails;
