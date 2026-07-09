# 📊 Esquema de Base de Datos - VENDER

## 🗺️ Diagrama Entidad-Relación

```
┌─────────────────┐
│  auth.users     │ (Supabase)
│  ───────────────│
│  id (PK)        │◄──────────────┐
│  email          │               │
│  encrypted_pass │               │
└─────────────────┘               │
         │                        │
         │ 1:1                    │ 1:N
         ▼                        │
┌─────────────────┐               │
│   perfiles      │               │
│  ───────────────│               │
│  id (PK, FK)    │───────────────┘
│  email          │
│  nombre         │
│  avatar_url     │
│  tienda_id (FK) │◄──┐
└─────────────────┘   │
                      │
         ┌────────────┴────────────┐
         │                         │
         │ 1:1                     │ 1:N
         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│     stores      │      │    products     │
│  ───────────────│      │  ───────────────│
│  id (PK)        │◄────►│  id (PK)        │
│  user_id (FK)   │      │  store_id (FK)  │
│  name           │      │  category_id(FK)│
│  description    │      │  name           │
│  logo_url       │      │  price          │
│  whatsapp       │      │  stock          │
│  redes sociales │      │  is_active      │
└─────────────────┘      └─────────────────┘
         │                         │
         │ 1:N                     │ 1:N
         ├─────────────┬───────────┤
         │             │           │
         ▼             ▼           ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│   banners   │ │ stories  │ │  categories  │
└─────────────┘ └──────────┘ └──────────────┘
         │
         │ 1:N
         ├─────────────┬─────────────┐
         │             │             │
         ▼             ▼             ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│    orders   │ │   ads    │ │ order_items  │
│  ───────────│ │  ────────│ └──────────────┘
│  id (PK)    │ │  id (PK) │        ▲
│  store_id   │ │  type    │        │ N:1
│  customer_* │ │  budget  │        │
│  total      │ │  is_active       │
│  status     │ └──────────┘        │
└─────────────┘                     │
         │                          │
         │ 1:N                      │
         └──────────────────────────┘
              order_items
```

---

## 📋 Definición de Tablas

### **1. auth.users** (Tabla de Supabase)
*Gestionada automáticamente por Supabase Auth*

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | `UUID` | Identificador único del usuario (PK) |
| `email` | `TEXT` | Email del usuario |
| `encrypted_password` | `TEXT` | Contraseña encriptada |
| `created_at` | `TIMESTAMPTZ` | Fecha de registro |
| `raw_user_meta_data` | `JSONB` | Metadatos adicionales |

---

### **2. perfiles**
*Perfil del usuario con información personal y referencia a su tienda*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK, FK → auth.users(id) | ID del usuario |
| `email` | `TEXT` | - | Email del usuario |
| `nombre` | `TEXT` | - | Nombre completo |
| `avatar_url` | `TEXT` | - | URL de la foto de perfil |
| `tienda_id` | `UUID` | FK → stores(id) | Referencia a su tienda |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última actualización |

**Relaciones:**
- `id` → `auth.users(id)` (1:1)
- `tienda_id` → `stores(id)` (N:1)

---

### **3. stores**
*Información de la tienda virtual del vendedor*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK, DEFAULT gen_random_uuid() | Identificador único |
| `user_id` | `UUID` | FK → auth.users(id), UNIQUE | Dueño de la tienda |
| `name` | `TEXT` | NOT NULL | Nombre de la tienda |
| `description` | `TEXT` | - | Descripción |
| `logo_url` | `TEXT` | - | URL del logo |
| `whatsapp` | `TEXT` | - | Número de WhatsApp |
| `tiktok` | `TEXT` | - | Usuario de TikTok |
| `instagram` | `TEXT` | - | Usuario de Instagram |
| `facebook` | `TEXT` | - | Página de Facebook |
| `website` | `TEXT` | - | Sitio web externo |
| `country` | `TEXT` | DEFAULT 'VE' | Código de país |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última actualización |

