# ¡Bienvenido a Synura!

## ¿Qué es Synura?
Synura es una aplicación versátil que te permite navegar contenido de varias fuentes utilizando potentes mini-aplicaciones llamadas "extensiones". Piensa en ello como un navegador, pero en lugar de sitios web, utilizas extensiones para obtener contenido en un formato de aplicación nativa limpio.

## Conceptos Clave para Usuarios

*   **Descubrimiento de Extensiones**: Ingresa un dominio (por ejemplo, `example.com` o `https://example.com`) para obtener automáticamente el archivo `synura.js` de ese dominio. Si no se proporciona protocolo, se utiliza `https://` por defecto. Esta es la forma principal de instalar extensiones desde sus sitios web oficiales.
*   **Instalación Directa**: Ingresa una URL completa (por ejemplo, `https://raw.githubusercontent.com/user/repo/main/synura.js`) para instalar un script de extensión específico. **Nota de Seguridad**: Este método está restringido a dominios de confianza (como GitHub, GitLab, etc.) para prevenir la ejecución de código malicioso. No uses esto para dominios generales.
*   **Validación de Lista Blanca**: Las instalaciones directas por URL se validan contra una lista blanca de dominios permitidos por seguridad. El descubrimiento de dominios omite esta comprobación para permitir la exploración.
*   **Extensiones**: Estos son pequeños complementos que obtienen y muestran contenido. Por ejemplo, podrías tener una extensión para un sitio de noticias, una plataforma de video o un feed de redes sociales. Puedes instalar nuevas extensiones para expandir lo que puedes hacer con Synura.
*   **Entornos de Ejecución (Runtimes)**: Cuando abres una extensión, se ejecuta en un "entorno de ejecución". Puedes tener múltiples entornos abiertos a la vez, igual que tener múltiples pestañas en un navegador web. Cada entorno es una instancia separada de una extensión. Puedes cambiar entre ellos, e incluso tener múltiples entornos para la misma extensión.
*   **Marcadores**: ¿Encontraste algo interesante? Puedes marcar la vista actual para guardarla para más tarde. Un marcador guarda el estado exacto de la vista, para que puedas volver a ella en cualquier momento.

## Navegando por la Aplicación

### La Pantalla Principal
La pantalla principal de la aplicación es donde gestionas tus entornos de ejecución. La barra superior (barra de aplicación) es tu herramienta principal de navegación.

### La Barra de Aplicación

La barra de aplicación tiene varios iconos que te ayudan a navegar y gestionar tu contenido. Algunos iconos tienen **atajos ocultos** a los que se accede con una pulsación larga:

*   **`+` (Agregar)**:
    *   **Tocar**: Abrir un nuevo entorno de ejecución. Puedes elegir una extensión instalada o ingresar un dominio/URL de sitio web para instalar una nueva.
    *   **Pulsación Larga**: Abrir la pantalla de **Gestión de Extensiones** para ver detalles sobre tus extensiones instaladas.
*   **Menú Desplegable (centro)**: Muestra el entorno de ejecución actualmente activo. Toca para cambiar entre entornos abiertos, o desliza a la izquierda/derecha en el desplegable para recorrerlos.
*   **`X` (Cerrar)**: Cierra el entorno de ejecución actual.
*   **`↻` (Actualizar)**: *Visible solo en Modo Desarrollador.* Actualiza la extensión actual desde su fuente.
*   **`✨` (IA)**:
    *   **Tocar**: Abrir el **Menú de IA** para acciones rápidas (Resumir, Traducir, etc.).
    *   **Pulsación Larga**: Abrir **Configuración de IA** para configurar proveedores y preferencias.
*   **`☆` (Agregar Marcador)**:
    *   **Tocar**: Guardar la vista actual en tus marcadores.
    *   **Pulsación Larga**: Ir directamente a tu lista de **Marcadores**.
*   **`🔖` (Marcadores)**: Ver tu lista de marcadores guardados.
*   **`⚙️` (Configuración)**: Abrir la pantalla principal de configuración.

Si la pantalla es demasiado estrecha, algunas opciones pueden moverse a un menú de tres puntos.

### Botón de IA (`✨`)
Toca el **botón de IA** en la barra de aplicación para abrir el **Diálogo del Menú de IA**. Esto te da características impulsadas por IA bajo demanda para la vista actual:

