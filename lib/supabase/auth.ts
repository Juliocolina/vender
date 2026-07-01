import { createBrowserClient } from './client'

// Función para autenticación con Google
export async function signInWithGoogle() {
  const supabase = createBrowserClient()
  
  // Usar URL de entorno para producción o localhost para desarrollo
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || `${window.location.origin}/auth/callback`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }

  return data
}

// Función para cerrar sesión
export async function signOut() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }

  // Redireccionar a la página principal
  window.location.href = '/'
}

// Obtener usuario actual (para cliente)
export async function getUser() {
  const supabase = createBrowserClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

// Obtener sesión actual (para cliente)
export async function getSession() {
  const supabase = createBrowserClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  return session
}