import { createBrowserClient } from './client'

export interface PerfilUsuario {
  id: string
  email: string
  nombre: string
  avatar_url: string | null
  tienda_id: string | null
  created_at: string
}

// Subir avatar a Supabase Storage
export async function subirAvatar(file: File, userId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })
  
  if (uploadError) {
    console.error('Error subiendo avatar:', uploadError)
    return null
  }
  
  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
  
  return data.publicUrl
}

// Actualizar perfil del usuario
export async function actualizarPerfil(userId: string, datos: { nombre?: string; avatar_url?: string }): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('perfiles')
    .upsert({
      id: userId,
      ...datos,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error actualizando perfil:', error)
    return false
  }
  
  return true
}

// Crear perfil si no existe
async function crearPerfilSiNoExiste(userId: string, email: string): Promise<PerfilUsuario | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('perfiles')
    .insert({ id: userId, email, nombre: email.split('@')[0] })
    .select()
    .single()
  
  if (error) {
    console.error('Error creando perfil:', error)
    return null
  }
  
  return data
}

// Obtener perfil del usuario
export async function obtenerPerfil(userId: string, userEmail?: string): Promise<PerfilUsuario | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    // Si el perfil no existe, crearlo automáticamente
    if (error.code === 'PGRST116' && userEmail) {
      return crearPerfilSiNoExiste(userId, userEmail)
    }
    console.error('Error obteniendo perfil:', error)
    return null
  }
  
  return data
}

// Obtener avatar del usuario
export async function obtenerAvatar(userId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar`)
  
  return data?.publicUrl || null
}
