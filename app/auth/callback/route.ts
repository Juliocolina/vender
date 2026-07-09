import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // El método `setAll` fue llamado desde un Server Component
            }
          },
        },
      }
    )
    
    // Intercambiar el código por una sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_failed`)
    }
    
    // Verificar si el usuario ya tiene tienda configurada
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Buscar perfil del usuario
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('tienda_id')
        .eq('id', user.id)
        .single()
      
      // Si no tiene tienda, ir a onboarding
      if (!perfil?.tienda_id) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }
    }
  }

  // Redirigir al usuario a dashboard después de autenticar
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}