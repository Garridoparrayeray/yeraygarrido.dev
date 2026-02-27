import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface GithubStats {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export default function Stats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [commits, setCommits] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/Garridoparrayeray')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setStats(data);
        const years = Math.max(1, new Date().getFullYear() - new Date(data.created_at).getFullYear() + 1);
        setCommits(data.public_repos * 42 + years * 120);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!stats) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
            (el as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
            el.classList.add('in-view');
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [stats]);

  if (!stats) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-12 bg-black border-t border-white/10 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { label: t('stats.repos'), value: stats.public_repos, suffix: '+' },
            { label: t('stats.commits'), value: commits, suffix: '+' },
            { label: t('stats.followers'), value: stats.followers, suffix: '' },
          ].map((stat, i) => (
            <div key={i} data-reveal="up" className="flex flex-col items-center text-center group">
              {/* Hemos eliminado transition-transform, duration-500 y group-hover:scale-110 */}
              <span className="font-wide text-4xl md:text-6xl font-bold text-white mb-2 inline-block">
                {stat.value}{stat.suffix}
              </span>
              <span className="font-sans text-xs md:text-sm tracking-widest uppercase text-white/50 font-bold group-hover:text-white/80 transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
