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
    'hero.role': 'Software Engineer & Digital Product Builder',
    'hero.portfolio': '© {year} PORTFOLIO',
    'hero.downloadCv': 'Download CV',
    'hero.githubProfile': 'GitHub Profile',
    'hero.photographyProfile': 'Photography Profile',
    'intro.title1': 'HOW I',
    'intro.title2': 'Build Software',
    'intro.desc1': 'I design and build web applications, digital tools, and my own everyday products. I combine solid engineering with clear, fast, and easy-to-use interfaces—so technology actually solves problems for both people and businesses.',
    'intro.subtitle1': 'FROM IDEA',
    'intro.subtitle2': 'TO PRODUCTION',
    'intro.desc2': 'Whether you need a fast business website, an internal management tool, or a full real-time application, I handle the entire process: planning, design, programming, databases, security, and launch—without unnecessary jargon or bloated templates.',
    'intro.expertise1': 'WHAT I DO',
    'intro.expertise2': '& HOW I WORK',
    'intro.feat1.title': 'Custom Webs & Apps',
    'intro.feat1.desc': 'Tailor-made websites and full applications built to fit how your project or business actually works, with clean code and fast loading on any device.',
    'intro.feat2.title': 'Reliable Systems & Data',
    'intro.feat2.desc': 'The behind-the-scenes engineering (PHP, Java, Python, SQL) that keeps platforms fast, secure, and dependable even when handling thousands of daily queries.',
    'intro.feat3.title': 'Automation & Applied AI',
    'intro.feat3.desc': 'Practical tools that save repetitive work, connect open data or company databases, and turn raw information into clear, useful answers.',
    'intro.feat4.title': 'Clear Design & Everyday UX',
    'intro.feat4.desc': 'Clean, accessible interfaces designed for real people on mobile and desktop—zero clutter, high readability, and strong search visibility (SEO & GEO).',
    'stack.title': 'TOOLS & TECHNOLOGIES',
    'exp.title': 'EXPERIENCE & EDUCATION',
    'exp.job3.title': 'Software Engineer',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': 'Jun 2026 - Present',
    'exp.job3.desc': 'Developing core modules end-to-end for Horión Enterprise, a multi-company management platform (ERP) built in PHP. Built the complete email outbox system (sent history, direct attachment downloads, and resending with new files) along with custom routing and maintenance of existing client interfaces.',
    'exp.job1.title': 'Freelance Full Stack Developer',
    'exp.job1.company': 'Independent Projects',
    'exp.job1.date': 'Jan 2025 - Jun 2026',
    'exp.job1.desc': 'Designed and shipped custom websites and digital products focused on speed, clarity, and reliability. Highlights include Zalbi Aisia (custom CMS and search filters), yeraygarrido.dev, and archive.yeraygarrido.dev.',
    'exp.job2.title': 'Web Administrator & Plugin Developer',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': 'Apr 2025 - Jun 2025',
    'exp.job2.desc': 'Created custom WordPress extensions in PHP to export client inquiries to CSV and store them securely in MySQL with a private management panel. Also handled server migrations, automated backups, security checks, and Figma prototypes.',
    'exp.job5.title': 'Java Developer (Freelance)',
    'exp.job5.company': 'Bermeo Town Hall (Ayuntamiento de Bermeo)',
    'exp.job5.date': 'May 2026 - Jun 2026',
    'exp.job5.desc': 'Delivered a complete Lost & Found platform in a 15-day sprint: a desktop application (Java Swing/JavaFX) for municipal staff and a public web portal for citizens to search and claim items, backed by automatic local and remote database backups so service never stops.',
    'exp.job4.title': 'Web Developer',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': 'Mar 2022 - Apr 2022',
    'exp.job4.desc': 'Maintained and updated the organization website, improving content clarity, structure, and accessibility.',
    'exp.edu1.title': 'Higher Degree in Web Application Development (DAW)',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Present',
    'exp.edu1.desc': 'Higher Technician Degree in Web Application Development (Dual Vocational Training combining classes with real industry engineering).',
    'exp.edu2.title': 'Software Engineering Track',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Intensive peer-to-peer programming campus with no teachers, centered on C, algorithms, memory management, and how operating systems work underneath.',
    'exp.edu3.title': 'Level 3 Professional Certificate in Web Development',
    'exp.edu3.company': 'Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Official certification covering frontend and backend development, databases, and deploying live web applications. Final grade: 9/10.',
    'stats.repos': 'Public Repositories',
    'stats.commits': 'Total Commits (Est.)',
    'stats.papers': 'Open Publications',
    'stats.followers': 'GitHub Followers',
    'api.title': 'Developer API',
    'api.desc': 'Built for developers, technical teams, and AI tools: you can read my structured resume directly from your terminal in XML, JSON, plain text, or llms.txt—no PDF required.',
    'research.lead': 'Alongside building apps, I publish open studies backed by real-world data so anyone can verify how the systems perform and reuse the code.',
    'projects.title': 'Selected Works',
    'projects.viewAll': 'View All Projects',
    'projects.close': 'Close',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'Native CMS, PHP Backend, I18n',
    'projects.p1.desc': 'Custom multilingual website and easy-to-manage content platform built for speed, search visibility, and instant filtering.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Plugin Dev',
    'projects.p2.desc': 'Custom PHP extensions built from scratch to export form entries to CSV and manage stored records directly from the admin panel.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Custom template redesign and SEO metadata optimization with a cleaner digital catalog.',
    'contact.title1': "LET'S",
    'contact.title2': 'CONNECT',
    'contact.subtitle': 'Have a project in mind, looking for a developer for your team, or simply want to ask something? Feel free to reach out.',
    'contact.email': 'Send Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub Activity',
    'contact.footer.madeWith': 'Crafted by',
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
    'hero.role': 'Ingeniero de Software & Creador de Productos Digitales',
    'hero.portfolio': '© {year} PORTAFOLIO',
    'hero.downloadCv': 'Descargar CV',
    'hero.githubProfile': 'Perfil de GitHub',
    'hero.photographyProfile': 'Perfil fotográfico',
    'intro.title1': 'CÓMO CREO',
    'intro.title2': 'Software útil',
    'intro.desc1': 'Diseño y desarrollo aplicaciones web, herramientas digitales y productos propios pensados para resolver problemas reales del día a día. Combino ingeniería sólida con interfaces claras, rápidas y fáciles de usar para personas y empresas.',
    'intro.subtitle1': 'DE LA IDEA',
    'intro.subtitle2': 'A PRODUCCIÓN',
    'intro.desc2': 'Tanto si necesitas una web rápida para tu negocio, una herramienta interna de gestión o una aplicación en tiempo real, me encargo del proceso completo: diseño, programación, bases de datos, seguridad y puesta en marcha, sin plantillas pesadas ni rodeos técnicos innecesarios.',
    'intro.expertise1': 'QUÉ HAGO',
    'intro.expertise2': 'Y CÓMO TRABAJO',
    'intro.feat1.title': 'Webs y apps a medida',
    'intro.feat1.desc': 'Desde páginas corporativas rápidas hasta aplicaciones completas adaptadas exactamente a cómo trabaja tu proyecto o empresa, pensadas para funcionar igual de bien en móvil y ordenador.',
    'intro.feat2.title': 'Sistemas fiables y datos',
    'intro.feat2.desc': 'La ingeniería que no se ve (PHP, Java, Python, SQL): arquitectura limpia, bases de datos bien diseñadas y seguridad para que todo responda rápido y sin caídas aunque crezcan los usuarios.',
    'intro.feat3.title': 'Automatización e IA aplicada',
    'intro.feat3.desc': 'Herramientas prácticas que ahorran horas de trabajo repetitivo, conectan datos abiertos o internos y transforman información compleja en respuestas claras al instante.',
    'intro.feat4.title': 'Diseño claro y experiencia real',
    'intro.feat4.desc': 'Interfaces limpias, accesibles y cómodas de leer para cualquier persona, acompañadas de optimización real de velocidad y visibilidad en buscadores e IA (SEO y GEO).',
    'stack.title': 'HERRAMIENTAS Y TECNOLOGÍAS',
    'exp.title': 'EXPERIENCIA Y FORMACIÓN',
    'exp.job3.title': 'Ingeniero de Software',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': 'Jun 2026 - Presente',
    'exp.job3.desc': 'Desarrollo de principio a fin de módulos clave para Horión Enterprise, un software de gestión empresarial (ERP) multiempresa en PHP. Creación del módulo completo de buzón de salida (historial de envíos, descarga directa de adjuntos y reenvío con nuevos archivos), enrutamiento propio y evolución de interfaces existentes.',
    'exp.job1.title': 'Desarrollador Full Stack Freelance',
    'exp.job1.company': 'Proyectos Independientes',
    'exp.job1.date': 'Ene 2025 - Jun 2026',
    'exp.job1.desc': 'Diseño y desarrollo de webs a medida y productos propios priorizando velocidad, claridad y facilidad de uso. Entre ellos Zalbi Aisia (gestor de contenidos a medida y filtros instantáneos), yeraygarrido.dev y archive.yeraygarrido.dev.',
    'exp.job2.title': 'Administrador Web y Desarrollador de Plugins',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': 'Abr 2025 - Jun 2025',
    'exp.job2.desc': 'Creación desde cero de dos extensiones en PHP para exportar formularios a CSV y guardar cada solicitud de forma segura en base de datos MySQL con panel de consulta. También migraciones de servidor, copias de seguridad automáticas, auditorías de seguridad y prototipos en Figma.',
    'exp.job5.title': 'Desarrollador Java (Freelance)',
    'exp.job5.company': 'Ayuntamiento de Bermeo',
    'exp.job5.date': 'May 2026 - Jun 2026',
    'exp.job5.desc': 'Sistema completo de gestión de objetos perdidos entregado en un sprint de 15 días: aplicación de escritorio en Java para el personal de atención al público y portal web para que cualquier vecino pueda buscar y reclamar objetos, con doble copia de seguridad para que el servicio nunca se detenga.',
    'exp.job4.title': 'Programador Web',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': 'Mar 2022 - Abr 2022',
    'exp.job4.desc': 'Mantenimiento y actualización de la web de la asociación, mejorando la claridad del contenido, su estructura y la visualización en distintos dispositivos.',
    'exp.edu1.title': 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Presente',
    'exp.edu1.desc': 'Técnico Superior en Desarrollo de Aplicaciones Web en modalidad Dual, combinando formación académica con ingeniería real en empresa.',
    'exp.edu2.title': 'Campus de Ingeniería de Software',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Formación intensiva basada en proyectos y aprendizaje entre pares, centrada en programación en C, algoritmos, gestión de memoria y fundamentos de sistemas.',
    'exp.edu3.title': 'Certificado de Profesionalidad en Desarrollo Web (Nivel 3)',
    'exp.edu3.company': 'Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Formación oficial en desarrollo web completo (frontend, backend, bases de datos y publicación de aplicaciones). Nota media: 9/10.',
    'stats.repos': 'Repositorios Públicos',
    'stats.commits': 'Commits Totales (Est.)',
    'stats.papers': 'Publicaciones Abiertas',
    'stats.followers': 'Seguidores GitHub',
    'api.title': 'API para Desarrolladores',
    'api.desc': '¿Eres desarrollador, equipo técnico o usas herramientas automatizadas? También puedes consultar mi currículum en formato estructurado directamente desde la terminal en XML, JSON, texto plano o llms.txt.',
    'research.lead': 'Además de crear aplicaciones, publico estudios abiertos con datos reales para comprobar si los sistemas funcionan de verdad y compartir el código con la comunidad.',
    'projects.title': 'Proyectos Destacados',
    'projects.viewAll': 'Ver Todos los Proyectos',
    'projects.close': 'Cerrar',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'CMS Nativo, Backend PHP, I18n',
    'projects.p1.desc': 'Web y gestor de contenidos a medida con filtros instantáneos, fácil administración y alto rendimiento en buscadores.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Des. Plugins',
    'projects.p2.desc': 'Dos extensiones en PHP creadas desde cero para exportar solicitudes a CSV y consultarlas de forma segura desde el panel.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Rediseño de plantilla a medida, mejora de posicionamiento SEO y catálogo digital más claro.',
    'contact.title1': 'VAMOS A',
    'contact.title2': 'CONECTAR',
    'contact.subtitle': '¿Tienes un proyecto en mente, buscas desarrollador para tu equipo o simplemente quieres consultar algo? Escríbeme sin compromiso.',
    'contact.email': 'Enviar Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'Actividad en GitHub',
    'contact.footer.madeWith': 'Diseñado y desarrollado por',
    'contact.footer.copyright': '© {year} Todos los derechos reservados.',
    'github.loading': 'Cargando repositorios...',
    'github.error': 'Error al cargar repositorios.',
    'github.stars': 'Estrellas',
    'github.forks': 'Forks',
    'github.viewRepo': 'Ver Repositorio',
    'github.allWorks': 'Todos los Trabajos (GitHub)',
    'github.noDesc': 'Sin descripción.',
  },
  eu: {
    'header.home': 'Hasierara itzuli',
    'header.logoAlt': 'Yeray Garridoren logotipoa - Itzuli hasierara',
    'header.githubAria': 'Joan Yerayren GitHub profilera',
    'header.linkedinAria': 'Joan Yerayren LinkedIn profilera',
    'header.emailAria': 'Bidali mezu elektroniko bat Yeray-ri',
    'header.photographyAria': 'Joan argazkilaritza portfoliora',
    'header.switchLanguage': 'Aldatu hizkuntza',
    'hero.role': 'Software Ingeniaria & Produktu Digitalen Sortzailea',
    'hero.portfolio': '© {year} PORTFOLIOA',
    'hero.downloadCv': 'CV-a Deskargatu',
    'hero.githubProfile': 'GitHub Profila',
    'hero.photographyProfile': 'Argazkilaritza profila',
    'intro.title1': 'NOLA SORTZEN DUDAN',
    'intro.title2': 'Software erabilgarria',
    'intro.desc1': 'Eguneroko arazo errealak konpontzeko web aplikazioak, tresna digitalak eta nire produktu propioak diseinatzen eta garatzen ditut. Ingeniaritza sendoa eta interfaze argi, azkar eta erabilerrazak uztartzen ditut pertsona eta enpresentzat.',
    'intro.subtitle1': 'IDEIATIK',
    'intro.subtitle2': 'PRODUKZIORA',
    'intro.desc2': 'Zure negoziorako web azkar bat, barne-kudeaketako tresna bat edo denbora errealeko aplikazio bat behar baduzu, prozesu osoaz arduratzen naiz: diseinua, programazioa, datu-baseak, segurtasuna eta argitalpena, txantiloi astunik gabe.',
    'intro.expertise1': 'ZER EGITEN DUDAN',
    'intro.expertise2': 'ETA NOLA LAN EGITEN DUDAN',
    'intro.feat1.title': 'Neurrirako webak eta app-ak',
    'intro.feat1.desc': 'Web korporatibo azkarretatik hasi eta zure proiektu edo enpresaren lan-modura egokitutako aplikazio osoetaraino, mugikorrean zein ordenagailuan ezin hobeto funtzionatzeko.',
    'intro.feat2.title': 'Sistema fidagarriak eta datuak',
    'intro.feat2.desc': 'Ikusten ez den ingeniaritza (PHP, Java, Python, SQL): arkitektura garbia, datu-base optimizatuak eta segurtasuna, plataforma azkar eta egonkor mantentzeko.',
    'intro.feat3.title': 'Automatizazioa eta AA aplikatua',
    'intro.feat3.desc': 'Lan errepikakorretan orduak aurrezten dituzten tresna praktikoak, datu irekiak edo enpresakoak konektatuz eta informazio konplexua erantzun argi bihurtuz.',
    'intro.feat4.title': 'Diseinu argia eta benetako UX',
    'intro.feat4.desc': 'Edozein pertsonarentzat garbi, irisgarri eta eroso irakurtzeko interfazeak, abiadura-optimizazioarekin eta bilatzaile zein AA-etan ikusgarritasun handiarekin (SEO eta GEO).',
    'stack.title': 'TRESNAK ETA TEKNOLOGIAK',
    'exp.title': 'ESPERIENTZIA ETA HEZKUNTZA',
    'exp.job3.title': 'Software Ingeniaria',
    'exp.job3.company': 'Horión Software Engineering',
    'exp.job3.date': '2026ko eka. - Gaur egun',
    'exp.job3.desc': 'Horión Enterprise enpresa-kudeaketako plataformarako (ERP) modulu nagusien garapena hasieratik amaierara PHP-n. Irteera-postontziaren modulu osoa sortu dut (bidalketen historia, eranskinen deskarga zuzena eta birbidalketa) eta bezero-interfazeak hobetu ditut.',
    'exp.job1.title': 'Full Stack Garatzaile Freelance',
    'exp.job1.company': 'Proiektu Independenteak',
    'exp.job1.date': '2025eko urt. - 2026ko eka.',
    'exp.job1.desc': 'Abiadura, argitasuna eta erabilgarritasuna lehenesten dituzten neurrirako webak eta produktu propioak. Besteak beste: Zalbi Aisia (neurrirako CMS eta berehalako iragazkiak), yeraygarrido.dev eta archive.yeraygarrido.dev.',
    'exp.job2.title': 'Web Administratzaile eta Plugin Garatzaile',
    'exp.job2.company': 'Glocalium Services SL',
    'exp.job2.date': '2025eko api. - 2025eko eka.',
    'exp.job2.desc': 'PHP-n hutsetik sortutako bi hedapen formularioak CSV-ra esportatzeko eta MySQL datu-basean modu seguruan gordetzeko kudeaketa-panelarekin. Zerbitzari migrazioak, babeskopia automatikoak, segurtasun-ikuskaritzak eta Figma prototipoak.',
    'exp.job5.title': 'Java Garatzaile (Freelance)',
    'exp.job5.company': 'Bermeoko Udala',
    'exp.job5.date': '2026ko mai. - 2026ko eka.',
    'exp.job5.desc': 'Galdutako objektuak kudeatzeko sistema osoa 15 eguneko sprint batean garatua: udal-langileentzako mahaigaineko aplikazioa (Java) eta herritarrek objektuak bilatzeko web ataria, zerbitzua inoiz ez eteteko babeskopia bikoitzarekin.',
    'exp.job4.title': 'Web Programatzaile',
    'exp.job4.company': 'Asociación Educativa Reciclanet',
    'exp.job4.date': '2022ko mar. - 2022ko api.',
    'exp.job4.desc': 'Elkartearen webgunearen mantentze-lanak eta eguneratzea, edukiaren argitasuna, egitura eta gailu ezberdinetako bistaratzea hobetuz.',
    'exp.edu1.title': 'Web Aplikazioen Garapeneko Goi Mailako Zikloa (DAW)',
    'exp.edu1.company': 'CIFP Zornotza LHII',
    'exp.edu1.date': '2024 - Gaur egun',
    'exp.edu1.desc': 'Web Aplikazioen Garapeneko Goi Mailako Teknikaria, Lanbide Heziketa Dualean prestakuntza eta enpresako benetako ingeniaritza uztartuz.',
    'exp.edu2.title': 'Software Ingeniaritzako Campusa',
    'exp.edu2.company': '42 Urduliz (Fundación Telefónica)',
    'exp.edu2.date': '2022 - 2023',
    'exp.edu2.desc': 'Proiektuetan eta parekoen arteko ikaskuntzan oinarritutako prestakuntza trinkoa, C programazioan, algoritmoetan, memoria-kudeaketan eta sistemen oinarrietan zentratua.',
    'exp.edu3.title': 'Web Garapeneko Profesionaltasun Ziurtagiria (3. Maila)',
    'exp.edu3.company': 'Fundación EDE',
    'exp.edu3.date': '2021 - 2022',
    'exp.edu3.desc': 'Web garapen osoan prestakuntza ofiziala (frontend, backend, datu-baseak eta aplikazioen argitalpena). Batez besteko nota: 9/10.',
    'stats.repos': 'Biltegi Publikoak',
    'stats.commits': 'Guztira Commits (Est.)',
    'stats.papers': 'Argitalpen Irekiak',
    'stats.followers': 'GitHub Jarraitzaileak',
    'api.title': 'Garatzaileentzako APIa',
    'api.desc': 'Garatzailea, talde teknikoa edo tresna automatizatuen erabiltzailea zara? Nire curriculuma zuzenean terminaletik kontsulta dezakezu formatu egituratuan (XML, JSON, testu laua edo llms.txt).',
    'research.lead': 'Aplikazioak sortzeaz gain, benetako datuetan oinarritutako ikerketa irekiak argitaratzen ditut, sistemek benetan funtzionatzen dutela egiaztatzeko eta kodea komunitatearekin partekatzeko.',
    'projects.title': 'Proiektu Nabarmenak',
    'projects.viewAll': 'Proiektu Guztiak Ikusi',
    'projects.close': 'Itxi',
    'projects.p1.title': 'Zalbi Aisia',
    'projects.p1.tech': 'CMS Natiboa, PHP Backend, I18n',
    'projects.p1.desc': 'Neurrirako webgunea eta eduki-kudeatzailea, berehalako iragazkiekin eta bilatzaileetan errendimendu bikainarekin.',
    'projects.p2.title': 'Glocalium',
    'projects.p2.tech': 'PHP, MySQL, Plugin Garapena',
    'projects.p2.desc': 'Hutsetik sortutako bi PHP hedapen formularioak CSV-ra esportatzeko eta paneletik modu seguruan kudeatzeko.',
    'projects.p3.title': 'Reciclanet',
    'projects.p3.tech': 'HTML, CSS, SEO',
    'projects.p3.desc': 'Neurrirako txantiloiaren berdiseinua, SEO hobekuntza eta katalogo digital argiagoa.',
    'contact.title1': 'KONEKTATU',
    'contact.title2': 'DEZAGUN',
    'contact.subtitle': 'Proiekturen bat duzu buruan, zure talderako garatzaile bila zabiltza edo zerbait galdetu nahi didazu? Idatzi konpromisorik gabe.',
    'contact.email': 'Mezua Bidali',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'Jarduera GitHub-en',
    'contact.footer.madeWith': 'Diseinatua eta garatua:',
    'contact.footer.copyright': '© {year} Eskubide guztiak erreserbatuta.',
    'github.loading': 'Biltegiak kargatzen...',
    'github.error': 'Errorea biltegiak kargatzean.',
    'github.stars': 'Izarrak',
    'github.forks': 'Forks',
    'github.viewRepo': 'Biltegia Ikusi',
    'github.allWorks': 'Lan Guztiak (GitHub)',
    'github.noDesc': 'Deskribapenik gabe.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Actualiza el atributo lang del HTML — esencial para hyphens: auto, lectores de pantalla y SEO
    document.documentElement.lang = language;

    const seoData = {
      es: {
        title: 'Yeray Garrido | Ingeniero de Software y Open Science',
        description:
          'Yeray Garrido — Ingeniero de Software en Bilbao. Creador de Bideplus (Bide+) y Gasolinera+ (gasolineraplus.app), ingeniero en Horión y autor de publicaciones científicas abiertas en Zenodo.',
      },
      en: {
        title: 'Yeray Garrido | Software Engineer & Open Science',
        description:
          'Yeray Garrido — Software Engineer in Bilbao. Creator of Bideplus (Bide+) and Gasolinera+ (gasolineraplus.app), engineer at Horión, and author of open-access publications on Zenodo.',
      },
      eu: {
        title: 'Yeray Garrido | Software Ingeniaria eta Open Science',
        description:
          'Yeray Garrido — Software Ingeniaria Bilbon. Bideplus (Bide+) eta Gasolinera+ (gasolineraplus.app) aplikazioen sortzailea, Horión-eko ingeniaria eta Zenodo-ko ikerketa irekien egilea.',
      },
    };

    const { title, description } = seoData[language];
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute('content', content);
    };

    setMeta('meta[name="title"]', title);
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta(
      'meta[property="og:locale"]',
      language === 'es' ? 'es_ES' : language === 'en' ? 'en_US' : 'eu_ES'
    );
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = translations[language][key as keyof (typeof translations)['en']] || key;
    if (params) {
      Object.keys(params).forEach((k) => {
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
