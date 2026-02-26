import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

const techStack = [
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
];

export default function Stack() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = gsap.utils.toArray('.stack-item');
    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-black border-t border-white/10 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase mb-16 md:mb-24 text-center md:text-left">
          {t('stack.title')}
        </h2>
        
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {techStack.map((tech, i) => (
            <div key={i} className="stack-item bg-black p-8 md:p-12 flex flex-col items-center justify-center gap-6 group md:hover:bg-white/[0.02] transition-colors duration-500">
              <img 
                src={tech.icon} 
                alt={`Logotipo de ${tech.name} - Stack Tecnológico de Yeray Garrido`}
                className="w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-500 transform md:opacity-50 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0 md:group-hover:scale-110" 
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
