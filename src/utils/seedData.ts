
import { db } from "@/integrations/supabase/typedClient";
import { ALL_GRANTS, GRANT_OPPORTUNITIES } from "@/data/mockData";

/**
 * Seeds the database with mock data
 * This is intended for development only
 */
export async function seedDatabase() {
  // Convert grant data to match database schema
  const grantsData = ALL_GRANTS.map(grant => ({
    id: grant.id,
    title: grant.title,
    description: grant.description,
    amount: grant.amount,
    start_date: new Date(grant.startDate).toISOString(),
    end_date: new Date(grant.endDate).toISOString(),
    status: grant.status,
    category: grant.category,
    funding_source: grant.fundingSource,
    researcher_id: grant.researcherId || "researcher-001",
    researcher_name: grant.researcherName,
    department: grant.department,
    submitted_date: grant.submittedDate ? new Date(grant.submittedDate).toISOString() : null
  }));

  // Convert grant opportunities to match database schema
  const opportunitiesData = GRANT_OPPORTUNITIES.map(opportunity => ({
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    funding_amount: opportunity.fundingAmount,
    deadline: new Date(opportunity.deadline).toISOString(),
    eligibility: opportunity.eligibility,
    category: opportunity.category,
    funding_source: opportunity.fundingSource,
    application_url: opportunity.applicationUrl || null,
    posted_date: new Date().toISOString()
  }));

  try {
    // Insert grant data
    const { error: grantsError } = await db
      .from('grants')
      .upsert(grantsData)
      .select();

    if (grantsError) {
      console.error("Error inserting grants data:", grantsError);
      throw grantsError;
    }

    console.log(`Successfully inserted ${grantsData.length} grants`);

    // Insert grant opportunities
    const { error: opportunitiesError } = await db
      .from('grant_opportunities')
      .upsert(opportunitiesData)
      .select();

    if (opportunitiesError) {
      console.error("Error inserting grant opportunities data:", opportunitiesError);
      throw opportunitiesError;
    }

    console.log(`Successfully inserted ${opportunitiesData.length} grant opportunities`);

    return true;
  } catch (error) {
    console.error("Failed to seed database:", error);
    return false;
  }
}
