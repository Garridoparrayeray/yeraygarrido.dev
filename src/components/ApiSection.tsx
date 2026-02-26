import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { Terminal, Copy, Check } from 'lucide-react';

export default function ApiSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const command = "curl https://yeraygarrido.com/api/cv.xml";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-black text-white relative z-10 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <Terminal className="w-8 h-8 text-white/80" />
            <h2 className="font-wide text-3xl md:text-4xl font-bold uppercase">
              {t('api.title')}
            </h2>
          </div>
          <p className="font-sans text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
            {t('api.desc')}
          </p>
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
                <span className="text-white/50 select-none">$ </span>
                {command}
              </code>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white/50" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