**Relaciones:**
- `user_id` → `auth.users(id)` (1:1)
- Tiene: `products` (1:N), `banners` (1:N), `categories` (1:N), `stories` (1:N), `ads` (1:N), `orders` (1:N)

---

### **4. categories**
*Categorías de productos de una tienda*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id), NOT NULL | Tienda a la que pertenece |
| `name` | `TEXT` | NOT NULL | Nombre de la categoría |
| `slug` | `TEXT` | NOT NULL | URL amigable |
| `position` | `INTEGER` | DEFAULT 0 | Orden de aparición |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- `store_id` → `stores(id)` (N:1)
- Tiene: `products` (1:N)

---

### **5. products**
*Productos de una tienda*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id), NOT NULL | Tienda dueña |
| `category_id` | `UUID` | FK → categories(id) | Categoría del producto |
| `name` | `TEXT` | NOT NULL | Nombre del producto |
| `description` | `TEXT` | - | Descripción detallada |
| `price` | `NUMERIC` | NOT NULL | Precio actual |
| `compare_price` | `NUMERIC` | - | Precio anterior (tachado) |
| `image_url` | `TEXT` | - | URL de la imagen |
| `stock` | `INTEGER` | DEFAULT 0 | Cantidad disponible |
| `is_active` | `BOOLEAN` | DEFAULT true | ¿Está activo? |
| `is_featured` | `BOOLEAN` | DEFAULT false | ¿Es destacado? |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última actualización |

**Relaciones:**
- `store_id` → `stores(id)` (N:1)
- `category_id` → `categories(id)` (N:1)
- Tiene: `order_items` (1:N)

---

### **6. banners**
*Banners publicitarios de una tienda (máximo 3)*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id), NOT NULL | Tienda dueña |
| `image_url` | `TEXT` | NOT NULL | URL de la imagen |
| `position` | `INTEGER` | CHECK (1-3), DEFAULT 1 | Posición (1, 2 o 3) |
| `is_active` | `BOOLEAN` | DEFAULT true | ¿Está activo? |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- `store_id` → `stores(id)` (N:1)

---

### **7. stories**
*Historias tipo Instagram (24h, promociones, anuncios)*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id) | Tienda dueña (NULL para ads globales) |
| `type` | `TEXT` | CHECK ('product', 'promotion', 'ad') | Tipo de historia |
| `title` | `TEXT` | - | Título |
| `image_url` | `TEXT` | - | URL de imagen |
| `video_url` | `TEXT` | - | URL de video |
| `link_url` | `TEXT` | - | Link al hacer clic |
| `is_paid` | `BOOLEAN` | DEFAULT false | ¿Es publicidad paga? |
| `views` | `INTEGER` | DEFAULT 0 | Contador de vistas |
| `expires_at` | `TIMESTAMPTZ` | - | Fecha de expiración (24h) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- `store_id` → `stores(id)` (N:1)

---

### **8. ads**
*Campañas publicitarias (tarjetas, historia, banner)*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id), NOT NULL | Tienda dueña |
| `type` | `TEXT` | CHECK ('card', 'story', 'banner') | Tipo de anuncio |
| `title` | `TEXT` | NOT NULL | Título del anuncio |
| `description` | `TEXT` | - | Descripción |
| `image_url` | `TEXT` | - | URL de imagen |
| `link_url` | `TEXT` | - | Link de destino |
| `priority` | `INTEGER` | DEFAULT 1 | Prioridad (mayor = más visible) |
| `budget` | `NUMERIC` | DEFAULT 0 | Presupuesto asignado ($USD) |
| `spent` | `NUMERIC` | DEFAULT 0 | Presupuesto gastado |
| `impressions` | `INTEGER` | DEFAULT 0 | Veces mostrado |
| `clicks` | `INTEGER` | DEFAULT 0 | Veces clickeado |
| `is_active` | `BOOLEAN` | DEFAULT true | ¿Está activo? |
| `starts_at` | `TIMESTAMPTZ` | - | Fecha de inicio |
| `ends_at` | `TIMESTAMPTZ` | - | Fecha de fin |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- `store_id` → `stores(id)` (N:1)

