import { createBrowserClient } from './client'

export interface Producto {
  id: string
  store_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  compare_price: number | null
  image_url: string | null
  stock: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  store_id: string
  name: string
  slug: string
  position: number
  created_at: string
  productos_count?: number
}

// Obtener tienda del usuario
export async function obtenerTiendaUsuario(userId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('perfiles')
    .select('tienda_id')
    .eq('id', userId)
    .single()
  
  if (error || !data?.tienda_id) {
    return null
  }
  
  return data.tienda_id
}

// Obtener categorías de una tienda
export async function obtenerCategorias(storeId: string): Promise<Categoria[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('position', { ascending: true })
  
  if (error) {
    console.error('Error obteniendo categorías:', error)
    return []
  }
  
  // Contar productos por categoría
  const categoriasConConteo = await Promise.all(
    (data || []).map(async (cat) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
      
      return {
        ...cat,
        productos_count: count || 0
      }
    })
  )
  
  return categoriasConConteo
}

// Obtener productos de una tienda
export async function obtenerProductos(storeId: string, categoriaId?: string): Promise<Producto[]> {
  const supabase = createBrowserClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
  
  if (categoriaId) {
    query = query.eq('category_id', categoriaId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error obteniendo productos:', error)
    return []
  }
  
  return data || []
}

// Crear producto
export async function crearProducto(storeId: string, producto: {
  name: string
  description?: string
  price: number
  compare_price?: number
  image_url?: string
  stock: number
  category_id?: string
  is_featured?: boolean
}): Promise<Producto | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('products')
    .insert([{
      store_id: storeId,
      name: producto.name,
      description: producto.description || null,
      price: producto.price,
      compare_price: producto.compare_price || null,
      image_url: producto.image_url || null,
      stock: producto.stock,
      category_id: producto.category_id || null,
      is_featured: producto.is_featured || false,
      is_active: true
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando producto:', error)
    return null
  }
  
  return data
}

// Crear múltiples productos (bulk)
export async function crearProductosBulk(storeId: string, productos: Array<{
  name: string
  description?: string
  price: number
  compare_price?: number
  image_url?: string
  stock: number
  category_id?: string
}>): Promise<number> {
  const supabase = createBrowserClient()
  
  const productosInsert = productos.map(p => ({
    store_id: storeId,
    name: p.name,
    description: p.description || null,
    price: p.price,
    compare_price: p.compare_price || null,
    image_url: p.image_url || null,
    stock: p.stock,
    category_id: p.category_id || null,
    is_active: true,
    is_featured: false
  }))
  
  const { data, error } = await supabase
    .from('products')
    .insert(productosInsert)
    .select()
  
  if (error) {
    console.error('Error creando productos:', error)
    return 0
  }
  
  return data?.length || 0
}

// Actualizar producto
export async function actualizarProducto(productoId: string, datos: Partial<Producto>): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('products')
    .update({
      ...datos,
      updated_at: new Date().toISOString()
    })
    .eq('id', productoId)
  
  if (error) {
    console.error('Error actualizando producto:', error)
    return false
  }
  
  return true
}

// Eliminar producto
export async function eliminarProducto(productoId: string): Promise<boolean> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productoId)
  
  if (error) {
    console.error('Error eliminando producto:', error)
    return false
  }
  
  return true
}

// Subir imagen de producto
export async function subirImagenProducto(file: File, storeId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${storeId}/${Date.now()}.${fileExt}`
  
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

// Crear categoría
export async function crearCategoria(storeId: string, nombre: string): Promise<Categoria | null> {
  const supabase = createBrowserClient()
  
  const slug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      store_id: storeId,
      name: nombre,
      slug: slug,
      position: 0
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creando categoría:', error)
    return null
  }
  
  return data
}
