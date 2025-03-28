'use client'

import React, { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export default function GoogleAuth() {
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    // Set the redirect URL only on the client side
    setRedirectUrl(`${window.location.origin}/auth/callback`);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      {redirectUrl && (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']}
          redirectTo={redirectUrl}
        />
      )}
    </div>
  )
}
