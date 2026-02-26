import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  fork: boolean;
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const projects = [
    {
      title: t('projects.p1.title'),
      tech: t('projects.p1.tech'),
      desc: t('projects.p1.desc'),
      link: "https://github.com/Garridoparrayeray/Zalbi-Aisia",
    },
    {
      title: t('projects.p2.title'),
      tech: t('projects.p2.tech'),
      desc: t('projects.p2.desc'),
    },
    {
      title: t('projects.p3.title'),
      tech: t('projects.p3.tech'),
      desc: t('projects.p3.desc'),
    }
  ];

  useEffect(() => {
    imagesRef.current.forEach((img) => {
      if (!img) return;
      gsap.to(img, {
        x: 50,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          horizontal: true,
          scroller: scrollRef.current,
          start: "left right",
          end: "right left",
          scrub: true,
        }
      });
    });
  }, []);

  const fetchRepos = async () => {
    setIsModalOpen(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.github.com/users/Garridoparrayeray/repos?sort=updated&per_page=100');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      // Filter out specific repos, but keep forks
      const excludedRepos = ['manfred', 'garridoparrayeray'];
      const filteredRepos = data.filter((repo: Repo) => {
        return !excludedRepos.includes(repo.name.toLowerCase());
      });
      
      setRepos(filteredRepos);
    } catch (err) {
      setError(t('github.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section ref={sectionRef} className="min-h-[100svh] bg-black text-white flex flex-col relative z-10 border-t border-white/10 pb-24">
        <div className="pt-16 md:pt-24 px-8 md:px-24 shrink-0 flex justify-between items-end">
          <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase text-white">{t('projects.title')}</h2>
          <div className="hidden md:block">
            <button 
              onClick={fetchRepos}
              className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300"
            >
              {t('projects.viewAll')}
            </button>
          </div>
        </div>
        
        {/* Native Horizontal Scroll Container */}
        <div 
          ref={scrollRef} 
          className="flex-1 flex items-center mt-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-8 md:gap-16 px-8 md:px-24 w-max items-center">
            {projects.map((p, i) => {
              const CardWrapper = p.link ? 'a' : 'div';
              const wrapperProps = p.link ? { href: p.link, target: "_blank", rel: "noreferrer" } : {};
              
              return (
                <CardWrapper 
                  key={i} 
                  {...wrapperProps}
                  ref={el => { cardsRef.current[i] = el as HTMLDivElement; }} 
                  className="w-[85vw] md:w-[45vw] max-w-[600px] shrink-0 flex flex-col group snap-center"
                >
                  <div className="aspect-[16/9] bg-[#111] mb-6 overflow-hidden relative border border-white/10 group-hover:border-white/40 transition-colors duration-500 rounded-lg cursor-pointer">
                    <div ref={el => { imagesRef.current[i] = el as HTMLDivElement; }} className="absolute inset-0 flex items-center justify-center font-display text-[20vw] text-white/5 group-hover:text-white/10 transition-colors duration-700 -left-10 w-[calc(100%+50px)]">
                      0{i + 1}
                    </div>
                    {p.link && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-wide text-2xl md:text-3xl mb-3 uppercase font-bold group-hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-3">
                        {p.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {p.tech.split(', ').map((t, j) => (
                          <span key={j} className="font-sans text-[10px] tracking-widest text-black bg-white px-2 py-1 uppercase font-bold rounded-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-white/60 leading-relaxed text-sm">{p.desc}</p>
                  </div>
                </CardWrapper>
              );
            })}
            
            {/* View All Works Card (Visible at the end of scroll) */}
            <div 
              onClick={fetchRepos}
              className="w-[85vw] md:w-[30vw] max-w-[400px] shrink-0 flex flex-col items-center justify-center snap-center h-full min-h-[400px] border border-white/10 rounded-lg hover:border-white/40 transition-colors cursor-pointer group"
            >
              <h3 className="font-wide text-2xl md:text-3xl uppercase font-bold group-hover:text-white text-white/50 transition-colors mb-4 text-center">
                {t('projects.viewAll').split(' ').map((word, idx) => (
                  <span key={idx}>{word}<br/></span>
                ))}
              </h3>
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden px-8 mt-8 flex justify-center">
          <button 
            onClick={fetchRepos}
            className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300 w-full text-center"
          >
            {t('projects.viewAll')}
          </button>
        </div>
      </section>

      {/* GitHub Repos Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col">
          <div className="flex justify-between items-center p-6 md:p-12 border-b border-white/10">
            <h2 className="font-wide text-2xl md:text-4xl text-white uppercase">{t('github.allWorks')}</h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 font-sans">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {repos.map(repo => (
                  <a 
                    key={repo.id} 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors group flex flex-col h-full rounded-lg"
                  >
                    <h3 className="font-wide text-xl text-white mb-2 group-hover:text-white/80 truncate">{repo.name}</h3>
                    <p className="font-sans text-sm text-white/60 mb-6 flex-1 line-clamp-3">
                      {repo.description || t('github.noDesc')}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <div className="flex gap-4 text-xs font-sans text-white/40">
                        {repo.language && <span>{repo.language}</span>}
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          {repo.stargazers_count}
                        </span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-colors"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