---

### **9. orders**
*Pedidos realizados a una tienda*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `store_id` | `UUID` | FK → stores(id), NOT NULL | Tienda receptora |
| `customer_name` | `TEXT` | NOT NULL | Nombre del cliente |
| `customer_email` | `TEXT` | - | Email del cliente |
| `customer_phone` | `TEXT` | - | Teléfono del cliente |
| `total` | `NUMERIC` | NOT NULL | Total del pedido |
| `status` | `TEXT` | CHECK, DEFAULT 'pending' | Estado del pedido |
| `notes` | `TEXT` | - | Notas adicionales |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Última actualización |

**Estados válidos:**
- `pending` → Pendiente
- `confirmed` → Confirmado
- `processing` → Procesando
- `shipped` → Enviado
- `delivered` → Entregado
- `cancelled` → Cancelado

**Relaciones:**
- `store_id` → `stores(id)` (N:1)
- Tiene: `order_items` (1:N)

---

### **10. order_items**
*Productos dentro de un pedido*

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | `UUID` | PK | Identificador único |
| `order_id` | `UUID` | FK → orders(id), NOT NULL | Pedido al que pertenece |
| `product_id` | `UUID` | FK → products(id), NOT NULL | Producto ordenado |
| `quantity` | `INTEGER` | CHECK (> 0), NOT NULL | Cantidad |
| `price` | `NUMERIC` | NOT NULL | Precio al momento del pedido |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- `order_id` → `orders(id)` (N:1)
- `product_id` → `products(id)` (N:1)

---

## 🔄 Flujo Completo del Sistema

### **1. Registro de Usuario**

```
Usuario → Supabase Auth → auth.users (INSERT)
                              ↓
                        Trigger automático
                              ↓
                         perfiles (INSERT)
                              ↓
                        stores (INSERT - opcional)
```

**Proceso:**
1. Usuario se registra con email/contraseña o Google OAuth
2. Supabase crea registro en `auth.users`
3. El trigger `handle_new_user` crea automáticamente un registro en `perfiles` con:
   - `id`: ID del usuario
   - `email`: Email del usuario
   - `nombre`: Nombre (si viene de Google OAuth)
4. Usuario crea su tienda → `stores` con `user_id = auth.users.id`

---

### **2. Configuración de Tienda**

```
Dashboard → Mi Tienda → stores (UPDATE/INSERT)
                              ↓
                       banners (INSERT/UPDATE/DELETE)
                              ↓
                       categories (INSERT/UPDATE/DELETE)
                              ↓
                       products (INSERT/UPDATE/DELETE)
```

**Proceso:**
1. Vendedor accede al dashboard
2. Configura información de su tienda (nombre, redes, WhatsApp)
3. Sube hasta 3 banners → `banners`
4. Crea categorías → `categories`
5. Agrega productos → `products` con `category_id`

---

### **3. Creación de Campañas Publicitarias**

```
Dashboard → Mis Campañas → Wizard (3 pasos)
                                   ↓
                              ads (INSERT)
                                   ↓
                         Si type='story' → stories (INSERT)
                         Si type='banner' → Sticky Footer
                         Si type='card' → Feed cards
```

**Tipos de campaña:**
- **Card (`tarjeta`)**: Aparece en el feed del dashboard
- **Story (`historia`)**: Historia de 24h en el carrusel (borde dorado si es paga)
- **Banner**: Aparece en el footer sticky rotativo

---

### **4. Publicación de Historias**

```
Dashboard → Historias → Subir imagen/video
                              ↓
                        stories (INSERT)
                              ↓
                        Visible 24h en carrusel
                              ↓
                        views++ cada vez que se ve
```

**Tipos de historia:**
- `product`: Historia sobre un producto
- `promotion`: Promoción especial
- `ad`: Publicidad paga (borde dorado, 10s duración)

---

### **5. Proceso de Compra (Cliente Final)**

