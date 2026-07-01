import { createMiddlewareClient } from '@/lib/supabase/middleware-client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/onboarding',
  '/auth/callback',
  '/api/auth/callback'
]

export async function middleware(request: NextRequest) {
  // Crear cliente de Supabase para middleware
  const { supabase, response } = createMiddlewareClient(request)
  
  // Actualizar sesión
  const { data: { session } } = await supabase.auth.getSession()
  
  // Ruta actual
  const { pathname } = request.nextUrl
  
  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // Si no hay sesión y la ruta NO es pública, redirigir a home
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Si hay sesión, verificar si tiene tienda
  if (session) {
    try {
      // Verificar si el usuario YA tiene tienda en la base de datos
      const { data: store, error } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      
      // Si error es porque tabla no existe, tratar como "no tiene tienda"
      const hasStore = !error && store
      
      // Si NO tiene tienda y NO está en onboarding → redirigir a onboarding
      if (!hasStore && pathname !== '/onboarding' && !pathname.startsWith('/auth/callback')) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      
      // Si YA tiene tienda y está en onboarding → redirigir a dashboard
      if (hasStore && pathname === '/onboarding') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Si tiene tienda y está en home → redirigir a dashboard
      if (hasStore && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Si NO tiene tienda y está en onboarding → permitir acceso
      if (!hasStore && pathname === '/onboarding') {
        return response
      }
    } catch (error) {
      // Si hay error (tabla no existe), redirigir a onboarding
      console.log('Error checking store:', error)
      if (pathname !== '/onboarding' && !pathname.startsWith('/auth/callback')) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }
  
  
  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}