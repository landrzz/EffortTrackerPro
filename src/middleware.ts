import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // This is used by the server, so we need to set new headers
          request.cookies.set({
            name,
            value,
            ...options,
          })
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
          return response
        },
        remove(name: string, options: any) {
          // This is used by the server, so we need to set new headers
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
          return response
        },
      },
    }
  )

  // Get the session from the request
  const { data: { session } } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route, redirect to login
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login') && 
                          !request.nextUrl.pathname.startsWith('/auth') && 
                          !request.nextUrl.pathname.startsWith('/user-profile-cm-') &&
                          request.nextUrl.pathname !== '/'
                          
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's a session and the user is trying to access login, redirect to home
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
