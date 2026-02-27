import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Experience() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  const experiences = [
    { title: t('exp.job1.title'), company: t('exp.job1.company'), date: t('exp.job1.date'), desc: t('exp.job1.desc') },
    { title: t('exp.job2.title'), company: t('exp.job2.company'), date: t('exp.job2.date'), desc: t('exp.job2.desc') },
    { title: t('exp.edu1.title'), company: t('exp.edu1.company'), date: t('exp.edu1.date'), desc: t('exp.edu1.desc') },
  ];

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    sectionRef.current?.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-black text-white relative z-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase mb-16 md:mb-24 text-center md:text-left">
          {t('exp.title')}
        </h2>
        <div className="relative border-l border-white/20 ml-4 md:ml-0">
          {experiences.map((exp, i) => (
            <div key={i} data-reveal="up" style={{transitionDelay:`${i*0.1}s`}} className="mb-16 md:mb-24 pl-8 md:pl-12 relative group">
              <div className="absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-2 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8 mb-4">
                <h3 className="font-wide text-xl md:text-2xl font-bold uppercase">{exp.title}</h3>
                <span className="font-sans text-xs md:text-sm tracking-widest uppercase text-white/50 whitespace-nowrap">{exp.date}</span>
              </div>
              <h4 className="font-sans text-sm md:text-base tracking-widest uppercase text-white/80 mb-6 font-bold">{exp.company}</h4>
              <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed max-w-3xl">{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
