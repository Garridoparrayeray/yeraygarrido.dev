import React, { createContext, useState, useContext, useEffect } from 'react';

// 3 IDIOMAS: english, castellano, euskara
type Language = 'en' | 'es' | 'eu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    'header.home': 'Back to home',
    'header.logoAlt': 'Yeray Garrido Logo - Back to top',
    'header.githubAria': "Go to Yeray's GitHub profile",
    'header.linkedinAria': "Go to Yeray's LinkedIn profile",
    'header.emailAria': 'Send an email to Yeray',
    'header.photographyAria': 'Go to the photography portfolio',
    'header.switchLanguage': 'Switch language',
    'hero.role': 'Software Engineer & Full Stack Developer',
    'hero.portfolio': '© {year} PORTFOLIO',
    'hero.downloadCv': 'Download CV',
    'hero.githubProfile': 'GitHub Profile',
    'hero.photographyProfile': 'Photography Profile',
    'intro.title1': 'SOFTWARE',
    'intro.title2': 'ENGINEERING',
    'intro.desc1': 'As a Full Stack Developer, I offer comprehensive software engineering services: custom web development, business digitalization, advanced database management, and process automation. I build scalable solutions tailored to your business.',
    'intro.subtitle1': 'CUSTOM',
    'intro.subtitle2': 'SOLUTIONS',
    'intro.desc2': 'From robust backends (Java, PHP) and complex SQL queries to pixel-perfect frontends using Figma. I specialize in building WordPress themes from scratch using _s (Underscores), ensuring high performance (WPO) and technical SEO without relying on visual builders.',
    'intro.expertise1': 'TECHNICAL',
    'intro.expertise2': 'EXPERTISE',
    'intro.feat1.title': 'JAVA BACKEND',
    'intro.feat1.desc': 'Advanced Java development (OOP, Swing, MVC). Experience with ObjectDB, complex file systems, and building standalone management software with robust database connectivity.',
    'intro.feat2.title': 'PHP PLUGINS & WEB',
    'intro.feat2.desc': 'Native PHP 8 with advanced knowledge. Development of custom plugins and extensions from scratch. High-performance web apps optimized for speed and technical SEO.',
    'intro.feat3.title': 'DATABASE ARCHITECTURE',
    'intro.feat3.desc': 'Advanced knowledge MySQL/MariaDB administration. Designing complex relational models, optimizing queries, and managing large-scale data persistence.',
    'intro.feat4.title': 'CUSTOM WORDPRESS',
    'intro.feat4.desc': 'Themes from scratch using _s (Underscores), Customizer API, and ACF. Pixel-perfect implementation from Figma without visual builders.',
    'stack.title': 'TECH STACK',
    'exp.title': 'EXPERIENCE & EDUCATION',
    'exp.job3.title': 'Software Engineer',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': '2025 - Present',
    'exp.job3.desc': 'Software Engineer working primarily in PHP, building custom enterprise software solutions end-to-end. Developed modules for a proprietary ERP (Horión Enterprise) with a multi-tenant PHP architecture and custom routing patterns, including a full email outbox module (sent-email history, attachment download from database, resend with new file uploads) and binary output buffering — plus legacy frontend support in vanilla JS/MooTools.',
    'exp.job1.title': 'Freelance Full Stack Developer',
    'exp.job1.company': 'Self-Employed',
    'exp.job1.date': 'Jan 2025 - Jun 2026',
    'exp.job1.desc': 'Custom web architecture and Full Stack solutions prioritizing extreme performance (WPO), scalability, and UX. Built Zalbi Aisia (custom WordPress CMS with CPTs, taxonomic filtering, CI/CD) and yeraygarrido.dev (React 19 SPA, 100/100 Lighthouse, GSAP, GDPR cookie system).',
    'exp.job2.title': 'Web Administrator & Plugin Developer',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': 'Apr 2025 - Jun 2025',
    'exp.job2.desc': 'Developed two Contact Form 7 extensions from scratch: a CSV Exporter and a DB Persistence system with MySQL storage and admin viewer. Server migration, automated backups, security auditing, and Figma prototyping.',
    'exp.job4.title': 'Web Developer',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': 'Mar 2022 - Apr 2022',
    'exp.job4.desc': 'Maintenance and update of the organization website, ensuring correct content display and structure.',
    'exp.edu1.title': 'DAW — Higher Degree in Web Application Development',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Present',
    'exp.edu1.desc': 'Higher Technician Degree in Web Application Development, Dual Vocational Training track.',
    'exp.edu2.title': 'Software Engineering Student',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Peer-to-peer methodology with no teachers. Focused on C programming, algorithms, memory management, and system architecture fundamentals.',
    'exp.edu3.title': 'Level 3 Professional Certificate',
    'exp.edu3.company': 'Web Application Development — Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Official certification in frontend and backend development, database management, and web application deployment. Score: 9/10.',
    'stats.repos': 'Public Repositories',
    'stats.commits': 'Total Commits (Est.)',
    'stats.followers': 'GitHub Followers',
    'api.title': 'Public API',
    'api.desc': 'Are you a developer or technical recruiter? You don\'t need to download a PDF. Consume my CV directly from your terminal using my public endpoint. It returns a beautifully formatted XML version.',
    'projects.title': 'Selected Works',
    'projects.viewAll': 'View All Works',
    'projects.close': 'Close',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'Native CMS, PHP Backend, I18n',
    'projects.p1.desc': 'Development of an intuitive management system using Custom Post Types. Implementation of taxonomic filtering logic and global configuration via WordPress Customizer API.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Plugin Dev',
    'projects.p2.desc': 'Programmed two extensions for Contact Form 7 from scratch: a CSV Exporter and a DB Persistence system with MySQL storage and admin viewer.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Development of a custom template and metadata optimization for SEO. Implementation of a digital catalog tracking system.',
    'contact.title1': "LET'S",
    'contact.title2': 'CONNECT',
    'contact.email': 'Send Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub Activity',
    'contact.footer.madeWith': 'Made with ❤️ by',
    'contact.footer.copyright': '© {year} All rights reserved.',
    'github.loading': 'Loading repositories...',
    'github.error': 'Failed to load repositories.',
    'github.stars': 'Stars',
    'github.forks': 'Forks',
    'github.viewRepo': 'View Repository',
    'github.allWorks': 'All Works (GitHub)',
    'github.noDesc': 'No description provided.',
  },
  es: {
    'header.home': 'Volver al inicio',
    'header.logoAlt': 'Logotipo de Yeray Garrido - Volver al inicio',
    'header.githubAria': 'Ir al perfil de GitHub de Yeray',
    'header.linkedinAria': 'Ir al perfil de LinkedIn de Yeray',
    'header.emailAria': 'Enviar un correo electrónico a Yeray',
    'header.photographyAria': 'Ir al portfolio de fotografía',
    'header.switchLanguage': 'Cambiar idioma',
    'hero.role': 'Software Engineer & Full Stack Developer',
    'hero.portfolio': '© {year} PORTAFOLIO',
    'hero.downloadCv': 'Descargar CV',
    'hero.githubProfile': 'Perfil de GitHub',
    'hero.photographyProfile': 'Perfil fotográfico',
    'intro.title1': 'INGENIERÍA',
    'intro.title2': 'DE SOFTWARE',
    'intro.desc1': 'Como Desarrollador Full Stack, ofrezco servicios integrales de ingeniería de software: desarrollo web a medida, digitalización de empresas, manejo avanzado de bases de datos y automatización de procesos. Construyo soluciones escalables adaptadas a tu negocio.',
    'intro.subtitle1': 'SOLUCIONES',
    'intro.subtitle2': 'A MEDIDA',
    'intro.desc2': 'Desde backends robustos (Java, PHP) y consultas SQL complejas hasta frontends pixel-perfect usando Figma. Me especializo en la creación de temas de WordPress desde cero usando _s (Underscores), garantizando alto rendimiento (WPO) y SEO técnico sin depender de constructores visuales.',
    'intro.expertise1': 'EXPERIENCIA',
    'intro.expertise2': 'TÉCNICA',
    'intro.feat1.title': 'BACKEND JAVA',
    'intro.feat1.desc': 'Desarrollo avanzado en Java (POO, Swing, MVC). Experiencia con ObjectDB, sistemas de archivos complejos y creación de software de gestión con conectividad robusta a bases de datos.',
    'intro.feat2.title': 'PLUGINS PHP & WEB',
    'intro.feat2.desc': 'Conocimiento avanzado en PHP 8 nativo. Desarrollo de plugins y extensiones desde cero. Aplicaciones web de alto rendimiento optimizadas para velocidad y SEO técnico.',
    'intro.feat3.title': 'ARQUITECTURA DE DATOS',
    'intro.feat3.desc': 'Administración con conocimiento avanzado de MySQL/MariaDB. Diseño de modelos relacionales complejos, optimización de consultas y gestión de persistencia a gran escala.',
    'intro.feat4.title': 'WORDPRESS A MEDIDA',
    'intro.feat4.desc': 'Temas desde cero usando _s (Underscores), Customizer API y ACF. Implementación pixel-perfect desde Figma sin constructores visuales.',
    'stack.title': 'STACK TECNOLÓGICO',
    'exp.title': 'EXPERIENCIA Y EDUCACIÓN',
    'exp.job3.title': 'Ingeniero de Software',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': '2025 - Presente',
    'exp.job3.desc': 'Ingeniero de software centrado en PHP, desarrollando soluciones informáticas personalizadas de principio a fin. Desarrollo de módulos para un ERP empresarial propietario (Horión Enterprise) con arquitectura PHP multi-tenant y patrón de routing propio, incluyendo un módulo completo de buzón de salida (historial de correos enviados, descarga de adjuntos desde base de datos, reenvío con nuevos ficheros) y gestión de output buffering binario — además de mantenimiento de frontend heredado en JS vanilla con MooTools.',
    'exp.job1.title': 'Desarrollador Full Stack Freelance',
    'exp.job1.company': 'Autónomo',
    'exp.job1.date': 'Ene 2025 - Jun 2026',
    'exp.job1.desc': 'Arquitectura web a medida y soluciones Full Stack priorizando rendimiento extremo (WPO), escalabilidad y UX. Zalbi Aisia (CMS WordPress con CPTs, filtrado taxonómico, CI/CD) y yeraygarrido.dev (SPA React 19, 100/100 Lighthouse, GSAP, sistema de cookies RGPD).',
    'exp.job2.title': 'Administrador Web y Desarrollador de Plugins',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': 'Abr 2025 - Jun 2025',
    'exp.job2.desc': 'Desarrollo de dos extensiones para Contact Form 7 desde cero: un Exportador CSV y un sistema de Persistencia en BD con almacenamiento MySQL y visor de administración. Migración de servidor, copias de seguridad automatizadas, auditoría de seguridad y prototipado en Figma.',
    'exp.job4.title': 'Programador Web',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': 'Mar 2022 - Abr 2022',
    'exp.job4.desc': 'Mantenimiento y actualización de la web de la organización, asegurando la correcta visualización del contenido y la estructura.',
    'exp.edu1.title': 'DAW — Grado Superior en Desarrollo de Aplicaciones Web',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Presente',
    'exp.edu1.desc': 'Técnico Superior en Desarrollo de Aplicaciones Web, modalidad Formación Profesional Dual.',
    'exp.edu2.title': 'Estudiante de Ingeniería de Software',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Metodología peer-to-peer sin profesores. Desarrollo de proyectos en C, algoritmos, gestión de memoria y fundamentos de arquitectura de sistemas.',
    'exp.edu3.title': 'Certificado de Profesionalidad (Nivel 3)',
    'exp.edu3.company': 'Desarrollo de Aplicaciones Web — Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Formación oficial en desarrollo frontend y backend, administración de bases de datos y despliegue de aplicaciones web. Nota: 9/10.',
    'stats.repos': 'Repositorios Públicos',
    'stats.commits': 'Commits Totales (Est.)',
    'stats.followers': 'Seguidores GitHub',
    'api.title': 'API Pública',
    'api.desc': '¿Eres desarrollador o reclutador técnico? No necesitas descargar un PDF. Consume mi CV directamente desde tu terminal usando mi endpoint público. Devuelve una versión en XML perfectamente estructurada.',
    'projects.title': 'Trabajos Destacados',
    'projects.viewAll': 'Ver Todos',
    'projects.close': 'Cerrar',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'CMS Nativo, Backend PHP, I18n',
    'projects.p1.desc': 'Desarrollo de un sistema de gestión intuitivo usando Custom Post Types. Implementación de lógica de filtrado taxonómico y configuración global vía WordPress Customizer API.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Des. Plugins',
    'projects.p2.desc': 'Programación de dos extensiones para Contact Form 7 desde cero: un Exportador CSV y un sistema de Persistencia en BD con almacenamiento MySQL y visor de administración.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Desarrollo de una plantilla a medida y optimización de metadatos para SEO. Implementación de un sistema de seguimiento de catálogo digital.',
    'contact.title1': "VAMOS A",
    'contact.title2': 'CONECTAR',
    'contact.email': 'Enviar Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'Actividad en GitHub',
    'contact.footer.madeWith': 'Página hecha con ❤️ por',
    'contact.footer.copyright': '© {year} Todos los derechos reservados.',
    'github.loading': 'Cargando repositorios...',
    'github.error': 'Error al cargar repositorios.',
    'github.stars': 'Estrellas',
    'github.forks': 'Forks',
    'github.viewRepo': 'Ver Repositorio',
    'github.allWorks': 'Todos los Trabajos (GitHub)',
    'github.noDesc': 'Sin descripción.',
  },
  // 2. Bloque de traducciones en Euskera
  eu: {
    'header.home': 'Hasierara itzuli',
    'header.logoAlt': 'Yeray Garridoren logotipoa - Itzuli hasierara',
    'header.githubAria': 'Joan Yerayren GitHub profilera',
    'header.linkedinAria': 'Joan Yerayren LinkedIn profilera',
    'header.emailAria': 'Bidali mezu elektroniko bat Yeray-ri',
    'header.photographyAria': 'Joan argazkilaritza portfoliora',
    'header.switchLanguage': 'Aldatu hizkuntza',
    'hero.role': 'Software Engineer & Full Stack Developer', // Mantenemos el rol técnico en inglés
    'hero.portfolio': '© {year} PORTFOLIOA',
    'hero.downloadCv': 'CV-a Deskargatu',
    'hero.githubProfile': 'GitHub Profila',
    'hero.photographyProfile': 'Argazkilaritza profila',
    'intro.title1': 'SOFTWARE',
    'intro.title2': 'INGENIARITZA',
    'intro.desc1': 'Full Stack Garatzaile gisa, software ingeniaritza zerbitzu integralak eskaintzen ditut: neurrirako web garapena, enpresen digitalizazioa, datu-baseen kudeaketa aurreratua eta prozesuen automatizazioa. Zure negozioari egokitutako irtenbide eskalagarriak eraikitzen ditut.',
    'intro.subtitle1': 'NEURRIRAKO',
    'intro.subtitle2': 'IRTENBIDEAK',
    'intro.desc2': 'Backend sendoetatik (Java, PHP) eta SQL kontsulta konplexuetatik hasita, Figma erabiliz pixel-perfect diren frontendetaraino. WordPress gaiak hutsetik eraikitzen espezializatuta nago _s (Underscores) erabiliz, errendimendu altua (WPO) eta SEO teknikoa bermatuz eraikitzaile bisualen menpe egon gabe.',
    'intro.expertise1': 'ESPERIENTZIA',
    'intro.expertise2': 'TEKNIKOA',
    'intro.feat1.title': 'JAVA BACKEND',
    'intro.feat1.desc': 'Java garapen aurreratua (POO, Swing, MVC). Esperientzia ObjectDB-rekin, fitxategi-sistema konplexuekin eta datu-base konexio sendoa duten kudeaketa-software autonomoak sortzen.',
    'intro.feat2.title': 'PHP PLUGINAK ETA WEBA',
    'intro.feat2.desc': 'PHP 8 natiboan aditua. Plugin eta hedapenen garapena hutsetik. Abiadurarako eta SEO teknikorako optimizatutako errendimendu handiko web aplikazioak.',
    'intro.feat3.title': 'DATU ARKITEKTURA',
    'intro.feat3.desc': 'MySQL/MariaDB administrazioan aditua. Eredu erlazional konplexuen diseinua, kontsulten optimizazioa eta eskala handiko datuen iraunkortasunaren kudeaketa.',
    'intro.feat4.title': 'NEURRIRAKO WORDPRESS',
    'intro.feat4.desc': 'Gaiak hutsetik _s (Underscores), Customizer API eta ACF erabiliz. Eraikitzaile bisualik gabe Figmatik egindako ezarpen pixel-perfect.',
    'stack.title': 'TEKNOLOGIAK',
    'exp.title': 'ESPERIENTZIA ETA HEZKUNTZA',
    'exp.job3.title': 'Software Ingeniaria',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': '2025 - Gaur egun',
    'exp.job3.desc': 'Software ingeniaria, batez ere PHP-rekin lan eginez, enpresa-konponbide informatiko pertsonalizatuak hasieratik amaierara garatuz. Enpresa ERP propietario baterako (Horión Enterprise) moduluak garatuta, PHP multi-tenant arkitektura eta routing eredu propioarekin, irteera postontzi modulu osoa barne (bidalitako mezuen historia, eranskinak datu-basetik deskargatuz, fitxategi berriekin birbidaliz) eta output buffering bitar kudeaketa — gainera, JS vanilla eta MooTools bidezko aurreko frontend lana.',
    'exp.job1.title': 'Full Stack Garatzaile Freelance',
    'exp.job1.company': 'Autonomoa',
    'exp.job1.date': '2025eko urt. - 2026ko eka.',
    'exp.job1.desc': 'Neurrirako web arkitektura eta Full Stack irtenbideak, errendimendu extremoa (WPO), eskalagarritasuna eta UX lehenetsi. Zalbi Aisia (WordPress CMS CPTekin, iragazte taxonomikoa, CI/CD) eta yeraygarrido.dev (React 19 SPA, 100/100 Lighthouse, GSAP, DBEO cookie sistema).',
    'exp.job2.title': 'Web Administratzaile eta Plugin Garatzaile',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': '2025eko api. - 2025eko eka.',
    'exp.job2.desc': 'Contact Form 7-rako bi hedapen hutsetik programatu: CSV Esportatzaile bat eta MySQL biltegiratze eta admin bisorea duen DB Iraunkortasun sistema bat. Zerbitzari migrazioa, segurtasun kopiak, segurtasun ikuskaritza eta Figman prototipoak.',
    'exp.job4.title': 'Web Programatzaile',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': '2022ko mar. - 2022ko api.',
    'exp.job4.desc': 'Erakundearen webaren mantentze-lanak eta eguneratzea, edukiaren bistaratze egokia eta egitura bermatuz.',
    'exp.edu1.title': 'DAW — Web Aplikazioen Garapeneko Goi Mailako Zikloa',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Gaur egun',
    'exp.edu1.desc': 'Web Aplikazioen Garapeneko Goi Mailako Teknikaria, Lanbide Heziketako Dual modalitatean.',
    'exp.edu2.title': 'Software Ingeniaritzako Ikaslea',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Irakaslerik gabeko peer-to-peer metodologia. C programazioan, algoritmoetan, memoria kudeaketan eta sistema arkitekturaren oinarrietan zentratuta.',
    'exp.edu3.title': 'Profesionaltasun Ziurtagiria (3. Maila)',
    'exp.edu3.company': 'Web Aplikazioen Garapena — Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Frontend eta backend garapenean, datu-baseen kudeaketan eta web aplikazioen inplementazioan heziketa ofiziala. Nota: 9/10.',
    'stats.repos': 'Biltegi Publikoak',
    'stats.commits': 'Guztira Commits (Est.)',
    'stats.followers': 'GitHub Jarraitzaileak',
    'api.title': 'API Publikoa',
    'api.desc': 'Garatzailea edo errekrutatzaile teknikoa zara? Ez duzu PDFrik deskargatu behar. Nire CV-a zuzenean terminaletik kontsumitu dezakezu nire endpoint publikoa erabiliz. Egitura ezin hobeko XML bertsio bat itzultzen du.',
    'projects.title': 'Lan Nabarmenak',
    'projects.viewAll': 'Guztiak Ikusi',
    'projects.close': 'Itxi',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'CMS Natiboa, PHP Backend, I18n',
    'projects.p1.desc': 'Kudeaketa sistema intuitibo baten garapena Custom Post Types (CPTs) erabiliz. Iragazte taxonomikoaren logika eta konfigurazio globala WordPress Customizer API bidez inplementatuta.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Plugin Garapena',
    'projects.p2.desc': 'Contact Form 7-rako bi hedapen programatu dira hutsetik: CSV Esportatzaile bat eta Datu Basean Iraunkortasun sistema bat MySQL biltegiratzearekin eta administrazio bisorearekin.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Enpresako txantiloi pertsonalizatu baten garapena eta SEOrako metadatuen optimizazioa. Katalogo digitalaren jarraipen sistema baten inplementazioa.',
    'contact.title1': 'KONEKTATU',
    'contact.title2': 'DEZAGUN',
    'contact.email': 'Mezua Bidali',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'Jarduera GitHub-en',
    'contact.footer.madeWith': 'Maitasunez egina ❤️ -',
    'contact.footer.copyright': '© {year} Eskubide guztiak erreserbatuta.',
    'github.loading': 'Biltegiak kargatzen...',
    'github.error': 'Errorea biltegiak kargatzean.',
    'github.stars': 'Izarrak',
    'github.forks': 'Forks',
    'github.viewRepo': 'Biltegia Ikusi',
    'github.allWorks': 'Lan Guztiak (GitHub)',
    'github.noDesc': 'Deskribapenik gabe.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Actualiza el atributo lang del HTML — importante para lectores de pantalla y Google
    document.documentElement.lang = language;

    // Textos SEO por idioma
    const seoData = {
      es: {
        title: 'Yeray Garrido | Ingeniero de Software & Desarrollador Full Stack',
        description: 'Ingeniero de Software especializado en PHP, Java y desarrollo WordPress a medida. Creación de sistemas backend, plugins personalizados y aplicaciones web de alto rendimiento.',
      },
      en: {
        title: 'Yeray Garrido | Software Engineer & Full Stack Developer',
        description: 'Software Engineer specializing in PHP, Java, and custom WordPress development. Building robust backends, custom plugins, and high-performance web applications.',
      },
      eu: {
        title: 'Yeray Garrido | Software Ingeniaria & Full Stack Garatzailea',
        description: 'PHP, Java eta neurrirako WordPress garapenean espezializatutako Software Ingeniaria. Backend sendoak, plugin pertsonalizatuak eta errendimendu altuko web aplikazioak.',
      },
    };

    const { title, description } = seoData[language];

    // <title>
    document.title = title;

    // Función auxiliar para actualizar meta tags
    const setMeta = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute('content', content);
    };

    // Meta estándar
    setMeta('meta[name="title"]', title);
    setMeta('meta[name="description"]', description);

    // Open Graph
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', language === 'es' ? 'es_ES' : language === 'en' ? 'en_US' : 'eu_EU');

    // Twitter Card
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = translations[language][key as keyof typeof translations['en']] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, String(params[k]));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
