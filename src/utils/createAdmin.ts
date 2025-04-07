
import { db } from "@/integrations/supabase/typedClient";

export async function createDefaultAdmin() {
  console.log("Attempting to create default admin account...");
  try {
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
    return true;
  } catch (error) {
    console.error("Failed to create admin account:", error);
    return false;
  }
}
