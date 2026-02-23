import { NextRequest, NextResponse } from 'next/server'

// Production course domains → internal route slug
const COURSE_DOMAIN_MAP: Record<string, string> = {
  'learn.relationshipdynamics.com': 'rsm',
  'learn.coachingos.com': 'tan',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host')?.split(':')[0] ?? ''

  // Pass through Next.js internals and API routes unchanged
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Course Builder
  const builderHost = process.env.BUILDER_HOSTNAME ?? 'builder.localhost'
  if (hostname === builderHost && !pathname.startsWith('/builder')) {
    return NextResponse.rewrite(new URL(`/builder${pathname}`, request.url))
  }

  // Live Training Dashboard
  const dashboardHost = process.env.DASHBOARD_HOSTNAME ?? 'dashboard.localhost'
  if (hostname === dashboardHost && !pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL(`/dashboard${pathname}`, request.url))
  }

  // Student Portal — map production domain to course slug
  const courseSlug = COURSE_DOMAIN_MAP[hostname]
  if (courseSlug && !pathname.startsWith(`/portal/${courseSlug}`)) {
    return NextResponse.rewrite(new URL(`/portal/${courseSlug}${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
