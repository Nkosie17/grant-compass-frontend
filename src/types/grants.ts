
export type GrantStatus = 
  | "draft" 
  | "submitted" 
  | "under_review" 
  | "approved" 
  | "rejected" 
  | "modifications_requested"
  | "active"
  | "completed";

export type FundingSource = "internal" | "external" | "government" | "private" | "foundation";

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
}
