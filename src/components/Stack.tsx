import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const techStack = [
  { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'Bash', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-plain.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'LaTeX', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg', invert: true },
];

export default function Stack() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * 0.04}s`;
            el.classList.add('in-view');
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    if (gridRef.current) io.observe(gridRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-black border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase mb-16 md:mb-24 text-center md:text-left">
          {t('stack.title')}
        </h2>
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
          {techStack.map((tech, i) => (
            <div key={i} data-reveal="up" className="bg-black p-8 md:p-10 flex flex-col items-center justify-center gap-6 group md:hover:bg-white/[0.02] transition-colors duration-500">
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
