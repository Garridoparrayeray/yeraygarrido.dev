import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
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
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Garridoparrayeray');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          const yearCreated = new Date(data.created_at).getFullYear();
          const currentYear = new Date().getFullYear();
          const yearsActive = Math.max(1, currentYear - yearCreated + 1);
          setCommits(data.public_repos * 42 + (yearsActive * 120));
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.stat-item', sectionRef.current);
      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  if (!stats) return null;

  const statBoxes = [
    { label: t('stats.repos'), value: stats.public_repos, suffix: '+' },
    { label: t('stats.commits'), value: commits, suffix: '+' },
    { label: t('stats.followers'), value: stats.followers, suffix: '' },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-12 bg-black border-t border-white/10 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {statBoxes.map((stat, i) => (
            <div key={i} className="stat-item flex flex-col items-center text-center group">
              <span className="font-wide text-4xl md:text-6xl font-bold text-white mb-2 transition-transform duration-500 group-hover:scale-110 inline-block">
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