*   **Resumen**: Obtén un resumen rápido generado por IA del contenido en pantalla.
*   **Traducir**: Traduce el contenido a tu idioma de destino (configurado en Configuración de IA).
*   **Prompt Personalizado**: Ingresa tus propias instrucciones para que la IA analice el contenido.
*   **Compartir a IA Externa**: Exporta el contenido de la vista actual a aplicaciones de IA externas como ChatGPT o Gemini en tu dispositivo.
*   **Alternar Caché**: Controla si usar resultados de IA en caché o forzar un nuevo análisis.

Para una configuración detallada de IA, ve a **Configuración > Configuración de IA** donde puedes:
*   Configurar tu proveedor de IA preferido (Gemini, OpenAI, DeepSeek, Claude).
*   Establecer idiomas de origen y destino para la traducción.
*   Elegir el rango de búsqueda de análisis (Profundo es solo en Vista de Lista) y perfil (Resumen, Explicar, Simplificar, Verificación de Hechos, Crítica, Perspicacia).
*   Ajustar las preferencias de longitud del resumen.
*   Ver estadísticas de uso de tokens.
*   Gestionar claves API para cada proveedor.

### Marcadores
La pantalla de marcadores muestra todas tus vistas guardadas.

*   **Instantánea de Vista**: Tocar un marcador abre una **instantánea en caché** de la página tal como estaba cuando la guardaste. Esto es genial para consultar información rápidamente sin necesitar conexión a internet.
*   **Restaurar Vista**: Para interactuar con la página de nuevo (por ejemplo, hacer clic en enlaces, actualizar datos), busca el **icono de restaurar**. Tocar esto reconectará a la extensión y traerá la vista de vuelta a la vida en un nuevo entorno de ejecución.

## Configuración (`⚙️`)

La pantalla de configuración te permite ajustar casi todos los aspectos de tu experiencia en Synura.

### Extensiones
*   **Instalar Nuevas Extensiones**: Toca el botón **`+`** en la barra de aplicación e ingresa el dominio del sitio web (por ejemplo, `https://example.com`). Si el sitio soporta Synura, la extensión se descubrirá e instalará automáticamente.
*   **Gestionar Extensiones**: Toca **Gestionar** para ver una lista de tus extensiones instaladas, donde puedes actualizarlas o eliminarlas.

### Apariencia
*   **Ajustar Densidad de Contenido**: Usa el control deslizante para hacer que el contenido parezca más espaciado o más compacto. Verás una vista previa en vivo de cómo afecta a listas y tarjetas.
*   **Tema de Color**: Personaliza el aspecto de la aplicación eligiendo entre esquemas de color **Claro**, **Oscuro** y **Monokai**.
*   **Peso de Fuente**: Ajusta el grosor del texto a tu preferencia (por ejemplo, ligero, regular, negrita).
*   **Idioma**: Establecer el idioma de la aplicación. Puedes elegir un idioma específico o hacer que siga el predeterminado de tu sistema.

### Comportamiento
*   **Tiempo de Espera de Red**: Establece cuánto tiempo debe esperar la aplicación una respuesta de una solicitud de red, de 1 a 60 segundos.
*   **Configuración de Proxy**: Configura un servidor proxy para solicitudes de red.
*   **Configuración de Caché**: Gestiona la caché de la aplicación, incluyendo borrar datos en caché para liberar espacio.
*   **Animación GIF**: Controla cómo se reproducen los GIFs animados: **Desactivado** (imagen estática), **Una vez** (reproducir una vez), o **Bucle** (reproducir continuamente).

### Video y Audio
*   **Reproducción Automática de Video**: Un interruptor para controlar si los videos comienzan a reproducirse automáticamente cuando aparecen en pantalla.
*   **Reproducción de Video en Segundo Plano**: Habilita esto para seguir escuchando el audio de un video incluso después de navegar a otro lugar o cambiar a otra aplicación.
*   **Mezclar con Otros**: Permitir que el audio de Synura se reproduzca al mismo tiempo que el audio de otras aplicaciones.
*   **Horas de DVR de Reproducción en Vivo**: Para transmisiones en vivo, elige cuántas horas de la transmisión mantener disponibles para buscar hacia atrás (de 0 a 6 horas).

### Privacidad y Seguridad
*   **Gestionar Configuración**: Configura varias opciones de privacidad y seguridad para controlar qué datos se almacenan y comparten.

### Acerca de
*   **Licencias de Código Abierto**: Ver las licencias del software de código abierto que ayuda a impulsar Synura.

---
*Este documento es para usuarios finales. Para documentación de desarrolladores, por favor consulta [Comenzando](getting_started.md), la [Referencia de API](api_reference.md), y [Ejemplos](examples.md).*