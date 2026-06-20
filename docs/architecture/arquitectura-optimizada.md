# SISTEMA "VENDER"
## SaaS de Reportes IA para Tiendas Virtuales
### Documentación Técnica y Funcional - Actualizada con Optimizaciones de Ingeniería

---

## 1. VISIÓN GENERAL DEL SISTEMA
El sistema es un ASISTENTE INTELIGENTE para dueños de tiendas virtuales que:
1. Responde preguntas en lenguaje natural por WhatsApp/Telegram.
2. Genera reportes automáticos de ventas, inventario y finanzas.
3. Envía alertas proactivas cuando hay problemas.
4. Funciona 24/7 con costos extremadamente bajos.
5. Escala desde 1 hasta miles de tiendas.

---

## 2. ARQUITECTURA TÉCNICA Y OPTIMIZACIONES
Esta arquitectura sigue un enfoque **Event-Driven y Serverless**.

### Sugerencias de Ingeniería Implementadas:
* **Circuit Breaker en Webhooks**: Implementación de lógica de reintento y protección en n8n para servicios externos (WhatsApp/DeepSeek).
* **Caching de Tasa BCV**: Implementado caché en base de datos/memoria para reducir consultas externas innecesarias y latencia.
* **Monitorización de Heartbeat**: Configuración de monitoreo externo para asegurar la disponibilidad del VPS (n8n + PostgreSQL).

### Stack Tecnológico:
- **Frontend/API**: Next.js, React, Tailwind, TypeScript (Vercel).
- **Backend Pesado**: PostgreSQL, PgBouncer, n8n, Node.js, Docker (VPS DigitalOcean/Linode).
- **IA/Mensajería**: DeepSeek API, WhatsApp Business API.

---

## 3. FLUJOS DE COMUNICACIÓN Y ALERTAS
El sistema opera mediante la cadena: `Usuario` → `Frontend/API` → `PostgreSQL` → `n8n` → `IA` → `WhatsApp/Email`.

### Alertas Automáticas (Sin preguntar):
1. **Producto Agotado**: Alerta inmediata.
2. **Stock Crítico**: Aviso preventivo.
3. **Variación del Dólar**: Basado en tasa BCV cacheada.
4. **Venta Inusual**: Detección de patrones de alto valor.

---

## 4. ESTRATEGIA DE COSTOS Y LANZAMIENTO
Lanzamiento con **Costo Cero Operativo** mediante:
- Uso de capas gratuitas en Vercel, Supabase y servicios de correo (Resend).
- Registro vía email (gratuito) vs WhatsApp (costoso).
- Notificaciones transaccionales por WhatsApp activadas solo para clientes activos.

---

## 5. CONCLUSIÓN
"VENDER" permite que cualquier dueño de tienda virtual tenga un asistente inteligente. Sin Excel, sin cálculos, sin estrés. Solo tú, tu celular y tu negocio.
