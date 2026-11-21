import { Suspense, lazy } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import PortfolioMain from "./components/PortfolioMain";

const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((m) => ({ default: m.Analytics }))
);
const SpeedInsights = lazy(() =>
  import("@vercel/speed-insights/react").then((m) => ({ default: m.SpeedInsights }))
);
const CookieBanner = lazy(() => import("./components/Cookie-Banner"));

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioMain />
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
        <CookieBanner />
      </Suspense>
    </LanguageProvider>
  );
}
