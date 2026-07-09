import { createBrowserClient } from './client'

export interface HistoriaDB {
  id: string
  store_id: string | null
  type: 'product' | 'promotion' | 'ad'
  title: string | null
  image_url: string | null
  video_url: string | null
  link_url: string | null
  is_paid: boolean
  views: number
  expires_at: string | null
  created_at: string
}

// Crear historia del usuario
export async function crearHistoria(
  storeId: string,
  imagenUrl: string,
  tipo: 'product' | 'promotion' | 'ad' = 'product',
  titulo?: string,
  linkUrl?: string
): Promise<HistoriaDB | null> {
  const supabase = createBrowserClient()
  
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // Expira en 24 horas
  
  const { data, error } = await supabase
    .from('stories')
    .insert([{
      store_id: storeId,
      type: tipo,
      title: titulo || null,
      image_url: imagenUrl,
      link_url: linkUrl || null,
      is_paid: false,
      views: 0,
      expires_at: expiresAt.toISOString()
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando historia:', error)
    return null
  }
  
  return data
}

// Obtener historias del usuario (no expiradas)
export async function obtenerMisHistorias(storeId: string): Promise<HistoriaDB[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('store_id', storeId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error obteniendo historias:', error)
    return []
  }
  
  return data || []
}

// Obtener historias de otras tiendas (para el feed)
export async function obtenerHistoriasTiendas(excludeStoreId: string): Promise<HistoriaDB[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      stores!inner (
        id,
        name,
        logo_url
      )
    `)
    .neq('store_id', excludeStoreId)
    .gt('expires_at', new Date().toISOString())
    .eq('is_paid', false)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error obteniendo historias de tiendas:', error)
    return []
  }
  
  return data || []
}

// Obtener historias publicitarias (pagadas)
export async function obtenerHistoriasPublicitarias(): Promise<HistoriaDB[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('is_paid', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error obteniendo historias publicitarias:', error)
    return []
  }
  
  return data || []
}

// Incrementar vistas
export async function incrementarVistas(historiaId: string): Promise<void> {
  const supabase = createBrowserClient()
  
  await supabase.rpc('incrementar_vistas_historia', { historia_id: historiaId })
}

// Eliminar historia
export async function eliminarHistoriaDB(historiaId: string): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', historiaId)
  
  if (error) {
    console.error('Error eliminando historia:', error)
    return false
  }
  
  return true
}

// Subir imagen de historia a Storage
export async function subirImagenHistoria(file: File, storeId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${storeId}/${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('stories')
    .upload(fileName, file, { upsert: true })
  
  if (uploadError) {
    console.error('Error subiendo imagen de historia:', uploadError)
    return null
  }
  
  const { data } = supabase.storage.from('stories').getPublicUrl(fileName)
  
  return data.publicUrl
}
