# 🗄️ VENDER - Registro de SQL Ejecutados

Este documento registra todos los scripts SQL ejecutados en la base de datos de VENDER.

---

## 📅 **2025-01-XX - Schema Inicial v1.0**

**Descripción:** Creación del schema completo de la base de datos

**Estado:** ✅ Ejecutado

**Tablas creadas:**
- `stores` - Tiendas de vendedores
- `banners` - Banners promocionales (máx 3 por tienda)
- `categories` - Categorías de productos
- `products` - Productos
- `stories` - Historias (producto, promoción, anuncio)
- `ads` - Publicidad pagada
- `orders` - Pedidos
- `order_items` - Items de cada pedido

**Vistas creadas:**
- `store_stats` - Estadísticas de tienda

**Funciones/Triggers:**
- `update_updated_at_column()` - Actualiza timestamp automáticamente

**RLS (Row Level Security):**
- Habilitado en todas las tablas
- Políticas de acceso por usuario
- Políticas públicas para lectura

**Archivo:** `/docs/database/schema.sql`

**SQL:**
```sql
-- ============================================
-- VENDER - Schema de Base de Datos v1.0
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS stores CASCADE;

CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  whatsapp TEXT,
  tiktok TEXT,
  instagram TEXT,
  facebook TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_stores_user_id ON stores(user_id);

CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INT DEFAULT 1 CHECK (position BETWEEN 1 AND 3),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_banners_store_id ON banners(store_id);

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, slug)
);

CREATE INDEX idx_categories_store_id ON categories(store_id);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  image_url TEXT,
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);

CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('product', 'promotion', 'ad')),
  title TEXT,
  image_url TEXT,
  video_url TEXT,
  link_url TEXT,
  is_paid BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stores_active ON stories(expires_at, created_at);

CREATE TABLE ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'story', 'banner')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  priority INT DEFAULT 1,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ads_active ON ads(is_active, priority);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE VIEW store_stats AS
SELECT 
  s.id AS store_id,
  s.name AS store_name,
  COUNT(DISTINCT p.id) AS total_products,
  COUNT(DISTINCT o.id) AS total_orders,
  COALESCE(SUM(o.total), 0) AS total_revenue,
  COUNT(DISTINCT b.id) AS total_banners,
  COUNT(DISTINCT c.id) AS total_categories
FROM stores s
LEFT JOIN products p ON p.store_id = s.id
LEFT JOIN orders o ON o.store_id = s.id
LEFT JOIN banners b ON b.store_id = s.id
LEFT JOIN categories c ON c.store_id = s.id
GROUP BY s.id, s.name;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own store" ON stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own store" ON stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own store" ON stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own store" ON stores FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own banners" ON banners FOR SELECT USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));
CREATE POLICY "Users can insert own banners" ON banners FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));
CREATE POLICY "Users can update own banners" ON banners FOR UPDATE USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));
CREATE POLICY "Users can delete own banners" ON banners FOR DELETE USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Users can manage own stories" ON stories FOR ALL USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id) OR store_id IS NULL);

CREATE POLICY "Users can manage own ads" ON ads FOR ALL USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Users can manage own orders" ON orders FOR ALL USING (auth.uid() = (SELECT user_id FROM stores WHERE id = store_id));

CREATE POLICY "Public can view active stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active stories" ON stories FOR SELECT USING (expires_at > NOW() OR expires_at IS NULL);
```

---

## 📋 Template para nuevos SQL

```markdown
## 📅 **FECHA - Descripción del cambio**

**Descripción:** Breve descripción

**Estado:** ⏳ Pendiente / ✅ Ejecutado / ❌ Error

**Tablas afectadas:**
- tabla1
- tabla2

**SQL:**
\`\`\`sql
-- Tu SQL aquí
\`\`\`
```

---

## 📊 Resumen de tablas actuales

| Tabla | Registros | Última actualización |
|-------|-----------|---------------------|
| stores | 0 | - |
| banners | 0 | - |
| categories | 0 | - |
| products | 0 | - |
| stories | 0 | - |
| ads | 0 | - |
| orders | 0 | - |
| order_items | 0 | - |

---

## 🔗 Enlaces útiles

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ecginvuvqawshsrxdfik
- **SQL Editor:** https://supabase.com/dashboard/project/ecginvuvqawshsrxdfik/sql
- **Table Editor:** https://supabase.com/dashboard/project/ecginvuvqawshsrxdfik/editor
