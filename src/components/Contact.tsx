import { useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.reveal-line').forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * 0.2}s`; el.classList.add('in-view');
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    if (textRef.current) io.observe(textRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-12 flex flex-col justify-center relative z-10 bg-white text-black overflow-hidden">
      
      <div className="max-w-5xl mx-auto w-full mb-16 md:mb-24 flex flex-col items-center overflow-hidden">
        <h3 className="font-wide text-xl md:text-3xl uppercase mb-8 md:mb-12 font-bold tracking-widest text-center">{t('contact.github')}</h3>
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar flex justify-center">
          <div className="w-max px-4">
            <a href="https://github.com/Garridoparrayeray" target="_blank" rel="noreferrer" className="block hover:opacity-80 transition-opacity cursor-pointer" aria-label={t('header.githubAria')}>
              <GitHubCalendar
                username="Garridoparrayeray"
                colorScheme="light"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                transformData={(contributions) => {
                  const startDate = new Date('2025-10-01').getTime();
                  return contributions.filter(day => new Date(day.date).getTime() >= startDate);
                }}
              />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full text-center flex-1 flex flex-col justify-center">
        <h2 ref={textRef} className="font-display text-[15vw] md:text-[10vw] leading-[0.85] uppercase mb-12 perspective-1000">
          <div className="overflow-hidden"><div className="reveal-line origin-bottom">{t('contact.title1')}</div></div>
          <div className="overflow-hidden"><div className="reveal-line origin-bottom text-black">{t('contact.title2')}</div></div>
        </h2>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 md:mt-12 max-w-2xl mx-auto w-full">
          <a href="mailto:garridoparrayeraytx@gmail.com" className="flex-1 flex group w-full cursor-pointer" aria-label={t('header.emailAria')}>
            <div className="bg-black border border-black w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black transition-colors duration-300"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="bg-white border border-black flex-1 flex items-center justify-center font-sans font-bold text-black text-sm md:text-lg tracking-widest uppercase group-hover:bg-black group-hover:text-white transition-colors duration-300">
              {t('contact.email')}
            </div>
          </a>
          <a href="https://www.linkedin.com/in/yeray-garrido-parra" target="_blank" rel="noreferrer" className="flex-1 flex group w-full cursor-pointer" aria-label={t('header.linkedinAria')}>
            <div className="bg-black border border-black w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black transition-colors duration-300"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
            <div className="bg-white border border-black flex-1 flex items-center justify-center font-sans font-bold text-black text-sm md:text-lg tracking-widest uppercase group-hover:bg-black group-hover:text-white transition-colors duration-300">
              {t('contact.linkedin')}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}