# DOCUMENTACIÓN MAESTRA DEL SISTEMA VENDER (V3.0)
## Guía para el Agente de IA y Desarrollo

---

## 1. VISIÓN GENERAL
**VENDER** es un SaaS de reportes e inteligencia artificial para tiendas virtuales, diseñado para escalar masivamente con una arquitectura modular, *event-driven* y *serverless*.
* **Esencia:** "Tu tienda responde por WhatsApp. Pregunta y recibe reportes al instante."
* **Objetivo:** Eliminar la fricción administrativa, el uso de Excel manual y el estrés del dueño de tienda.

---

## 2. ARQUITECTURA TÉCNICA (Diseño Modular)
### Componentes y Ubicación
* **Vercel (Frontend & API Ligeras):** Landing page, Dashboard, API Routes (CRUD de productos, pedidos, tiendas).
* **VPS (DigitalOcean/Linode - Backend Pesado):** * **PostgreSQL:** Base de datos relacional (Multi-tenant aislado).
    * **PgBouncer:** Pooler de conexiones para optimizar el acceso a la BD.
    * **n8n:** Orquestador de automatizaciones (el "cerebro" que conecta todo).
    * **Docker:** Contenerización de todos los servicios del backend.
* **Servicios Externos:** DeepSeek API (IA), WhatsApp Business API, Cloudinary (imágenes), Stripe/MercadoPago (pagos).

### Optimizaciones de Ingeniería (Implementadas)
1.  **Circuit Breaker en Webhooks:** Lógica de reintento en n8n para proteger contra caídas de servicios externos.
2.  **Caching de Tasa BCV:** Uso de caché local para evitar latencia y bloqueos de consultas al BCV.
3.  **Monitorización Heartbeat:** Ping externo cada minuto para verificar la salud del VPS.
4.  **Backups Críticos:** `pg_dump` automatizado enviado a almacenamiento seguro e independiente fuera del servidor principal.

---

## 3. FLUJO DE COMUNICACIÓN (Event-Driven)
El sistema opera bajo una arquitectura basada en eventos que conectan las tres interfaces:

1.  **Comprador:** Navega (Frontend), compra (API), califica.
2.  **Vendedor:** Gestiona catálogo (Panel), recibe alertas proactivas (WhatsApp), pregunta por resúmenes (WhatsApp → IA).
3.  **Plataforma:** Orquesta los eventos (n8n), procesa con IA (DeepSeek), guarda datos (PostgreSQL).

---

## 4. FRONTEND Y EXPERIENCIA DE USUARIO (UX)
* **Registro:** Flujo simplificado "Seguir con Google" (identidad interna mediante cookie/token).
* **Carrito:** Persistente en `localStorage` sincronizado con la BD al confirmar.
* **Acceso:** Buscador global (vender.com), subdominios (tienda.vender.com) o dominio propio.
* **Facturación:** Automática si el cliente es seguidor, o manual vía descarga de PDF.
* **Reseñas:** Sistema de calificación post-entrega con moderación no destructiva.
* **Importación Masiva:** Vital para tiendas grandes (vía Excel/CSV).

---

## 5. ESTRATEGIA DE COSTOS Y NEGOCIO
* **Lanzamiento:** Costo operativo cercano a $0 utilizando capas gratuitas de Vercel/Supabase.
* **Escalabilidad:** ~$0.33 - $0.58 por tienda al mes.
* **Modelo:** SaaS escalable de 1 a 10,000 tiendas con ~94% de margen de ganancia.

---

## 6. REGLAS DE ORO PARA EL AGENTE DE IA
1.  **Latencia:** Siempre optimiza los prompts para que la respuesta de IA no exceda los 5 segundos totales.
2.  **Aislamiento:** Nunca mezcles datos entre tiendas. Usa siempre filtros `WHERE tienda_id = X` en PostgreSQL.
3.  **Resiliencia:** Si la IA o el API de WhatsApp fallan, prioriza la integridad de la transacción en la base de datos.
4.  **Simplificación:** No reinventar la rueda (ej. usar Clerk/NextAuth para auth, `pg_dump` para backups).

---
*Documento consolidado para armonía entre desarrollo humano y asistencia de IA.*
