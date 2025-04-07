
import { db } from "@/integrations/supabase/typedClient";

export async function createDefaultAdmin() {
  console.log("Attempting to create default admin account...");
  try {
    // First check if admin already exists
    const { count, error: checkError } = await db
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('email', 'admin@africau.edu')
      .eq('role', 'admin');
    
    if (checkError) {
      console.error("Error checking if admin exists:", checkError);
      return false;
    }
    
    // If admin already exists, don't create another one
    if (count && count > 0) {
      console.log("Admin account already exists, skipping creation");
      return true;
    }

    // Create the admin account using the edge function
    const response = await fetch("https://jdsmyhemzlaccwptgpda.supabase.co/functions/v1/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@africau.edu",
        password: "test1234"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating admin account:", errorData);
      return false;
    }

    const data = await response.json();
    console.log("Admin account created successfully:", data);
    
    // Double-check the profile has admin role (in case the trigger didn't set it properly)
    const { error: updateError } = await db
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', 'admin@africau.edu');
      
    if (updateError) {
      console.error("Error updating admin role:", updateError);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to create admin account:", error);
    return false;
  }
}
