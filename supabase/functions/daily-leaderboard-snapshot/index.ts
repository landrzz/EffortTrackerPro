// Supabase Edge Function to run daily leaderboard snapshots
// This function should be scheduled to run once per day

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  try {
    // Check for secret token to ensure this is a valid request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || authHeader !== `Bearer ${Deno.env.get('FUNCTION_SECRET')}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call the snapshot_leaderboard function
    const { data, error } = await supabase.rpc('snapshot_leaderboard')
    
    if (error) {
      console.error('Error running leaderboard snapshot:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Leaderboard snapshot completed successfully',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
