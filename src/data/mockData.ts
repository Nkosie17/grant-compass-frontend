
import { Grant, GrantOpportunity, GrantStatus } from "@/types/grants";

// Sample researcher grants for demonstration
export const RESEARCHER_GRANTS: Grant[] = [
  {
    id: "grant-001",
    title: "Agricultural Innovation for Climate Change Adaptation",
    description: "Research on drought-resistant crop varieties for sustainable agriculture in Zimbabwe.",
    amount: 35000,
    start_date: "2024-01-15",
    end_date: "2025-01-15",
    status: "active" as GrantStatus,
    category: "Agriculture",
    funding_source: "Africa Development Bank",
    researcher_id: "researcher-001",
    researcher_name: "Dr. John Chiweshe",
    department: "Agricultural Sciences",
    submitted_date: "2023-10-25"
  },
  {
    id: "grant-002",
    title: "Renewable Energy Solutions for Rural Communities",
    description: "Development of affordable solar energy systems for rural Zimbabwe.",
    amount: 42000,
    start_date: "2024-02-01",
    end_date: "2025-08-01",
    status: "under_review" as GrantStatus,
    category: "Energy",
    funding_source: "USAID",
    researcher_id: "researcher-001",
    researcher_name: "Dr. John Chiweshe",
    department: "Electrical Engineering",
    submitted_date: "2024-01-10"
  },
  {
    id: "grant-003",
    title: "Public Health Education in Post-COVID Era",
    description: "Implementing effective public health education strategies in rural communities.",
    amount: 28500,
    start_date: "2024-03-15",
    end_date: "2025-03-15",
    status: "draft" as GrantStatus,
    category: "Public Health",
    funding_source: "World Health Organization",
    researcher_id: "researcher-001",
    researcher_name: "Dr. John Chiweshe",
    department: "Community Health Sciences",
    submitted_date: null
  }
];

// All grants in the system (for admin/grant office view)
export const ALL_GRANTS: Grant[] = [
  ...RESEARCHER_GRANTS,
  {
    id: "grant-004",
    title: "Technology for Education in Underserved Areas",
    description: "Implementing technology solutions for remote learning in underserved areas.",
    amount: 56000,
    start_date: "2024-02-10",
    end_date: "2025-06-10",
    status: "active" as GrantStatus,
    category: "Education Technology",
    funding_source: "Microsoft Foundation",
    researcher_id: "researcher-002",
    researcher_name: "Dr. Sarah Moyo",
    department: "Education Technology",
    submitted_date: "2023-11-30"
  },
  {
    id: "grant-005",
    title: "Water Conservation and Management",
    description: "Research on sustainable water management practices for urban areas.",
    amount: 47500,
    start_date: "2024-01-20",
    end_date: "2025-07-20",
    status: "completed" as GrantStatus,
    category: "Environmental Science",
    funding_source: "United Nations Development Program",
    researcher_id: "researcher-003",
    researcher_name: "Dr. Michael Tawanda",
    department: "Environmental Sciences",
    submitted_date: "2023-09-15"
  }
];

// Grant opportunities available for researchers
export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: "opp-001",
    title: "African Innovation Challenge 2024",
    description: "Funding for innovative solutions addressing African development challenges.",
    funding_amount: 75000,
    deadline: "2024-09-30",
    eligibility: "Open to all researchers affiliated with African universities.",
    category: "Innovation",
    funding_source: "African Development Foundation",
    application_url: "https://example.com/african-innovation-challenge"
  },
  {
    id: "opp-002",
    title: "Climate Change Research Grant",
    description: "Supporting research on climate change mitigation and adaptation strategies in Africa.",
    funding_amount: 60000,
    deadline: "2024-08-15",
    eligibility: "Researchers with background in environmental sciences, agriculture, or related fields.",
    category: "Environmental Science",
    funding_source: "Global Climate Fund",
    application_url: "https://example.com/climate-research-grant"
  },
  {
    id: "opp-003",
    title: "Digital Health Solutions Grant",
    description: "Funding for innovative digital health solutions for rural communities.",
    funding_amount: 45000,
    deadline: "2024-10-30",
    eligibility: "Researchers with experience in healthcare technology and rural health.",
    category: "Health Technology",
    funding_source: "Medical Research Council",
    application_url: "https://example.com/digital-health-grant"
  },
  {
    id: "opp-004",
    title: "Educational Research and Development",
    description: "Supporting research on improving educational outcomes in African universities.",
    funding_amount: 35000,
    deadline: "2024-11-15",
    eligibility: "Faculty members with experience in education research.",
    category: "Education",
    funding_source: "Education First Foundation",
    application_url: "https://example.com/education-research-grant"
  }
];
