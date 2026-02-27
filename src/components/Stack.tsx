import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

const techStack = [
  // Core & Back-end
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  // Base de Datos & CMS
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
  // Front-end
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  // Infraestructura & OS
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'Bash', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-plain.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  // Herramientas & Frameworks
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'LaTeX', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg', invert: true },
];

export default function Stack() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.stack-item', gridRef.current);
      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-black border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase mb-16 md:mb-24 text-center md:text-left">
          {t('stack.title')}
        </h2>
        
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
          {techStack.map((tech, i) => (
            <div key={i} className="stack-item bg-black p-8 md:p-10 flex flex-col items-center justify-center gap-6 group md:hover:bg-white/[0.02] transition-colors duration-500">
              <img 
                src={tech.icon} 
                alt={`Logotipo de ${tech.name} - Stack Tecnológico de Yeray Garrido`}
                loading="lazy"
                decoding="async"
                width="56"
                height="56"
                className={`w-10 h-10 md:w-14 md:h-14 object-contain transition-all duration-500 transform md:opacity-50 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0 md:group-hover:scale-110 ${tech.invert ? 'invert' : ''}`} 
              />
              <span className="font-sans text-xs tracking-widest uppercase font-bold transition-colors duration-500 text-white md:text-white/50 md:group-hover:text-white">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
