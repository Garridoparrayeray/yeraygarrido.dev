import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, t} = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-5 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
      <a 
          href="/"
          onClick={(e) => {
            e.preventDefault(); // Evita que la página recargue de golpe
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Dispara el scroll suave
          }}
          className="header-item font-wide font-bold text-xl tracking-widest uppercase text-white hover:opacity-70 transition-opacity cursor-pointer"
          aria-label={t('header.home')}
        >
          YG.
        </a>

        {/* Quick Links & Lang Switcher , importante para que se pueda cambiar entre ES Y EN con los idiomas adjuntos*/}
        <div className="flex items-center gap-6 md:gap-8">
          
          {/* Social Links pero en dispositivos pequeños se oculta, no queda estetico sino*/}
          <div className="hidden md:flex items-center gap-5">
            <a href="https://github.com/Garridoparrayeray" target="_blank" rel="noreferrer" className="header-item text-white/60 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/yeray-garrido" target="_blank" rel="noreferrer" className="header-item text-white/60 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:garridoparrayeraytx@gmail.com" className="header-item text-white/60 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Divider */}
          <div className="hidden md:block header-item w-px h-6 bg-white/20"></div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="header-item font-sans text-xs tracking-widest uppercase font-bold px-3 py-1.5 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-white"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
}
