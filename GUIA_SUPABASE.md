# 🔧 GUÍA PRÁCTICA: Configurar Supabase para VENDER

## 🚀 PASO 1: Crear Proyecto en Supabase

### 1.1 Ir a [supabase.com](https://supabase.com)
- Regístrate o inicia sesión
- Haz clic en **"New Project"**

### 1.2 Configurar proyecto:
- **Name**: `vender-app` (o el nombre que prefieras)
- **Database Password**: @Julio24717142
- **Region**: Elige la más cercana (ej: `South America (São Paulo)`)
- **Pricing Plan**: Selecciona **FREE**

### 1.3 Esperar aprox. 2 minutos
- Supabase creará automáticamente:
  - Base de datos PostgreSQL
  - Authentication
  - Storage
  - API REST

## 📋 PASO 2: Obtener Credenciales de Supabase

### 2.1 En el Dashboard de tu proyecto:
- Ve a **Settings** → **API**
- Copia estas 3 credenciales:

```
Project URL → NEXT_PUBLIC_SUPABASE_URL
anon/public key → NEXT_PUBLIC_SUPABASE_ANON_KEY  
service_role key → SUPABASE_SERVICE_ROLE_KEY
```

### 2.2 Actualizar archivo `.env`:
```bash
# Abre el archivo .env y reemplaza:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 🔐 PASO 3: Configurar Google OAuth

### 3.1 Ir a [Google Cloud Console](https://console.cloud.google.com)
- Crea un nuevo proyecto o usa uno existente
- Ve a **APIs & Services** → **Credentials**

### 3.2 Crear Credencial OAuth 2.0:
- **Tipo de aplicación**: Web application
- **Nombre**: VENDER OAuth
- **Orígenes autorizados**: `http://localhost:3000`
- **URI de redireccionamiento autorizados**:
  ```
  http://localhost:3000/auth/callback
  http://localhost:3000/api/auth/callback
  ```

### 3.3 Obtener credenciales:
```
Client ID → NEXT_PUBLIC_GOOGLE_CLIENT_ID
Client Secret → GOOGLE_CLIENT_SECRET
```

### 3.4 Actualizar `.env`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

## 🗄️ PASO 4: Configurar OAuth en Supabase

### 4.1 En Supabase Dashboard:
- Ve a **Authentication** → **Providers**
- Habilita **Google**
- Pega tus credenciales de Google:
  - Client ID
  - Client Secret

### 4.2 Configurar redirect URL en Supabase:
- Ve a **Authentication** → **URL Configuration**
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

## 🛠️ PASO 5: Crear Tabla `stores`

### 5.1 En Supabase Dashboard:
- Ve a **Table Editor**
- Haz clic en **"Create a new table"**

### 5.2 Crear tabla con SQL:
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

### 5.3 Ejecutar SQL:
- Ve a **SQL Editor** en Supabase
- Pega el SQL anterior
- Haz clic en **"Run"**

## 🚦 PASO 6: Probar Todo

### 6.1 Iniciar servidor:
```bash
# Asegúrate de usar Node.js 22
. ~/.nvm/nvm.sh && nvm use 22.19.0

# Iniciar servidor
npm run dev
```

### 6.2 Probar flujo completo:
1. **Visitar**: `http://localhost:3000`
2. **Haz clic en "Empezar"**
3. **Selecciona "Registrarse con Google"**
4. **Autoriza con tu cuenta Google**
5. **Completa onboarding** (store name, whatsapp)
6. **Deberías ser redirigido a /dashboard**

## 🐛 PASO 7: Solución de Problemas

### ❌ Error: "Invalid login credentials"
- Verifica que las credenciales de Google OAuth estén correctas en Supabase
- Asegúrate de que los Redirect URIs estén configurados

### ❌ Error: "Table 'stores' does not exist"
- Ejecuta el SQL de creación de tabla en Supabase

### ❌ Error: "Google OAuth not configured"
- Verifica Client ID y Client Secret en `.env`
- Verifica que Google OAuth esté habilitado en Supabase

### ❌ Error: "Cannot read properties of undefined"
- Reinicia el servidor: `npm run dev`
- Verifica que Node.js sea v22: `node --version`

## ✅ PASO 8: Verificación Final

### 8.1 Verificar en Supabase:
- Ve a **Authentication** → **Users**
- Deberías ver tu usuario registrado

### 8.2 Verificar en Database:
- Ve a **Table Editor** → **stores**
- Deberías ver los datos de tu tienda

### 8.3 Verificar en la app:
- Inicia sesión con Google
- Completa onboarding
- Deberías ver tu dashboard

---

## 📞 Soporte Rápido

### **Variables de entorno necesarias:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

### **Comandos útiles:**
```bash
# Ver Node.js version
node --version

# Usar Node.js 22
. ~/.nvm/nvm.sh && nvm use 22.19.0

# Iniciar servidor
npm run dev

# Ver logs de autenticación
tail -f .next/logs/next-development.log
```

---

**🎉 ¡Listo! Tu aplicación VENDER ahora tiene:**
- ✅ Autenticación con Google
- ✅ Base de datos PostgreSQL
- ✅ Sistema multi-tenant (cada usuario su tienda)
- ✅ Panel de control protegido
- ✅ Escalabilidad desde 1 hasta 10,000 tiendas