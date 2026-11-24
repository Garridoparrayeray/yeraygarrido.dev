import { Suspense, lazy } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import PortfolioMain from "./components/PortfolioMain";

const NotFound = lazy(() => import("./components/NotFound"));
const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((m) => ({ default: m.Analytics }))
);
const SpeedInsights = lazy(() =>
  import("@vercel/speed-insights/react").then((m) => ({ default: m.SpeedInsights }))
);
const CookieBanner = lazy(() => import("./components/Cookie-Banner"));

function isNotFoundRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path !== "/" && path !== "/index.html" && path !== "";
}

export default function App() {
  const is404 = isNotFoundRoute();

  return (
    <LanguageProvider>
      {is404 ? (
        <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
          <NotFound />
        </Suspense>
      ) : (
        <PortfolioMain />
      )}
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
        <CookieBanner />
      </Suspense>
    </LanguageProvider>
  );
}
