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
    'header.switchLanguage': 'Switch language',
    'hero.role': 'Software Engineer & Full Stack Developer',
    'hero.portfolio': '© {year} PORTFOLIO',
    'hero.downloadCv': 'Download CV',
    'hero.githubProfile': 'GitHub Profile',
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
    'intro.feat2.desc': 'Native PHP 8 expert. Development of custom plugins and extensions from scratch. High-performance web apps optimized for speed and technical SEO.',
    'intro.feat3.title': 'DATABASE ARCHITECTURE',
    'intro.feat3.desc': 'Expert MySQL/MariaDB administration. Designing complex relational models, optimizing queries, and managing large-scale data persistence.',
    'intro.feat4.title': 'CUSTOM WORDPRESS',
    'intro.feat4.desc': 'Themes from scratch using _s (Underscores), Customizer API, and ACF. Pixel-perfect implementation from Figma without visual builders.',
    'stack.title': 'TECH STACK',
    'exp.title': 'EXPERIENCE & EDUCATION',
    'exp.job1.title': 'Freelance Full Stack Developer & DAW Student',
    'exp.job1.company': 'Self-Employed / Vocational Training',
    'exp.job1.date': '2023 - Present',
    'exp.job1.desc': 'Currently pursuing a Higher Degree in Web Application Development (DAW) while working as a freelance developer. Building custom web apps, robust backends in PHP/Java, and custom WordPress themes.',
    'exp.job2.title': 'Level 3 Professional Certificate',
    'exp.job2.company': 'Web Application Development',
    'exp.job2.date': 'Completed',
    'exp.job2.desc': 'Official certification in frontend and backend development, database management, and web application deployment.',
    'exp.edu1.title': 'Software Engineering Student',
    'exp.edu1.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu1.date': '1 Year Program',
    'exp.edu1.desc': 'Peer-to-peer methodology with no teachers. Focused on C programming, algorithms, memory management, and system architecture fundamentals.',
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
    'header.switchLanguage': 'Cambiar idioma',
    'hero.role': 'Software Engineer & Full Stack Developer',
    'hero.portfolio': '© {year} PORTAFOLIO',
    'hero.downloadCv': 'Descargar CV',
    'hero.githubProfile': 'Perfil de GitHub',
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
    'intro.feat2.desc': 'Experto en PHP 8 nativo. Desarrollo de plugins y extensiones desde cero. Aplicaciones web de alto rendimiento optimizadas para velocidad y SEO técnico.',
    'intro.feat3.title': 'ARQUITECTURA DE DATOS',
    'intro.feat3.desc': 'Administración experta de MySQL/MariaDB. Diseño de modelos relacionales complejos, optimización de consultas y gestión de persistencia a gran escala.',
    'intro.feat4.title': 'WORDPRESS A MEDIDA',
    'intro.feat4.desc': 'Temas desde cero usando _s (Underscores), Customizer API y ACF. Implementación pixel-perfect desde Figma sin constructores visuales.',
    'stack.title': 'STACK TECNOLÓGICO',
    'exp.title': 'EXPERIENCIA Y EDUCACIÓN',
    'exp.job1.title': 'Desarrollador Full Stack Freelance y Estudiante DAW',
    'exp.job1.company': 'Autónomo / Formación Profesional',
    'exp.job1.date': '2023 - Presente',
    'exp.job1.desc': 'Actualmente cursando el Grado Superior en Desarrollo de Aplicaciones Web (DAW) compaginado con proyectos freelance. Desarrollo de aplicaciones a medida, backends en PHP/Java y temas WordPress desde cero.',
    'exp.job2.title': 'Certificado de Profesionalidad (Nivel 3)',
    'exp.job2.company': 'Desarrollo de Aplicaciones con Tecnologías Web',
    'exp.job2.date': 'Completado',
    'exp.job2.desc': 'Formación oficial e intensiva en desarrollo frontend y backend, administración de bases de datos y despliegue de aplicaciones web.',
    'exp.edu1.title': 'Estudiante de Ingeniería de Software',
    'exp.edu1.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu1.date': '1 Año',
    'exp.edu1.desc': 'Metodología peer-to-peer sin profesores. Desarrollo de proyectos en C, algoritmos, gestión de memoria y fundamentos de arquitectura de sistemas.',
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
    'header.switchLanguage': 'Aldatu hizkuntza',
    'hero.role': 'Software Engineer & Full Stack Developer', // Mantenemos el rol técnico en inglés
    'hero.portfolio': '© {year} PORTFOLIOA',
    'hero.downloadCv': 'CV-a Deskargatu',
    'hero.githubProfile': 'GitHub Profila',
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
    'exp.job1.title': 'Full Stack Garatzaile Freelance eta DAW Ikaslea',
    'exp.job1.company': 'Autonomoa / Lanbide Heziketa',
    'exp.job1.date': '2023 - Gaur egun',
    'exp.job1.desc': 'Gaur egun Web Aplikazioen Garapeneko (DAW) Goi Mailako Heziketa Zikloa ikasten, freelance garatzaile lanekin batera. Neurrirako web aplikazioak, PHP/Java backend sendoak eta hutsetik sortutako WordPress gaiak garatzen.',
    'exp.job2.title': 'Profesionaltasun Ziurtagiria (3. Maila)',
    'exp.job2.company': 'Web Teknologiekin Aplikazioen Garapena',
    'exp.job2.date': 'Amaituta',
    'exp.job2.desc': 'Frontend eta backend garapenean, datu-baseen kudeaketan eta web aplikazioen inplementazioan heziketa ofizial eta intentsiboa.',
    'exp.edu1.title': 'Software Ingeniaritzako Ikaslea',
    'exp.edu1.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu1.date': 'Urte 1',
    'exp.edu1.desc': 'Irakaslerik gabeko peer-to-peer metodologia. C programazioan, algoritmoetan, memoria kudeaketan eta sistema arkitekturaren oinarrietan zentratuta.',
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
    document.documentElement.lang = language;
    
    // 3. Actualizar metadatos y SEO para los tres idiomas
    document.title = "Yeray Garrido | Software Engineer & Full Stack Developer";
    const metaDesc = document.querySelector('meta[name="description"]');
    
    if (language === 'en') {
      metaDesc?.setAttribute("content", "Software Engineer specializing in PHP, Java, and custom WordPress development.");
    } else if (language === 'eu') {
      metaDesc?.setAttribute("content", "Software Ingeniaria PHP, Java eta neurrirako WordPress garapenean espezializatua.");
    } else {
      metaDesc?.setAttribute("content", "Ingeniero de Software especializado en PHP, Java y desarrollo WordPress a medida.");
    }
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