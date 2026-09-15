import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Routes publiques — accessibles sans auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

// Routes d'onboarding — accessibles après auth mais sans org
const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth()

  // Route publique → laisser passer
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Non authentifié → rediriger vers sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Authentifié mais pas d'organisation → rediriger vers onboarding
  // (sauf si déjà sur onboarding)
  if (userId && !orgId && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // Authentifié avec organisation → laisser passer
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
