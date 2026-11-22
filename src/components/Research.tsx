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
  pdfUrl: string;
  pdfFilename: string;
  readingPdfUrl?: string;
  readingPdfFilename?: string;
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
    downloadPdf: {
      es: "Descargar PDF",
      en: "Download PDF",
      eu: "PDF Deskargatu"
    },
    readingPdf: {
      es: "PDF (Lectura)",
      en: "PDF (Reading)",
      eu: "PDF (Irakurketa)"
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
        es: "Benchmark de 555.744 predicciones pareadas frente al paso real por GPS: Bide+ queda a ±2 min del paso real en el 64 % de los casos, frente al 39 % de la app oficial y el 16 % del horario; a partir de tres minutos, acierta más en 57 de 59 paradas.",
        en: "Benchmark of 555,744 paired predictions against actual GPS ground truth: Bide+ is within ±2 min in 64% of cases vs 39% for the official real time and 16% for the timetable; from three minutes out, it is ahead at 57 of 59 stops.",
        eu: "555.744 aurreikuspen parekaturen benchmark-a GPS errealaren aurka: Bide+ ±2 minututan dago kasuen %64an, app ofizialaren %39aren eta ordutegiaren %16aren aurrean; hiru minututik aurrera, 59tik 57 geralekutan hobea da."
      },
      doi: "10.5281/zenodo.24286027",
      doiUrl: "https://doi.org/10.5281/zenodo.24286027",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      pdfUrl: "/papers/Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_preprint_v1.0.pdf",
      pdfFilename: "Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_preprint_v1.0.pdf",
      readingPdfUrl: "/papers/Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_reading-version_v1.0.pdf",
      readingPdfFilename: "Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_reading-version_v1.0.pdf",
      metrics: ["555.744 predicciones", "64 % vs 39 % precisión", "57 / 59 paradas (≥3 min)"]
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
        es: "Arquitectura en 3 capas con abstención explícita y medianas aprendidas para feeds que no publican retrasos: a ±2 min en el 92–96 % de los casos con el bus a menos de tres minutos, sobre 9,1 millones de predicciones.",
        en: "Three-layer architecture with explicit abstention and learned medians for feeds omitting delays: within ±2 min in 92–96% of cases when the bus is under three minutes away, across 9.1 million predictions.",
        eu: "3 geruzako arkitektura atzerapenik gabeko feed-etarako: ±2 minututan kasuen %92–96an autobusa hiru minutu baino gutxiagora dagoenean, 9,1 milioi aurreikuspenetan."
      },
      doi: "10.5281/zenodo.24286302",
      doiUrl: "https://doi.org/10.5281/zenodo.24286302",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      pdfUrl: "/papers/Garrido_2026_Bus_arrival_prediction_three-layer_method_preprint_v1.1.pdf",
      pdfFilename: "Garrido_2026_Bus_arrival_prediction_three-layer_method_preprint_v1.1.pdf",
      metrics: ["9,1M predicciones", "92–96 % a ±2 min (<3 min)", "67 % vs 23–25 % horario (10–20 min)"]
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
        es: "Memoria técnica exhaustiva de 200 páginas: formulación matemática, filtro de Kalman sobre ritmo y red neuronal (−6–7 % de error medio), con 407 vectores de prueba e implementación abierta en Python.",
        en: "Comprehensive 200-page monograph: mathematical proofs, Kalman filtering, neural network (−6–7% mean error), 407 test vectors, and open Python reference implementation.",
        eu: "200 orrialdeko memoria teknikoa: formulazio matematikoa, Kalman iragazkia, sare neuronala (−%6–7 batez besteko errorea), 407 proba-bektore eta Python inplementazio irekia."
      },
      doi: "10.5281/zenodo.24041572",
      doiUrl: "https://doi.org/10.5281/zenodo.24041572",
      repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
      pdfUrl: "/papers/Garrido_2026_Prediccion_llegadas_autobuses_memoria_v2.1.pdf",
      pdfFilename: "Garrido_2026_Prediccion_llegadas_autobuses_memoria_v2.1.pdf",
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
                    href={p.pdfUrl}
                    download={p.pdfFilename}
                    aria-label={`${l(sectionLabels.downloadPdf)}: ${l(p.title)}`}
                    className="font-sans text-[11px] uppercase tracking-wider font-bold bg-white text-black hover:bg-white/90 px-3 py-1.5 transition-colors flex items-center gap-1.5"
                  >
                    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>{l(sectionLabels.downloadPdf)}</span>
                  </a>
                  {p.readingPdfUrl && (
                    <a
                      href={p.readingPdfUrl}
                      download={p.readingPdfFilename}
                      aria-label={`${l(sectionLabels.readingPdf)}: ${l(p.title)}`}
                      className="font-sans text-[11px] uppercase tracking-wider font-semibold border border-white/25 hover:border-white text-white/85 hover:text-white px-3 py-1.5 transition-colors flex items-center gap-1.5"
                    >
                      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      <span>{l(sectionLabels.readingPdf)}</span>
                    </a>
                  )}
                  <a
                    href={p.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[11px] uppercase tracking-wider font-semibold border border-white/20 hover:border-white text-white/80 hover:text-white px-3 py-1.5 transition-colors flex items-center gap-1.5"
                  >
                    <span>Zenodo (DOI)</span>
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[11px] uppercase tracking-wider font-semibold border border-white/20 hover:border-white text-white/80 hover:text-white px-3 py-1.5 transition-colors flex items-center gap-1.5"
                  >
                    <span>{l(sectionLabels.code)}</span>
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
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
