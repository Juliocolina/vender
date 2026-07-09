import { createBrowserClient } from './client'

export interface Banner {
  id: string
  store_id: string
  image_url: string
  category_id: string | null
  position: number
  is_active: boolean
  created_at: string
}

// Obtener banners de una tienda
export async function obtenerBanners(storeId: string): Promise<Banner[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('store_id', storeId)
    .order('position', { ascending: true })
  
  if (error) {
    console.error('Error obteniendo banners:', error)
    return []
  }
  
  return data || []
}

// Crear banner
export async function crearBanner(storeId: string, banner: {
  image_url: string
  category_id?: string
  position?: number
}): Promise<Banner | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('banners')
    .insert([{
      store_id: storeId,
      image_url: banner.image_url,
      category_id: banner.category_id || null,
      position: 1,
      is_active: true
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando banner:', error)
    return null
  }
  
  return data
}

// Subir imagen de banner (usa el bucket 'products' que ya existe)
export async function subirImagenBanner(file: File, storeId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${storeId}/banners/${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: true })
  
  if (uploadError) {
    console.error('Error subiendo imagen:', uploadError)
    return null
  }
  
  const { data } = supabase.storage.from('products').getPublicUrl(fileName)
  
  return data.publicUrl
}

// Eliminar banner
export async function eliminarBanner(bannerId: string): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', bannerId)
  
  if (error) {
    console.error('Error eliminando banner:', error)
    return false
  }
  
  return true
}

// Actualizar banner
export async function actualizarBanner(bannerId: string, datos: Partial<Banner>): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('banners')
    .update(datos)
    .eq('id', bannerId)
  
  if (error) {
    console.error('Error actualizando banner:', error)
    return false
  }
  
  return true
}
