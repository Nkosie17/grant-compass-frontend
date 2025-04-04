
export type GrantStatus = 
  | "draft" 
  | "submitted" 
  | "under_review" 
  | "approved" 
  | "rejected" 
  | "modifications_requested"
  | "active"
  | "completed";

export type FundingSource = "internal" | "external";

export type GrantCategory = 
  | "research" 
  | "education" 
  | "community" 
  | "infrastructure" 
  | "innovation";

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: GrantStatus;
  category: GrantCategory;
  fundingSource: FundingSource;
  submittedBy?: string;
  submittedDate?: string;
  researcherId?: string;
  researcherName?: string;
  department?: string;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface GrantOpportunity {
  id: string;
  title: string;
  description: string;
  fundingAmount: number;
  deadline: string;
  eligibility: string;
  category: GrantCategory;
  fundingSource: FundingSource;
  applicationUrl?: string;
  postedBy?: string;
  postedDate?: string;
}

export interface GrantReport {
  id: string;
  grantId: string;
  title: string;
  dueDate: string;
  submissionDate?: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  comments?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "due_date" | "report_submission" | "status_update" | "opportunity";
  relatedId?: string; // Can be grantId, reportId, etc.
  isRead: boolean;
  createdAt: string;
}
