import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client using the request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.delete({
            name,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // This will refresh the user's session if needed
  await supabase.auth.getUser()

  // Get the session from the request
  const { data: { session } } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route,
  // redirect them to the login page
  if (!session && request.nextUrl.pathname.startsWith('/user-profile-cm-')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If there's no session and the user is trying to access a protected route,
  // redirect them to the login page
  if (!session && request.nextUrl.pathname.startsWith('/activity-log')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}
