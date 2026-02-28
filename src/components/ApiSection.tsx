import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ApiSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  
  const command = "curl -L https://yeraygarrido.dev/cv.xml";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} data-reveal="up" className="py-24 md:py-32 px-6 md:px-12 bg-black text-white relative z-10 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center md:text-left flex flex-col md:row items-center gap-12">
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            <h2 className="font-wide text-3xl md:text-4xl font-bold uppercase">{t('api.title')}</h2>
          </div>
          <p className="font-sans text-white/60 text-lg leading-relaxed mb-8 max-w-xl">{t('api.desc')}</p>
        </div>
        <div className="w-full md:w-auto flex-1">
          <div className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="font-mono text-xs text-white/50">xml</span>
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <code className="font-mono text-sm md:text-base text-green-400 break-all">
                <span className="text-white/50 select-none">$ </span>{command}
              </code>
              <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-md transition-colors" aria-label="Copy command">
                {copied
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}