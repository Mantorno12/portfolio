# Portfolio · Matías Mingori

Sitio personal donde muestro mi trabajo: apps, tableros y automatizaciones.

**Sitio publicado:** https://matias-mingori.netlify.app

## Qué incluye

- **VetAr**, el proyecto destacado: una app de salud para mascotas con ficha, historial clínico, recordatorios y un asistente con IA que usa los datos de cada mascota. Se presenta con videos del recorrido y capturas reales.
- **Calcagno Seguros**, sitio web para un cliente real: un broker de seguros de Ramos Mejía. Se muestra con un recorrido en video en el celular, capturas de escritorio, las imágenes para WhatsApp y el kit interno (firmas de mail, mensajes listos y tarjetas para imprenta). En las capturas están ocultos los celulares y los apellidos del equipo, y el botón lleva al sitio publicado.
- **Demo de reservas para un gimnasio**: clases, confirmación de turnos y vista del staff.
- **Demo de turnos para un centro odontológico**: elección de especialidad y horario, confirmación, agenda y pacientes.
- Servicios, forma de trabajo y contacto.

Las dos demos funcionan en el navegador con datos de ejemplo.

## Tecnologías

HTML, CSS y JavaScript sin frameworks ni proceso de compilación. Las fuentes de las demos están alojadas en el propio sitio, las imágenes están en WebP y PNG, y los videos en MP4 y WebM con carga diferida.

## Estructura

```
.
├── index.html              Página principal
├── favicon.ico
├── assets/
│   ├── css/styles.css      Estilos del sitio
│   ├── js/main.js          Animaciones, videos y galería
│   ├── img/                Capturas de VetAr (WebP), de Nidalia y de Calcagno Seguros
│   └── video/              Videos de VetAr, Nidalia y Calcagno Seguros, con sus portadas
├── img/                    Capturas de las demos
├── demos/
│   ├── gimnasio/           Demo de reservas (con sus fuentes)
│   └── odontologia/        Demo de turnos (con sus fuentes)
└── netlify.toml            Configuración de publicación
```

## Verlo en local

No hace falta instalar nada. Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abrir http://localhost:8000 en el navegador.

## Publicación

El sitio está alojado en Netlify y se publica tal cual desde la raíz del repositorio (`publish = "."`, sin comando de compilación).

## Contacto

matias.mingori@hotmail.com

---

© Matías Mingori. Todos los derechos reservados.
