# ¡Bienvenido a Synura!

## ¿Qué es Synura?
Synura es una aplicación versátil que te permite navegar por contenido de varias fuentes utilizando potentes mini-aplicaciones llamadas "extensiones". Piénsalo como un navegador, pero en lugar de sitios web, utilizas extensiones para obtener contenido en un formato de aplicación nativa limpio.

## Conceptos Básicos para Usuarios

*   **Descubrimiento de Extensiones**: Ingresa un dominio (por ejemplo, `example.com` o `https://example.com`) para obtener automáticamente el archivo `synura.js` de ese dominio. Si no se proporciona protocolo, se utiliza `https://` por defecto. Esta es la forma principal de instalar extensiones desde sus sitios web oficiales.
*   **Instalación Directa**: Ingresa una URL completa (por ejemplo, `https://raw.githubusercontent.com/user/repo/main/synura.js`) para instalar un script de extensión específico. **Nota de Seguridad**: Este método está restringido a dominios de confianza (como GitHub, GitLab, etc.) para evitar la ejecución de código malicioso. No uses esto para dominios generales.
*   **Validación de Lista Blanca**: Las instalaciones directas por URL se validan contra una lista blanca de dominios permitidos por seguridad. El descubrimiento de dominios omite esta comprobación para permitir la exploración.
*   **Extensiones**: Estos son pequeños complementos que obtienen y muestran contenido. Por ejemplo, podrías tener una extensión para un sitio de noticias, una plataforma de video o un feed de redes sociales. Puedes instalar nuevas extensiones para expandir lo que puedes hacer con Synura.
*   **Runtimes (Entornos de Ejecución)**: Cuando abres una extensión, se ejecuta en un "runtime". Puedes tener múltiples runtimes abiertos a la vez, igual que tener múltiples pestañas en un navegador web. Cada runtime es una instancia separada de una extensión. Puedes cambiar entre ellos e incluso tener múltiples runtimes para la misma extensión.
*   **Marcadores**: ¿Encontraste algo interesante? Puedes marcar la vista actual para guardarla para más tarde. Un marcador guarda el estado exacto de la vista, para que puedas volver a ella en cualquier momento.

## Navegando por la Aplicación

### La Pantalla Principal
La pantalla principal de la aplicación es donde administras tus runtimes. La barra superior (barra de aplicación) es tu herramienta de navegación principal.

### La Barra de Aplicación

La barra de aplicación tiene varios íconos:

*   **`+` (Agregar)**: Toca esto para abrir un nuevo runtime. Puedes elegir una extensión instalada o ingresar un dominio de sitio web para instalar una nueva.
*   **Menú Desplegable (centro)**: Muestra el runtime actualmente activo. Tócalo para ver una lista de todos tus runtimes abiertos y cambiar entre ellos. También puedes deslizar hacia la izquierda o derecha en el menú desplegable para cambiar rápidamente.
*   **`X` (Cerrar)**: Esto cierra el runtime actual.
*   **`☆` (Agregar Marcador)**: Toca esto para guardar la vista actual en tus marcadores.
*   **`🔖` (Marcadores)**: Esto te lleva a tu lista de marcadores guardados.
*   **`⚙️` (Configuración)**: Esto abre la pantalla de configuración, donde puedes personalizar Synura.

Si la pantalla es demasiado estrecha, estas opciones se colapsarán en un menú de tres puntos a la derecha.

### Marcadores
La pantalla de marcadores muestra todas tus vistas guardadas.

*   **Instantánea de Vista**: Al tocar un marcador se abre una **instantánea en caché** de la página tal como estaba cuando la guardaste. Esto es genial para consultar información rápidamente sin necesitar una conexión a internet.
*   **Restaurar Vista**: Para interactuar con la página de nuevo (por ejemplo, hacer clic en enlaces, actualizar datos), busca el **ícono de restaurar**. Al tocar esto, se reconectará a la extensión y traerá la vista de vuelta a la vida en un nuevo runtime.

## Configuración (`⚙️`)

La pantalla de configuración te permite ajustar casi todos los aspectos de tu experiencia en Synura.

### Extensiones
*   **Instalar Nuevas Extensiones**: Toca el botón **`+`** en la barra de aplicación e ingresa el dominio del sitio web (por ejemplo, `https://example.com`). Si el sitio soporta Synura, la extensión será descubierta e instalada automáticamente.
*   **Administrar Extensiones**: Toca **Administrar** para ver una lista de tus extensiones instaladas, donde puedes actualizarlas o eliminarlas.

### Apariencia
*   **Ajustar Densidad de Contenido**: Usa el control deslizante para hacer que el contenido parezca más espaciado o más compacto. Verás una vista previa en vivo de cómo afecta a las listas y tarjetas.
*   **Tema de Color**: Personaliza el aspecto de la aplicación eligiendo entre esquemas de color **Claro**, **Oscuro** y **Monokai**.
*   **Peso de Fuente**: Ajusta el grosor del texto a tu preferencia (por ejemplo, ligero, regular, negrita).
*   **Idioma**: Establece el idioma de la aplicación. Puedes elegir un idioma específico o hacer que siga el predeterminado de tu sistema.

### Comportamiento
*   **Tiempo de Espera de Red**: Establece cuánto tiempo debe esperar la aplicación una respuesta de una solicitud de red, de 1 a 60 segundos.
*   **Configuración de Proxy**: Configura un servidor proxy para solicitudes de red.
*   **Configuración de Caché**: Administra la caché de la aplicación, incluyendo borrar datos en caché para liberar espacio.
*   **Animación GIF**: Controla cómo se reproducen los GIF animados: **Desactivado** (imagen estática), **Una vez** (reproducir una vez) o **Bucle** (reproducir continuamente).

### Video y Audio
*   **Autoreproducción de Video**: Un interruptor para controlar si los videos comienzan a reproducirse automáticamente cuando aparecen en pantalla.
*   **Reproducción de Fondo de Video**: Habilita esto para seguir escuchando el audio de un video incluso después de navegar a otro lugar o cambiar a otra aplicación.
*   **Mezclar con Otros**: Permite que el audio de Synura se reproduzca al mismo tiempo que el audio de otras aplicaciones.
*   **Horas de DVR de Reproducción en Vivo**: Para transmisiones en vivo, elige cuántas horas de la transmisión mantener disponibles para buscar hacia atrás (de 0 a 6 horas).

### Privacidad y Seguridad
*   **Administrar Configuración**: Configura varias opciones de privacidad y seguridad para controlar qué datos se almacenan y comparten.

### Acerca de
*   **Licencias de Código Abierto**: Ve las licencias del software de código abierto que ayuda a impulsar a Synura.

---
*Este documento es para usuarios finales. Para documentación de desarrolladores, por favor consulta [Comenzando](getting_started.md), la [Referencia de API](api_reference.md), y [Ejemplos](examples.md).*