================================================================================
                    FLUJO COMPLETO DEL SISTEMA VENDER
                    =================================
                    
                    Comportamiento del Sistema por Interfaces
                    Documentación para Agente de IA
                    
                    Versión: 1.0
                    Fecha: Junio 2026
================================================================================


¿QUÉ ES ESTE DOCUMENTO?
-----------------------
Este documento describe el flujo completo de comportamiento del sistema
VENDER, organizado por las tres interfaces principales que lo componen.
Está diseñado para que un agente de IA o un nuevo desarrollador entienda
rápidamente cómo funciona cada parte del sistema y cómo se comunican entre sí.

¿PARA QUÉ SIRVE?
----------------
- Para que el agente de IA sepa exactamente qué debe hacer
- Para que el agente de IA entienda el contexto de cada petición
- Para que el agente de IA sepa dónde debe mirar cuando tenga dudas
- Para que el agente de IA no ande perdido en tiempo y espacio

¿CÓMO SE USA?
-------------
Lee las tres secciones en orden:
1. Interfaz del Comprador → Entiende qué hace el cliente
2. Interfaz del Vendedor → Entiende qué hace el dueño de la tienda
3. Interfaz de la Plataforma → Entiende cómo funciona el sistema por dentro

Cada sección es un párrafo completo con todo el flujo de esa interfaz.


================================================================================
1. INTERFAZ DEL COMPRADOR (El que compra)
================================================================================

El comprador llega a la tienda de un vendedor a través de un enlace directo,
un subdominio (carmela.vender.com), un dominio propio, o buscando en
vender.com. Una vez dentro, visualiza el catálogo de productos en formato
cuadrícula o lista, con filtros por categoría, precio, disponibilidad y
calificación, y opciones de ordenamiento como más vendidos o precio. Puede
agregar productos al carrito, editar cantidades o eliminarlos, y el carrito
se guarda de forma persistente aunque cierre el navegador. Al finalizar la
compra, confirma su pedido, elige el método de pago (transferencia, pago
móvil o contra entrega), proporciona su correo electrónico para la factura,
su dirección de entrega y su número de teléfono. Si pagó por transferencia,
sube una foto o captura del comprobante. Luego, recibe notificaciones por
correo o WhatsApp cuando su pedido es confirmado, pagado, enviado o
entregado. Finalmente, después de recibir el producto, puede calificar la
tienda con estrellas y dejar una reseña escrita. El comprador no necesita
registrarse manualmente; si hace clic en "Seguir con Google", el sistema
crea un perfil interno con su nombre y correo, lo identifica en futuras
compras mediante una cookie o token, y le envía la factura automáticamente
sin que tenga que recordar contraseñas.


================================================================================
2. INTERFAZ DEL VENDEDOR (El que vende)
================================================================================

El vendedor, dueño de la tienda, accede a un panel de control donde puede
gestionar toda su operación. Desde allí edita su perfil con logo, descripción,
categoría, país, contacto y política de devolución; y completa las
verificaciones obligatorias como teléfono, correo, documento de identidad y
cuenta bancaria para obtener la insignia de "Verificado" y aparecer en el
buscador. Administra su catálogo agregando, editando o eliminando productos
con nombre, precio, stock, imágenes, categoría y variantes; y gestiona sus
categorías. En la sección de pedidos, visualiza todas las solicitudes de sus
clientes con estados como Pendiente, Pagado, En preparación, Enviado,
Entregado o Cancelado, junto con los datos del cliente, productos solicitados,
comprobante de pago y método de pago elegido. Revisa los comprobantes subidos
y confirma los pagos manualmente, lo que cambia automáticamente el estado del
pedido a "Pagado". También actualiza el estado de cada pedido a medida que
avanza el proceso de preparación y envío. En su panel de control ve métricas
clave como ventas del día, semana y mes, productos más vendidos, productos
agotados o con stock bajo, y un resumen de ganancias. Puede descargar
reportes en Excel o PDF, generar un enlace de referido para invitar a otros
vendedores y ganar beneficios, y recibe notificaciones por correo y WhatsApp
cuando un cliente hace un nuevo pedido, sube un comprobante, o califica y
comenta su tienda. También puede hacer preguntas por WhatsApp como "Resumen",
"Ventas", "Stock X", "Agotados", "Dólar", "Ganancia", "Top", "Semana",
"Ayuda" o "Alertas", y el sistema le responde automáticamente con la
información solicitada en segundos.


