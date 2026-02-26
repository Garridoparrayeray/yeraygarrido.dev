import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

export default function Intro() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  const features = [
    {
      num: '01',
      title: t('intro.feat1.title'),
      desc: t('intro.feat1.desc')
    },
    {
      num: '02',
      title: t('intro.feat2.title'),
      desc: t('intro.feat2.desc')
    },
    {
      num: '03',
      title: t('intro.feat3.title'),
      desc: t('intro.feat3.desc')
    },
    {
      num: '04',
      title: t('intro.feat4.title'),
      desc: t('intro.feat4.desc')
    }
  ];

  useEffect(() => {
    const lines = gsap.utils.toArray('.reveal-text');
    lines.forEach((line: any) => {
      gsap.fromTo(line, 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
          }
        }
      );
    });

    // Features reveal in the white section
    itemsRef.current.forEach((item) => {
      if (!item) return;
      const num = item.querySelector('.feature-num');
      const content = item.querySelector('.feature-content');
      
      const featureTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      });
      
      featureTl.fromTo(num, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
               .fromTo(content, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
    });
  }, []);

  return (
    <section className="relative z-10">
      <div className="bg-black text-white py-24 md:py-32 min-h-[100svh] flex flex-col justify-center perspective-1000">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-4xl md:text-7xl uppercase mb-8 md:mb-12 leading-none reveal-text">
            {t('intro.title1')} <br/> {t('intro.title2')}
          </h2>
          <p className="font-sans text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed md:leading-loose reveal-text">
            {t('intro.desc1')}
          </p>
          <h3 className="font-wide text-white text-xl md:text-4xl uppercase mt-20 md:mt-32 tracking-widest leading-tight reveal-text">
            {t('intro.subtitle1')} <br/> {t('intro.subtitle2')}
          </h3>
          <p className="font-sans text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed md:leading-loose mt-8 md:mt-12 reveal-text">
            {t('intro.desc2')}
          </p>
        </div>
      </div>

      <div className="bg-[#f2f2f2] text-black pt-24 pb-24 md:pt-32 md:pb-32 relative z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex justify-start md:justify-end mb-12 md:mb-16 reveal-text">
            <h2 className="font-wide text-3xl md:text-5xl uppercase text-left md:text-right leading-none">
              {t('intro.expertise1')} <br/> <span className="text-black/30">{t('intro.expertise2')}</span>
            </h2>
          </div>

          <div className="border-t-2 border-black">
            {features.map((feature, i) => (
              <div key={i} ref={el => { itemsRef.current[i] = el; }} className="border-b-2 border-black py-12 md:py-24 flex flex-col md:flex-row gap-6 md:gap-24 relative overflow-hidden group">
                <div className="feature-num font-display text-[20vw] md:text-[12vw] leading-none text-black/10 md:text-black/20 select-none transition-transform duration-500 group-hover:scale-110 origin-left">
                  {feature.num}
                </div>
                <div className="feature-content flex-1 flex flex-col justify-end">
                  <h3 className="font-wide text-xl md:text-4xl font-bold uppercase mb-4 tracking-wider">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-base md:text-xl text-black/70 max-w-xl leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
