import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import i18n from "./i18n";
import HomePage from "./pages/home/HomePage";
import SubscriptionsPage from "./pages/subscriptions/SubscriptionsPage";
import Register from "./components/auth/register/Register";
import Login from "./components/auth/login/Login";

function LanguageWrapper({ children }) {
  const { lang } = useParams();

  useEffect(() => {
    if (lang === "fr" || lang === "en") i18n.changeLanguage(lang);
  }, [lang]);

  return children;
}

function App() {
  return (
    <>
      <Helmet>
        <html lang="fr" />
        <title>Bonemia | Abonnements premium pour moins cher</title>
        <meta name="description" content="Accédez à Canva, Netflix, Spotify, ChatGPT et d'autres abonnements premium à prix réduit avec Bonemia." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Routes>
        <Route path="/" element={<Navigate to="/fr" replace />} />
        <Route path="/:lang" element={<LanguageWrapper><HomePage /></LanguageWrapper>} />
        <Route path="/:lang/abonnements" element={<LanguageWrapper><SubscriptionsPage /></LanguageWrapper>} />
        <Route path="/:lang/auth/register" element={<LanguageWrapper><Register /></LanguageWrapper>} />
        <Route path="/:lang/auth/login" element={<LanguageWrapper><Login /></LanguageWrapper>} />
        <Route path="*" element={<Navigate to="/fr" replace />} />
      </Routes>
    </>
  );
}

export default App;