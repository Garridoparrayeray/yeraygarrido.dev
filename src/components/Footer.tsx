import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

type ModalType = "legal" | "privacy" | "cookies" | null;

export default function Footer() {
  const { language, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // ESCUCHADOR PARA EL BANNER DE COOKIES
  useEffect(() => {
    const handleOpenCookies = () => setActiveModal("cookies");
    
    window.addEventListener("open-cookies-modal", handleOpenCookies);
    
    return () => {
      window.removeEventListener("open-cookies-modal", handleOpenCookies);
    };
  }, []);

  const legalContent = {
    es: {
      links: { legal: "Aviso Legal", privacy: "Privacidad", cookies: "Cookies" },
      modalContent: {
        legal: { title: "Aviso Legal", body: "Este sitio web es el portfolio profesional de Yeray Garrido. Su finalidad es estrictamente informativa y de exhibición de proyectos de desarrollo de software.\n\nAl ser un sitio web personal que no realiza comercio electrónico directo, el acceso es público y gratuito. Los códigos fuente enlazados pertenecen a sus respectivos repositorios en GitHub bajo sus propias licencias." },
        privacy: { title: "Política de Privacidad", body: "Me tomo tu privacidad en serio. Esta web no incluye formularios de registro ni bases de datos de usuarios.\n\nSi decides contactarme directamente a través de mi correo electrónico o redes sociales, tus datos serán utilizados única y exclusivamente para responder a tu consulta, y no serán compartidos con terceros ni incluidos en listas de marketing.\n\nPara el análisis de rendimiento técnico, el alojamiento de esta web (Vercel) recopila métricas básicas y anónimas de velocidad de carga sin identificar al usuario." },
        cookies: { title: "Política de Cookies", body: "Esta web utiliza las siguientes cookies:\n\n1. Cookies Técnicas (Estrictamente necesarias): Utilizadas para guardar tu preferencia de idioma (ES/EN/EU) y tu decisión sobre este mismo aviso de cookies. No requieren consentimiento.\n\n2. Cookies Analíticas : Solo si das tu consentimiento expreso en el banner inicial, se activarán las cookies. Utilizo una herramienta que analiza cómo interactúas con el portfolio (clics, scroll) de forma 100% anónima para ayudarme a mejorar la interfaz.\n\nPuedes revocar tu consentimiento en cualquier momento borrando las cookies de tu navegador." }
      }
    },
    en: {
      links: { legal: "Legal Notice", privacy: "Privacy", cookies: "Cookies" },
      modalContent: {
        legal: { title: "Legal Notice", body: "This website is the professional portfolio of Yeray Garrido. Its purpose is strictly informational and to showcase software development projects.\n\nAs a personal website that does not conduct direct e-commerce, access is public and free. Linked source codes belong to their respective GitHub repositories under their own licenses." },
        privacy: { title: "Privacy Policy", body: "I take your privacy seriously. This website does not include registration forms or user databases.\n\nIf you decide to contact me directly via email or social networks, your data will be used solely to respond to your inquiry and will not be shared with third parties or added to marketing lists.\n\nFor technical performance analysis, the hosting of this website (Vercel) collects basic, anonymous load speed metrics without identifying the user." },
        cookies: { title: "Cookie Policy", body: "This website uses the following cookies:\n\n1. Technical Cookies (Strictly necessary): Used to save your language preference (ES/EN/EU) and your decision regarding this cookie notice. They do not require consent.\n\n2. Analytical Cookies (Microsoft Clarity): Only if you give your express consent in the initial banner, Microsoft Clarity cookies will be activated. This tool generates heatmaps and analyzes how you interact with the portfolio completely anonymously to help me improve the UI.\n\nYou can revoke your consent at any time by clearing your browser cookies." }
      }
    },
    eu: {
      links: { legal: "Legezko Oharra", privacy: "Pribatutasuna", cookies: "Cookieak" },
      modalContent: {
        legal: { title: "Legezko Oharra", body: "Webgune hau Yeray Garridoren portfolio profesionala da. Helburua informazioa ematea eta software garapeneko proiektuak erakustea da.\n\nMerkataritza elektroniko zuzenik egiten ez duen webgune pertsonala denez, sarbidea publikoa eta doakoa da. Lotutako iturburu-kodeak GitHub-eko biltegienak dira, beren lizentziekin." },
        privacy: { title: "Pribatutasun Politika", body: "Zure pribatutasuna serio hartzen dut. Webgune honek ez du erregistro formulariorik edo erabiltzaileen datu-baserik.\n\nNirekin posta elektronikoz edo sare sozialen bidez harremanetan jartzea erabakitzen baduzu, tus data zure kontsultari erantzuteko soilik erabiliko dira, eta ez dira hirugarrenekin partekatuko.\n\nErrendimendu teknikoaren analisirako, webgune honen ostalariak (Vercel) karga-abiaduraren oinarrizko metrika anonimoak biltzen ditu." },
        cookies: { title: "Cookie Politika", body: "Webgune honek cookie hauek erabiltzen ditu:\n\n1. Cookie Teknikoak (Beharrezkoak): Zure hizkuntza hobespena eta cookie-en abisu honi buruzko erabakia gordetzeko. Ez dute baimenik behar.\n\n2. Cookie Analitikoak (Microsoft Clarity): Hasierako banner-ean baimen esplizitua ematen baduzu soilik aktibatuko dira. Tresna honek modu anonimoan aztertzen du portfolioarekin nola interakzionatzen duzun interfazea hobetzen laguntzeko.\n\nZure baimena edozein unetan ezezta dezakezu nabigatzaileko cookie-ak ezabatuz." }
      }
    }
  };

  const currentContent = legalContent[language as keyof typeof legalContent] || legalContent.es;

  return (
    <>
      <footer className="w-full py-8 px-6 md:px-12 border-t border-black/10 bg-white text-black relative z-10">
        <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center font-sans text-[10px] md:text-xs tracking-widest uppercase text-black/80 text-center gap-6 md:gap-0">
          
          <div className="flex-1 flex items-center justify-center md:justify-start gap-1 w-full">
            <span>{t('contact.footer.madeWith')}</span>
            <a href="https://github.com/Garridoparrayeray" target="_blank" rel="noreferrer" className="text-black hover:opacity-70 transition-opacity ml-1 font-bold cursor-pointer">
              Yeray Garrido
            </a>
          </div>
          
          <div className="flex-1 w-full text-center font-medium">
            {t('contact.footer.copyright', { year: new Date().getFullYear().toString() })}
          </div>

          <div className="flex-1 flex justify-center md:justify-end gap-4 md:gap-6 w-full">
            <button onClick={() => setActiveModal("legal")} className="cursor-pointer hover:opacity-60 font-bold transition-opacity">
              {currentContent.links.legal}
            </button>
            <button onClick={() => setActiveModal("privacy")} className="cursor-pointer hover:opacity-60 font-bold transition-opacity">
              {currentContent.links.privacy}
            </button>
            <button onClick={() => setActiveModal("cookies")} className="cursor-pointer hover:opacity-60 font-bold transition-opacity">
              {currentContent.links.cookies}
            </button>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-2xl max-h-[80vh] bg-white border border-black/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center p-6 border-b border-black/10">
              <h2 className="font-wide text-xl text-black font-bold">
                {currentContent.modalContent[activeModal].title}
              </h2>
              <button onClick={() => setActiveModal(null)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-black">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto modal-scroll" data-lenis-prevent="true">
              <p className="font-sans text-black/70 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium text-justify">
                {currentContent.modalContent[activeModal].body}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s ease-out forwards; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
      `}</style>
    </>
  );
}