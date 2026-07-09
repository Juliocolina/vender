Prompt para el Agente: Arquitectura de Feed y Monetización
"Actúa como arquitecto de software senior especializado en aplicaciones de marketing y social commerce. Necesito que definas la lógica de un Hub Central de Contenido para mi aplicación 'VENDER'.

Objetivos del Hub:

Dinámica de Feed: El feed principal debe ser dinámico, consumiendo tarjetas de un hub central. Este hub debe mezclar orgánicamente:

Productos de tiendas propias.

Publicidad pagada (anuncios).

Contenido de otras tiendas para generar 'distracción' y engagement.

Historias de Conversión: El componente de Historias no debe ser solo personal; debe priorizar una mezcla entre 'historias de usuarios' e 'historias de publicidad'. El sistema debe inyectar anuncios pagados en el flujo de historias para garantizar impresiones constantes.

Validación de Impresiones: La arquitectura debe priorizar la visibilidad de los anuncios pagados. El objetivo es que cualquier usuario que entre a la app perciba un flujo constante de tráfico, creando la sensación de que la plataforma impulsa activamente las ventas y el marketing digital.

Requerimientos técnicos:

El sistema debe implementar un algoritmo de intercalado (interleaving) donde se inserten tarjetas publicitarias cada X tarjetas orgánicas.

El hub debe permitir una configuración de prioridad para mostrar publicidad de clientes que hayan pagado por mayor visibilidad.

Los datos deben ser servidos dinámicamente mediante una API para que el dashboard nunca se sienta estático."









Prompt para el Agente: Desarrollo de la Vista "Mi Tienda"
"Actúa como desarrollador frontend experto en React/Next.js. Necesito implementar una nueva funcionalidad de gestión en mi dashboard de 'VENDER'.

Lógica de Transición:

El usuario accede a esta vista mediante un clic en el botón 'Tiendas' (que se renombrará a 'Mi Tienda') ubicado debajo de las métricas del perfil.

Al hacer clic, la aplicación no debe navegar a una URL externa ni recargar la página, sino realizar una transición de estado para renderizar la interfaz de 'Gestión de Tienda' dentro del área central del dashboard, manteniendo el menú lateral y el layout intactos.

Requerimientos de la Vista 'Mi Tienda':

Arquitectura por Pestañas: Implementar una navegación interna con pestañas (useState) para las siguientes secciones:

Información General: Edición de nombre de tienda, descripción, y subida/cambio de logo.

Banners: Gestor para subir hasta 3 banners promocionales.

Redes Sociales: Componente LinkSelector.tsx que permita configurar los enlaces de (WhatsApp, TikTok, Instagram, Facebook). Esta configuración es exclusiva para mostrar los canales de contacto del vendedor en su perfil.

Categorías y Productos: Interfaz para crear categorías y asignar productos a dichas categorías.

Comportamiento Visual:

Esta vista debe ser intuitiva y profesional, separando claramente la gestión de marca (descripción/enlaces) de la gestión operativa (productos).

La configuración realizada en el LinkSelector.tsx debe actualizar los iconos sociales que aparecen debajo de la descripción del vendedor en la vista pública.

Independencia: Esta configuración de redes sociales y tienda es totalmente independiente del 'Sticky Banner Footer' que reside en la sección de 'Campañas'. No debe haber mezcla de lógica entre ambas secciones."