```
Cliente → Catálogo → products (SELECT)
                ↓
           Añadir al carrito (localStorage)
                ↓
           Checkout → orders (INSERT)
                ↓
           order_items (INSERT por cada producto)
                ↓
           Email de confirmación
                ↓
           Vendedor ve el pedido en su dashboard
                ↓
           Actualiza status → orders (UPDATE)
```

**Estados del pedido:**
```
pending → confirmed → processing → shipped → delivered
                                                    ↓
                                              cancelled
```

---

### **6. Sistema de Alertas (Futuro)**

```
n8n Automation → Consulta products (stock < 5)
                       ↓
                 WhatsApp Business API
                       ↓
                 Notificación al vendedor
```

---

## 🔐 Seguridad y Aislamiento Multi-Tenant

### **Row Level Security (RLS)**

Cada tabla tiene políticas que garantizan:

- **Aislamiento**: Un vendedor SOLO ve sus propios datos
- **Lectura**: `SELECT WHERE store_id = (SELECT store_id FROM perfiles WHERE id = auth.uid())`
- **Escritura**: `INSERT/UPDATE WHERE store_id = (SELECT store_id FROM perfiles WHERE id = auth.uid())`

**Ejemplo de política:**
```sql
-- Usuarios solo pueden ver productos de SU tienda
CREATE POLICY "Vendedores ven sus productos" ON products
  FOR SELECT USING (
    store_id = (
      SELECT store_id FROM perfiles WHERE id = auth.uid()
    )
  );
```

### **Aislamiento por tienda_id**

Todas las tablas principales tienen `store_id`, lo que permite:
- Escalar a 10,000+ tiendas sin interferencia
- Consultas eficientes con índices en `store_id`
- Backups y restauración por tienda

---

## 📈 Optimizaciones Recomendadas

### **Índices Sugeridos**

```sql
-- Productos por tienda
CREATE INDEX idx_products_store_id ON products(store_id);

-- Productos por categoría
CREATE INDEX idx_products_category_id ON products(category_id);

-- Pedidos por tienda
CREATE INDEX idx_orders_store_id ON orders(store_id);

-- Anuncios activos
CREATE INDEX idx_ads_active ON ads(store_id, is_active) WHERE is_active = true;

-- Historias no expiradas
CREATE INDEX idx_stories_active ON stories(store_id, expires_at) 
  WHERE expires_at > NOW();
```

---

## 🔗 Relaciones Resumidas

| Tabla | Relación Con | Tipo | Descripción |
|-------|--------------|------|-------------|
| `perfiles` | `auth.users` | 1:1 | Un usuario tiene un perfil |
| `perfiles` | `stores` | N:1 | Un perfil puede tener una tienda |
| `stores` | `auth.users` | 1:1 | Una tienda tiene un dueño |
| `stores` | `products` | 1:N | Una tienda tiene muchos productos |
| `stores` | `categories` | 1:N | Una tienda tiene muchas categorías |
| `stores` | `banners` | 1:N | Una tienda tiene hasta 3 banners |
| `stores` | `stories` | 1:N | Una tienda tiene muchas historias |
| `stores` | `ads` | 1:N | Una tienda tiene muchas campañas |
| `stores` | `orders` | 1:N | Una tienda tiene muchos pedidos |
| `products` | `categories` | N:1 | Un producto pertenece a una categoría |
| `products` | `order_items` | 1:N | Un producto está en muchos pedidos |
| `orders` | `order_items` | 1:N | Un pedido tiene muchos items |

---

## 📊 Métricas Clave por Tabla

- **products**: 
  - Total de productos activos por tienda
  - Productos con stock bajo (< 5 unidades)
  - Productos destacados

- **orders**:
  - Ventas del día/mes
  - Pedidos pendientes
  - Ingresos totales

- **ads**:
  - ROI por campaña
  - CTR (clicks / impressions)
  - Presupuesto restante

- **stories**:
  - Vistas totales
  - Stories activas (no expiradas)
  - Engagement de historias pagas

---

*Documentación actualizada al esquema SQL actual del proyecto VENDER.*
