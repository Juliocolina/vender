# 🚀 VENDER - SaaS de Reportes IA para Tiendas Virtuales

**"Tu tienda responde por WhatsApp. Pregunta y recibe reportes al instante."**

VENDER es un asistente inteligente para dueños de tiendas virtuales que elimina la fricción administrativa, el uso de Excel manual y el estrés del emprendedor.

## 📋 Tabla de Contenidos
- [📖 Documentación Completa](#-documentación-completa)
- [🎯 Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Comenzar el Desarrollo](#-comenzar-el-desarrollo)
- [🔒 Seguridad y Despliegue](#-seguridad-y-despliegue)
- [📊 Estado del Proyecto](#-estado-del-proyecto)

## 📖 Documentación Completa

### **Documentación de Visión y Negocio**
- **[Flujo Completo del Sistema](docs/vision/flujo-sistema.md)** - Narrativa detallada de las 3 interfaces del sistema
- **[Documentación Maestra V3.0](docs/vision/documentacion-maestra.md)** - Guía maestra con visión general y reglas de oro

### **Documentación Técnica**
- **[Arquitectura Optimizada](docs/architecture/arquitectura-optimizada.md)** - Stack tecnológico y optimizaciones de ingeniería
- **[Configuración de Agentes](docs/architecture/)** - Configuraciones para agentes de IA

### **Guías Operativas**
- **[Guía de Despliegue](DEPLOYMENT_GUIDE.md)** - Instrucciones para despliegue en GitHub y Vercel
- **[Política de Seguridad](SECURITY.md)** - Medidas de seguridad y respuesta a incidentes

## 🎯 Características Principales

### **Para el Vendedor (Dueño de Tienda)**
- 🤖 **Asistente IA por WhatsApp** - Pregunta "Resumen", "Ventas", "Stock" y recibe respuestas instantáneas
- 📊 **Reportes Automáticos** - Ventas, inventario, finanzas generados automáticamente
- 🔔 **Alertas Proactivas** - Stock crítico, producto agotado, ventas inusuales
- 📱 **Panel de Control Moderno** - Dashboard intuitivo con métricas clave

### **Para el Comprador (Cliente)**
- 🛍️ **Catálogo Digital Profesional** - Más ordenado que 100 estados de WhatsApp
- 🛒 **Carrito Persistente** - Guarda productos aunque cierre el navegador
- 📄 **Facturación Automática** - Recibe facturas automáticamente por email
- ⭐ **Sistema de Reseñas** - Califica y comenta las tiendas

### **Para la Plataforma**
- 🏗️ **Arquitectura Modular** - Event-driven y serverless
- 📈 **Escalabilidad Masiva** - Desde 1 hasta 10,000 tiendas
- 💰 **Costo Cero Operativo** - Lanzamiento con capas gratuitas
- 🛡️ **Seguridad Robusta** - Multi-tenant aislado y backups automatizados

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico**
```
Frontend/API: Next.js 14 + React + TypeScript + Tailwind CSS (Vercel)
Backend: PostgreSQL + PgBouncer + n8n + Docker (VPS)
IA/Mensajería: DeepSeek API + WhatsApp Business API
Servicios: Cloudinary (imágenes), Stripe/MercadoPago (pagos)
```

### **Optimizaciones Implementadas**
- ✅ **Circuit Breaker en Webhooks** - Resiliencia ante fallos de servicios externos
- ✅ **Caching de Tasa BCV** - Reducción de latencia y consultas externas
- ✅ **Monitorización Heartbeat** - Verificación continua de disponibilidad
- ✅ **Backups Críticos** - `pg_dump` automatizado a almacenamiento seguro

## 🚀 Comenzar el Desarrollo

### **Requisitos**
- Node.js 18+ 
- npm, yarn, pnpm o bun
- Git

### **Instalación y Desarrollo**
```bash
# 1. Clonar el repositorio
git clone https://github.com/Juliocolina/vender.git
cd vender

# 2. Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
# o
bun install

# 3. Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### **Comandos Disponibles**
```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
npm run security-check # Verificación de seguridad
npm audit           # Auditoría de dependencias
```

## 🔒 Seguridad y Despliegue

### **Seguridad Implementada**
- 🔐 **GitHub Actions** - Escaneo continuo de seguridad
- 🕵️ **Secret Scanning** - Detección de secretos en código
- 📦 **Dependency Scanning** - Auditoría de dependencias vulnerables
- 🛡️ **Vercel Security Headers** - CSP, HSTS, X-Frame-Options
- 🔄 **Renovate** - Actualizaciones automáticas de dependencias

### **Despliegue Automático**
- **GitHub**: https://github.com/Juliocolina/vender
- **Vercel**: https://vender.vercel.app
- **CI/CD**: Pipeline automático en cada push a `main`

### **Variables de Entorno**
Consulta `.env.example` para configuración requerida.

## 📊 Estado del Proyecto

### **✅ Completado**
- [x] Landing page profesional
- [x] Configuración de seguridad completa
- [x] Documentación maestra del sistema
- [x] CI/CD pipeline automatizado
- [x] Despliegue en Vercel

### **🔄 En Progreso**
- [ ] Sistema de registro "Seguir con Google"
- [ ] Dashboard del vendedor
- [ ] CRUD de productos y pedidos
- [ ] Integración con PostgreSQL
- [ ] Automatizaciones con n8n

### **⏳ Planeado**
- [ ] Integración con DeepSeek API
- [ ] Sistema de alertas por WhatsApp
- [ ] Multi-tenancy completo
- [ ] Facturación automática

## 📞 Contacto y Soporte

- **Sitio Web**: https://vender.vercel.app
- **GitHub**: https://github.com/Juliocolina/vender
- **Email**: ovender401@gmail.com
- **Ubicación**: Sede Latam - Venezuela

---

**💡 Nota para Desarrolladores y Agentes de IA:**
Este proyecto sigue las "Reglas de Oro" definidas en la documentación maestra:
1. **Latencia** < 5 segundos para respuestas IA
2. **Aislamiento** multi-tenant estricto
3. **Resiliencia** priorizar integridad de datos
4. **Simplificación** usar herramientas probadas

*Documentación consolidada para armonía entre desarrollo humano y asistencia de IA.*
