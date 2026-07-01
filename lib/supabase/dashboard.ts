import { createBrowserClient } from './client'

// Obtener datos completos de la tienda del usuario actual
export async function getStoreData() {
  const supabase = createBrowserClient()
  
  // 1. Obtener usuario
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null
  
  // 2. Obtener tienda
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single()
    
  if (storeError) return null
  
  return {
    user,
    store,
    whatsappUrl: `https://wa.me/${store.whatsapp.replace('+', '')}`,
  }
}

// Obtener estadísticas básicas (simuladas por ahora)
export async function getDashboardStats() {
  // TODO: Conectar con datos reales cuando tengas las tablas
  return {
    dailySales: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    weeklyRevenue: 0,
    topProduct: 'No hay datos aún',
  }
}

// Simular datos de ventas recientes
export async function getRecentSales() {
  return [
    { id: 1, customer: 'Cliente Demo', amount: 50, status: 'completed', date: '2024-01-15' },
    { id: 2, customer: 'Prueba', amount: 25, status: 'pending', date: '2024-01-14' },
    { id: 3, customer: 'Ejemplo', amount: 100, status: 'completed', date: '2024-01-13' },
  ]
}

// Simular productos con stock bajo
export async function getLowStockItems() {
  return [
    { id: 1, name: 'Producto A', stock: 2, threshold: 5 },
    { id: 2, name: 'Producto B', stock: 3, threshold: 5 },
    { id: 3, name: 'Producto C', stock: 1, threshold: 5 },
  ]
}

// Generar URL de WhatsApp para atender clientes
export function generateWhatsAppUrl(phone: string, message?: string) {
  const baseUrl = `https://wa.me/${phone.replace('+', '')}`
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  return baseUrl
}