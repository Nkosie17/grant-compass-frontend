
// supabase/functions/create-admin/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const serve = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are missing.')
    }

    // Create Supabase client with admin rights
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request body or use default values
    let email = 'admin@africau.edu'
    let password = 'test1234'
    
    try {
      const body = await req.json()
      // If specific values are provided in the request, use them instead
      if (body.email) email = body.email
      if (body.password) password = body.password
    } catch (err) {
      // If parsing fails, just use the default values
      console.log('Using default admin credentials')
    }
    
    // Create the admin user with the auth API
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    })

    if (createUserError) {
      throw createUserError
    }

    // Update the profile with admin role in case the trigger didn't work
    if (authUser?.user) {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          name: 'Admin User',
        })
        .eq('id', authUser.user.id)

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError)
        // Continue anyway since the trigger should have created the profile
      }
    }

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', user: authUser?.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error creating admin user:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create admin user', 
        message: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
