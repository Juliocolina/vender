import { createBrowserClient } from './client'

export interface Store {
  id: string
  user_id: string
  name: string
  description: string | null
  logo_url: string | null
  whatsapp: string | null
  tiktok: string | null
  instagram: string | null
  facebook: string | null
  website: string | null
  country: string | null
  created_at: string
  updated_at: string
}

// Obtener tienda del usuario
export async function obtenerMiTienda(userId: string): Promise<Store | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error obteniendo tienda:', error)
    return null
  }
  
  return data
}

// Actualizar tienda
export async function actualizarTienda(storeId: string, datos: Partial<Store>): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('stores')
    .update({
      ...datos,
      updated_at: new Date().toISOString()
    })
    .eq('id', storeId)
  
  if (error) {
    console.error('Error actualizando tienda:', error)
    return false
  }
  
  return true
}

// Subir logo de tienda
export async function subirLogoTienda(file: File, storeId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${storeId}/logo.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('stores')
    .upload(fileName, file, { upsert: true })
  
  if (uploadError) {
    console.error('Error subiendo logo:', uploadError)
    return null
  }
  
  const { data } = supabase.storage.from('stores').getPublicUrl(fileName)
  
  return data.publicUrl
}
