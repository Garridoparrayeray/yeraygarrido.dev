# yeraygarrido.dev - Portafolio personal 

Portafolio personal y arquitectura frontend. Construido con React, Tailwind CSS y animaciones GSAP. Esto no es una plantilla. Es una aplicación de página única (SPA) personalizada diseñada para mostrar las mejores prácticas de ingeniería frontend, SEO técnico y WPO (optimización del rendimiento web). 
## Pila de tecnología 
- **Núcleo:** React 19 + Vite (no se requieren marcos de interfaz de usuario pesados como Next.js para esta fase). 
- **Estilo:** Tailwind CSS v4 para un diseño que prioriza la utilidad, brutalista y responsivo.
- **Animaciones:** GSAP (GreenSock) para animaciones de cronología de rendimiento.. 
ç- **I18n:** Implementación personalizada de React Context para un cambio fluido de inglés/español/euskera sin parámetros de URL (euskera aún en proceso). 
- **Datos y API:** Punto final público estático disponible en `/api/cv.xml` para consumo directo del terminal (`curl https://yeraygarrido.com/api/cv.xml`). 
## Estructura del proyecto 
├── /public # Activos estáticos, mapa del sitio, robots.txt y la API XML pública 
├── /src 
│ ├── /componentes # Componentes modulares, aislados de interfaz de usuario y animación 
│ ├── /context # Gestión del estado global (Idioma/I18n) 
│ ├── App.tsx # Diseño principal 
│ └── main.tsx # Punto de entrada de la aplicación 
# Clonar el repositorio clon de git 
[https://github.com/Garridoparrayeray/yeraygarrido.com.git](https://github.com/Garridoparrayeray/yeraygarrido.com.git)
# Navegar al directorio cd yeraygarrido.com
# Instalar dependencias (se requiere Node.js 18+) instalación de npm 
# Inicie el servidor de desarrollo Vite 
Licencia y derechos de autor El código base está licenciado bajo la Licencia MIT. Sin embargo, el contenido de este repositorio (textos, imágenes, logotipos y datos de mi CV personal) son Copyright © 2026 Yeray Garrido. Eres libre de utilizar la arquitectura subyacente de React/Vite/GSAP para tus propios proyectos, pero debes cambiar el estilo, los colores, la tipografía y los datos personales para reflejar tu propia marca.