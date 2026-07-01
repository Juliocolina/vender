# 🔍 TEST DE CONEXIÓN SUPABASE

## 📊 Estado Actual del Proyecto

### ✅ COMPLETADO:
1. **Node.js 22.19.0** configurado ✓
2. **Clerk eliminado completamente** ✓
3. **Supabase configurado en código** ✓
4. **Google OAuth implementado** ✓
5. **Middleware protegiendo rutas** ✓
6. **Servidor funcionando** ✓ (`http://localhost:3000`)

### ⚠️ PENDIENTE (Requiere Acción TUYA):
1. **Crear proyecto en Supabase.com**
2. **Configurar Google OAuth en Google Cloud**
3. **Obtener credenciales y ponerlas en `.env`**
4. **Crear tabla `stores` en Supabase**

## 🧪 Pruebas que puedes hacer AHORA:

### 1. Verificar servidor local:
```bash
# Abre en navegador:
http://localhost:3000
```

### 2. Verificar estructura de componentes:
- ✅ **Navbar**: Botones "Empezar" y "Dashboard"
- ✅ **AuthModal**: Abre con botón "Empezar"
- ✅ **Dashboard**: Ruta protegida (redirige si no autenticado)
- ✅ **Onboarding**: Formulario para crear tienda

### 3. Probar flujo (sin credenciales):
1. Haz clic en **"Empezar"**
2. Modal se abre con **"Registrarse con Google"**
3. Al hacer clic → Error (falta configurar Google OAuth)
4. **ESPERADO**: Error de configuración (no hay credenciales)

## 🔧 SIGUIENTES PASOS (TIENES QUE HACERLOS):

### PASO 1: Crear Proyecto Supabase (5 min)
1. Ve a **supabase.com** → New Project
2. Nombre: `vender-app`
3. Región: `South America (São Paulo)`
4. Plan: **FREE**

### PASO 2: Obtener Credenciales (2 min)
En Supabase Dashboard → Settings → API:
- Copia: **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copia: **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### PASO 3: Configurar Google OAuth (10 min)
1. Ve a **console.cloud.google.com**
2. Crea credencial OAuth 2.0 Web
3. Redirect URIs:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/api/auth/callback
   ```
4. Copia: **Client ID** y **Client Secret**

### PASO 4: Actualizar `.env` (1 min)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

### PASO 5: Habilitar OAuth en Supabase (2 min)
1. Supabase → Authentication → Providers
2. Habilita **Google**
3. Pega Client ID y Client Secret

### PASO 6: Crear Tabla `stores` (1 min)
Ejecuta este SQL en Supabase → SQL Editor:
```sql
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## 🚨 SOLUCIÓN RÁPIDA SI HAY ERRORES:

### Error: "Invalid supabase url"
```bash
# Verifica que .env tenga formato correcto:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

### Error: "Google OAuth not configured"
```bash
# Reinicia servidor después de actualizar .env
npm run dev
```

### Error: "Table 'stores' does not exist"
```sql
-- Ejecuta en Supabase SQL Editor:
CREATE TABLE stores (...);
```

## 📞 ACCIÓN INMEDIATA:

**¿Quieres que te guíe paso a paso para:**
1. ¿Crear el proyecto en Supabase AHORA?
2. ¿Configurar Google OAuth juntos?
3. ¿Probar el servidor con credenciales de prueba?

**O prefieres hacerlo tú mismo con la guía `GUIA_SUPABASE.md`?**

---

**🎯 RESUMEN:** 
- **Backend listo**: 100%
- **Frontend listo**: 100%
- **Base de datos**: 0% (necesitas crear proyecto)
- **Autenticación**: 0% (necesitas credenciales Google)

**⏰ Tiempo estimado para completar: 15-20 minutos**