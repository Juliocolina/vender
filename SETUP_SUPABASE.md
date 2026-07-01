# 🚀 Configuración de Supabase para VENDER

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y regístrate
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (aproximadamente 2 minutos)

### 2. Obtener Credenciales de Supabase
En el dashboard de tu proyecto Supabase:
- Ve a **Settings** → **API**
- Copia:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Crea una credencial **OAuth 2.0 Client ID**
   - Tipo de aplicación: **Web application**
   - Orígenes autorizados: `http://localhost:3000`
   - URI de redireccionamiento autorizados: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/api/auth/callback`
5. Copia:
   - **Client ID** → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

### 4. Configurar OAuth en Supabase
1. En Supabase, ve a **Authentication** → **Providers**
2. Habilita **Google**
3. Pega tus credenciales de Google OAuth
4. Guarda los cambios

### 5. Crear Tabla `stores` en Supabase
1. Ve a **Table Editor** en Supabase
2. Crea nueva tabla llamada `stores` con esta estructura SQL:

```sql
-- Tabla de tiendas
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Asegurar que cada usuario tenga solo una tienda
  UNIQUE(user_id)
);

-- Crear índices para mejor performance
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_stores_created_at ON stores(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Crear política: usuarios solo pueden ver/editar sus propias tiendas
CREATE POLICY "Users can manage their own stores"
  ON stores
  FOR ALL
  USING (auth.uid() = user_id);
```

### 6. Actualizar Archivo `.env`
Edita el archivo `.env` en la raíz del proyecto con tus credenciales:

```env
# Next.js Configuration
NEXT_PUBLIC_APP_NAME=VENDER
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
```

## 🔧 Verificar Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Probar autenticación:**
   - Haz clic en "Empezar" en la navbar
   - Selecciona "Registrarse con Google"
   - Completa el onboarding
   - Deberías ser redirigido al dashboard

## 🚨 Solución de Problemas

### ❌ Error: "La tabla 'stores' no existe"
Ejecuta el SQL de creación de tabla en el **SQL Editor** de Supabase

### ❌ Error: "Google OAuth no configurado"
Verifica que:
- Las credenciales de Google estén correctas en `.env`
- Los URIs de redirección estén configurados en Google Cloud
- Google OAuth esté habilitado en Supabase

### ❌ Error: "Cannot read properties of undefined (reading 'auth')"
Reinicia el servidor de desarrollo:
```bash
npm run dev
```

## 📝 Próximos Pasos

1. **Configurar dominio de producción** en Google OAuth
2. **Agregar más campos** a la tabla `stores` según necesidades
3. **Implementar más tablas** (products, orders, customers)
4. **Configurar backups automáticos** en Supabase

---

**✅ Clerk ha sido completamente eliminado y reemplazado por Supabase.**

**✅ Google OAuth está configurado como único proveedor de autenticación.**

**✅ Middleware actualizado para proteger rutas con Supabase.**

**✅ Sistema multi-tenant listo para escalar desde 1 hasta 10,000 tiendas.**