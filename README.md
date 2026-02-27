<div align="center">
  <h1>yeraygarrido.dev</h1>
  <p>Software Engineer Portfolio & Frontend Architecture</p>

  [🇬🇧 English](#-english) | [🇪🇸 Español](#-español)
</div>

---

# 🇬🇧 English

## Overview

Personal portfolio and custom frontend architecture. Built with React, Tailwind CSS, and GSAP animations. **This is not a template.** It is a custom-built Single Page Application (SPA) designed to showcase frontend engineering best practices, technical SEO, and WPO (Web Performance Optimization).

## Performance (Core Web Vitals)

Optimized to achieve maximum scores in Lighthouse for both mobile and desktop, prioritizing a zero-blocking critical rendering path.

<img width="100%" alt="PageSpeed Performance Mobile" src="https://github.com/user-attachments/assets/574a51c5-d84a-4a8b-a1b5-d7bc3fccdb18" />

<img width="100%" alt="PageSpeed Performance Desktop" src="https://github.com/user-attachments/assets/0e241635-f1dd-4018-a3ae-336d77f4afad" />

## Tech Stack

- **Core:** React 19 + Vite (No heavy frameworks like Next.js required for this phase to maximize speed).
- **Styling:** Tailwind CSS v4 for a utility-first, brutalist, and fully responsive design.
- **Animations:** GSAP (GreenSock) & ScrollTrigger for high-performance timeline and scroll animations without layout thrashing.
- **I18n:** Custom React Context implementation for seamless English/Spanish/Basque switching without URL parameters or reloads.
- **Data & API:** Public static XML endpoint available for direct terminal consumption:
  ```bash
  curl https://yeraygarrido.dev/api/cv.xml
  ```

## Roadmap / Upcoming Features

- [ ] Complete the "Projects" section architecture and populate it with case studies.
- [ ] Implement a dynamic project flow and filtering system.

## Project Structure

```plaintext
├── /public       # Static assets, sitemap, robots.txt, and public XML API
├── /src
│   ├── /components  # Modular, isolated UI and animation components
│   ├── /context     # Global state management (Language/I18n)
│   ├── App.tsx      # Main application layout and lazy-loading boundaries
│   └── main.tsx     # App entry point
```

## Local Development

> Requires Node.js 18+

```bash
# Clone the repository
git clone https://github.com/Garridoparrayeray/yeraygarrido.com.git

# Navigate to the directory
cd yeraygarrido.com

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## License & Copyright

The underlying codebase and architecture are licensed under the **MIT License**.

However, the content of this repository (texts, images, logos, and personal CV data) is **Copyright © 2026 Yeray Garrido**. You are free to use the React/Vite/GSAP architecture for your own projects, but you must change the styling, colors, typography, and personal data to reflect your own brand.

---

# 🇪🇸 Español

## Descripción

Portafolio personal y arquitectura frontend. Construido con React, Tailwind CSS y animaciones GSAP. **Esto no es una plantilla.** Es una aplicación de página única (SPA) desarrollada a medida y diseñada para mostrar las mejores prácticas de ingeniería frontend, SEO técnico y WPO (Optimización del Rendimiento Web).

## Rendimiento de la página (WPO)

Arquitectura optimizada al extremo para lograr puntuaciones perfectas en Lighthouse (Móvil y Escritorio), priorizando la eliminación del bloqueo de renderizado y la carga diferida.

<img width="100%" alt="Rendimiento PageSpeed Móvil" src="https://github.com/user-attachments/assets/574a51c5-d84a-4a8b-a1b5-d7bc3fccdb18" />

<img width="100%" alt="Rendimiento PageSpeed Escritorio" src="https://github.com/user-attachments/assets/0e241635-f1dd-4018-a3ae-336d77f4afad" />

## Stack Tecnológico

- **Núcleo:** React 19 + Vite (sin necesidad de frameworks pesados como Next.js para esta fase).
- **Estilos:** Tailwind CSS v4 para un diseño de estética brutalista, responsivo y utility-first.
- **Animaciones:** GSAP (GreenSock) y ScrollTrigger para animaciones de alto rendimiento basadas en línea de tiempo evitando el layout thrashing.
- **I18n (Internacionalización):** Implementación personalizada con React Context para un cambio fluido entre Inglés/Español/Euskera sin parámetros en la URL.
- **Datos y API:** Endpoint estático público disponible en `/api/cv.xml` para consumo directo desde terminal:
  ```bash
  curl https://yeraygarrido.dev/api/cv.xml
  ```

## Próximas implementaciones

- [ ] Desarrollo de la sección de "Proyectos" con casos de estudio detallados.
- [ ] Implementar un flujo correcto de navegación y filtrado de proyectos.

## Estructura del Proyecto

```plaintext
├── /public       # Activos estáticos, mapa del sitio, robots.txt y la API XML pública
├── /src
│   ├── /components  # Componentes modulares, aislados de interfaz de usuario y animación
│   ├── /context     # Gestión del estado global (Idioma/I18n)
│   ├── App.tsx      # Diseño principal y fronteras de carga diferida (Lazy Loading)
│   └── main.tsx     # Punto de entrada de la aplicación
```

## Instalación y Desarrollo

> Se requiere Node.js 18+

```bash
# Clonar el repositorio
git clone https://github.com/Garridoparrayeray/yeraygarrido.com.git

# Navegar al directorio
cd yeraygarrido.com

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo Vite
npm run dev
```

## Licencia y Derechos de Autor

El código base y la arquitectura están bajo la **Licencia MIT**.

Sin embargo, el contenido de este repositorio (textos, imágenes, logotipos y datos de mi CV personal) tienen **Copyright © 2026 Yeray Garrido**. Eres libre de utilizar la arquitectura subyacente de React/Vite/GSAP para tus propios proyectos, pero debes cambiar el estilo, los colores, la tipografía y los datos personales para reflejar tu propia marca.