================================================================================
3. INTERFAZ DE LA PLATAFORMA (El sistema por dentro)
================================================================================

La plataforma VENDER opera con una arquitectura modular, event-driven y
serverless. El frontend y las API ligeras (CRUD de productos, pedidos,
tiendas, autenticación) viven en Vercel, mientras que el backend pesado
(base de datos PostgreSQL, PgBouncer para pool de conexiones, y el
orquestador n8n para automatizaciones) vive en un VPS con DigitalOcean o
Linode, todo contenerizado con Docker. La comunicación entre módulos es
mediante webhooks: por ejemplo, cuando se registra una venta y el stock
llega a cero, la API de Next.js envía un webhook a n8n, que genera y envía
una alerta por WhatsApp al vendedor. La inteligencia artificial con
DeepSeek API procesa las preguntas del vendedor por WhatsApp: cuando el
vendedor escribe "Resumen", el mensaje llega a n8n, este consulta la base
de datos, envía los datos a DeepSeek, recibe el reporte en lenguaje natural
y lo envía de vuelta por WhatsApp en segundos. n8n también tiene
temporizadores que envían reportes de cierre cada día a las 6 PM y resúmenes
de stock crítico cada mañana a las 8 AM. La facturación es automática: si
el cliente sigue la tienda con Google, el sistema tiene su correo y le
envía la factura automáticamente; si no lo sigue, se pide el correo al
momento de la compra o se ofrece descargar el PDF. Las copias de seguridad
de toda la base de datos se realizan automáticamente todos los días a las
2 AM y se guardan en un lugar separado. Y todo el sistema está preparado
para escalar desde 1 hasta miles de tiendas sin rediseño arquitectónico.


================================================================================
4. FLUJO DE COMUNICACIÓN ENTRE INTERFACES
================================================================================

La comunicación entre las tres interfaces sigue un flujo claro y predecible:

1. El comprador interactúa con el frontend (Vercel) para navegar, comprar,
   pagar y calificar.

2. Cada acción del comprador (agregar producto, hacer pedido, subir
   comprobante) se envía a las API Routes de Next.js (también en Vercel).

3. La API guarda toda la información en la base de datos PostgreSQL
   (en el VPS) y, cuando es necesario, envía webhooks a n8n.

4. n8n (en el VPS) procesa los webhooks, consulta la base de datos,
   llama a DeepSeek API cuando necesita generar reportes, y envía
   notificaciones al vendedor por WhatsApp o correo.

5. El vendedor recibe notificaciones en su teléfono (WhatsApp) y en
   su panel de control (Vercel).

6. El vendedor también puede iniciar la comunicación preguntando por
   WhatsApp, y el flujo se invierte: WhatsApp → n8n → BD → DeepSeek →
   n8n → WhatsApp.

7. Los reportes programados (cierre de día, stock crítico) son iniciados
   por temporizadores en n8n y siguen el mismo flujo: n8n → BD → DeepSeek
   → n8n → WhatsApp.


================================================================================
5. RESUMEN VISUAL PARA EL AGENTE IA
================================================================================

| Interfaz | ¿Qué hace? | ¿Cómo se comunica? |
|----------|------------|-------------------|
| Comprador | Navega, agrega al carrito, compra, paga, recibe notificaciones, califica | Frontend → API → BD → n8n → WhatsApp/Correo |
| Vendedor | Gestiona tienda, productos, pedidos, confirma pagos, ve métricas, recibe alertas, pregunta por WhatsApp | Panel de control → API → BD → n8n → WhatsApp |
| Plataforma | API, BD, n8n, DeepSeek, backups, webhooks, eventos, temporizadores | Módulos independientes conectados por webhooks |

================================================================================
FIN DEL DOCUMENTO
================================================================================