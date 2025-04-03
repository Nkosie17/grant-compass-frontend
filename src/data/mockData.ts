
import { Grant, GrantOpportunity, GrantStatus } from "@/types/grants";

// Mock grants for researchers
export const RESEARCHER_GRANTS: Grant[] = [
  {
    id: "g1",
    title: "Advanced AI Research Initiative",
    description: "Research into neural network optimization for resource-constrained environments",
    amount: 250000,
    startDate: "2024-06-01",
    endDate: "2026-05-31",
    status: "active" as GrantStatus,
    category: "research",
    fundingSource: "government",
    submittedBy: "John Researcher",
    submittedDate: "2024-02-15"
  },
  {
    id: "g2",
    title: "Quantum Computing Applications",
    description: "Exploring practical applications of quantum computing in cryptography",
    amount: 175000,
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    status: "approved" as GrantStatus,
    category: "innovation",
    fundingSource: "private",
    submittedBy: "John Researcher",
    submittedDate: "2024-03-10"
  },
  {
    id: "g3",
    title: "Sustainable Energy Solutions",
    description: "Development of high-efficiency solar panel technology",
    amount: 120000,
    startDate: "",
    endDate: "",
    status: "submitted" as GrantStatus,
    category: "research",
    fundingSource: "foundation",
    submittedBy: "John Researcher",
    submittedDate: "2024-04-01"
  },
  {
    id: "g4",
    title: "Urban Planning Optimization",
    description: "AI-driven approaches to urban planning and infrastructure development",
    amount: 90000,
    startDate: "",
    endDate: "",
    status: "draft" as GrantStatus,
    category: "community",
    fundingSource: "internal",
    submittedBy: "John Researcher"
  }
];

// Mock grants for grant office
export const ALL_GRANTS: Grant[] = [
  ...RESEARCHER_GRANTS,
  {
    id: "g5",
    title: "Medical Imaging Enhancements",
    description: "Improving medical imaging technology through machine learning algorithms",
    amount: 300000,
    startDate: "2024-07-01",
    endDate: "2027-06-30",
    status: "under_review" as GrantStatus,
    category: "research",
    fundingSource: "external",
    submittedBy: "Dr. Emily Chen",
    submittedDate: "2024-03-25"
  },
  {
    id: "g6",
    title: "Educational Equity Initiative",
    description: "Research into improving educational outcomes in underserved communities",
    amount: 150000,
    startDate: "2024-08-01",
    endDate: "2026-07-31",
    status: "modifications_requested" as GrantStatus,
    category: "education",
    fundingSource: "foundation",
    submittedBy: "Dr. Marcus Johnson",
    submittedDate: "2024-02-28"
  },
  {
    id: "g7",
    title: "Cybersecurity Enhancement Project",
    description: "Developing advanced cybersecurity protocols for critical infrastructure",
    amount: 220000,
    startDate: "2023-12-01",
    endDate: "2025-11-30",
    status: "active" as GrantStatus,
    category: "infrastructure",
    fundingSource: "government",
    submittedBy: "Dr. Sophia Rodriguez",
    submittedDate: "2023-09-15"
  }
];

// Mock grant opportunities
export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: "o1",
    title: "Technology Innovation Fund",
    description: "Funding for innovative technology solutions that address societal challenges",
    fundingAmount: 500000,
    deadline: "2024-07-15",
    eligibility: "Faculty members with at least 3 years of research experience",
    category: "innovation",
    fundingSource: "private"
  },
  {
    id: "o2",
    title: "Sustainable Development Research Grant",
    description: "Support for research projects focused on sustainable development goals",
    fundingAmount: 350000,
    deadline: "2024-08-30",
    eligibility: "All faculty members and research staff",
    category: "research",
    fundingSource: "foundation"
  },
  {
    id: "o3",
    title: "Community Engagement Initiative",
    description: "Funding for projects that engage with and benefit local communities",
    fundingAmount: 150000,
    deadline: "2024-06-20",
    eligibility: "Faculty members and community-focused researchers",
    category: "community",
    fundingSource: "internal"
  },
  {
    id: "o4",
    title: "Educational Technology Grant",
    description: "Support for developing and implementing innovative educational technologies",
    fundingAmount: 200000,
    deadline: "2024-09-10",
    eligibility: "Education faculty and instructional technology researchers",
    category: "education",
    fundingSource: "government"
  },
  {
    id: "o5",
    title: "Infrastructure Modernization Fund",
    description: "Grants for projects aimed at modernizing research infrastructure",
    fundingAmount: 400000,
    deadline: "2024-10-05",
    eligibility: "Department chairs and research center directors",
    category: "infrastructure",
    fundingSource: "external"
  }
];
