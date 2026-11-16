import { useLanguage } from '../context/LanguageContext';

interface PaperItem {
  id: string;
  year: string;
  venue: string;
  title: { es: string; en: string; eu: string };
  type: { es: string; en: string; eu: string };
  tldr: { es: string; en: string; eu: string };
  doi: string;
  doiUrl: string;
  repoUrl: string;
  metrics: string[];
}

export default function Research() {
  const { language } = useLanguage();

  const l = (obj: { es: string; en: string; eu: string }) => obj[language] || obj.es;

  const sectionLabels = {
    badge: {
      es: "Publicaciones Científicas · Open Science",
      en: "Scientific Publications · Open Science",
      eu: "Argitalpen Zientifikoak · Open Science"
    },
    title: {
      es: "Investigación",
      en: "Research",
      eu: "Ikerketa"
    },
    summary: {
      es: "Resumen:",
      en: "Summary:",
      eu: "Laburpena:"
    },
    code: {
      es: "Código (GitHub)",
      en: "Code (GitHub)",
      eu: "Kodea (GitHub)"
    }
  };

  const papers: PaperItem[] = [
    {
      id: "paper-paired",
      year: "2026",
      venue: "Zenodo (CERN) · Preprint",
      title: {
        es: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain",
        en: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain",
        eu: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain"
      },
      type: {
        es: "Evaluación Empírica Pareada",
        en: "Empirical Paired Benchmark",
        eu: "Ebaluazio Enpiriko Parekatua"
      },
      tldr: {
        es: "Benchmark de 555.744 predicciones pareadas frente al paso real por GPS: Bide+ alcanza un 64 % de precisión frente al 39 % de la app oficial de Bizkaibus, superándola en 57 de 59 paradas evaluadas.",
        en: "Benchmark of 555,744 paired predictions against actual GPS ground truth: Bide+ achieves 64% accuracy vs 39% for official operator, leading in 57 of 59 stops.",
        eu: "555.744 aurreikuspen parekaturen benchmark-a GPS errealaren aurka: Bide+-k %64ko zehaztasuna du app ofizialaren %39aren aurrean, 59tik 57 geralekutan irabaziz."
      },
      doi: "10.5281/zenodo.24286027",
      doiUrl: "https://doi.org/10.5281/zenodo.24286027",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      metrics: ["555.744 predicciones", "64 % vs 39 % precisión", "57 / 59 paradas"]
    },
    {
      id: "paper-threelayer",
      year: "2026",
      venue: "Zenodo (CERN) · Preprint",
      title: {
        es: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation",
        en: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation",
        eu: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation"
      },
      type: {
        es: "Especificación del Método",
        en: "Method Specification",
        eu: "Metodoaren Zehaztapena"
      },
      tldr: {
        es: "Arquitectura en 3 capas con abstención explícita y medianas aprendidas para feeds que no publican retrasos: 92–96 % de acierto en <3 min sobre 9,1 millones de predicciones evaluadas.",
        en: "Three-layer architecture with explicit abstention and learned medians for feeds omitting delays: 92–96% accuracy under 3 min across 9.1 million predictions.",
        eu: "3 geruzako arkitektura atzerapenik gabeko feed-etarako: %92-96ko zehaztasuna <3 minutuan 9,1 milioi aurreikuspenetan ebaluatuta."
      },
      doi: "10.5281/zenodo.24286302",
      doiUrl: "https://doi.org/10.5281/zenodo.24286302",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      metrics: ["9,1M predicciones", "92–96 % precisión (<3 min)", "2x s/ Horario Oficial"]
    },
    {
      id: "paper-monograph",
      year: "2026",
      venue: "Zenodo (CERN) · Technical Monograph",
      title: {
        es: "Predicción de llegadas de autobuses con posiciones en tiempo real y horarios interpolados",
        en: "Bus arrival prediction from real-time positions and interpolated timetables",
        eu: "Autobusen iritsiera-aurreikuspena denbora errealeko posizioekin eta interpolatutako ordutegiekin"
      },
      type: {
        es: "Memoria de Referencia (200 pp.)",
        en: "Reference Monograph (200 pp.)",
        eu: "Erreferentziazko Memoria (200 orri)"
      },
      tldr: {
        es: "Memoria técnica exhaustiva de 200 páginas: formulación matemática, filtro de Kalman sobre ritmo y red neuronal (-7 % error adicional), con 407 vectores de prueba e implementación abierta en Python.",
        en: "Comprehensive 200-page monograph: mathematical proofs, Kalman filtering, neural network (-7% error), 407 test vectors, and open Python reference implementation.",
        eu: "200 orrialdeko memoria teknikoa: formulazio matematikoa, Kalman iragazkia, sare neuronala (-%7 errorea), 407 proba-bektore eta Python inplementazio irekia."
      },
      doi: "10.5281/zenodo.24041572",
      doiUrl: "https://doi.org/10.5281/zenodo.24041572",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      metrics: ["200 páginas", "407 tests de prueba", "Kalman + Red Neuronal"]
    }
  ];

  return (
    <section id="research" className="relative bg-black text-white border-t border-white/10 z-10 py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Cabecera Estándar de Portfolio de Investigación */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <span className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-white/40 font-bold block mb-2">
              {l(sectionLabels.badge)}
            </span>
            <h2 className="font-wide text-2xl sm:text-3xl md:text-5xl font-bold uppercase text-white">
              {l(sectionLabels.title)}
            </h2>
          </div>

          <a
            href="https://github.com/Garridoparrayeray/bide-eta"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] sm:text-xs tracking-widest uppercase border border-white/20 hover:border-white px-3.5 py-2 hover:bg-white hover:text-black transition-colors self-start md:self-auto flex items-center gap-2"
          >
            <span>Zenodo &bull; Open Access</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </a>
        </div>

        {/* Lista de Publicaciones Estándar de la Industria */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {papers.map((p) => (
            <article key={p.id} className="py-8 md:py-10 group hover:bg-white/[0.015] transition-colors">
              {/* Meta: Venue & Year */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-white/40 mb-2">
                <span className="text-white/80 font-bold tracking-wider">{p.year}</span>
                <span>·</span>
                <span className="tracking-wide uppercase text-[10px] border border-white/15 px-1.5 py-0.5">{l(p.type)}</span>
                <span>·</span>
                <span className="text-white/50">{p.venue}</span>
              </div>

              {/* Título en enlace directo */}
              <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                <a
                  href={p.doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  {l(p.title)}
                </a>
              </h3>

              {/* TL;DR conciso */}
              <p className="font-sans text-xs sm:text-sm text-white/60 mb-4 leading-relaxed max-w-4xl">
                <strong className="text-white/80 font-medium">{l(sectionLabels.summary)} </strong>
                {l(p.tldr)}
              </p>

              {/* Fila de Acciones y Métricas */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Botones de Acción Estándar */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={p.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[11px] uppercase tracking-wider font-bold bg-white text-black hover:bg-white/90 px-3 py-1.5 transition-colors flex items-center gap-1.5"
                  >
                    <span>Paper (DOI)</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[11px] uppercase tracking-wider font-semibold border border-white/20 hover:border-white text-white/80 hover:text-white px-3 py-1.5 transition-colors flex items-center gap-1.5"
                  >
                    <span>{l(sectionLabels.code)}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                </div>

                {/* Píldoras de métricas discretas */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans text-white/40">
                  {p.metrics.map((m, mi) => (
                    <span key={mi} className="bg-white/5 border border-white/10 px-2 py-0.5 text-white/70">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
