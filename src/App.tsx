// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// --- Your Component Imports ---
import VideosSection from './components/VideosSection';
import PhotosSection from './components/PhotosSection';
import RandomWorkSection from './components/RandomWorkSection';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutSection from './components/AboutSection';
import DeveloperWorkSection from './components/DeveloperWorkSection';
import ContactSection from './components/ContactSection';
import ModernCookieBanner from './components/ModernCookieBanner';

// --- Analytics Helper Section ---
const TRACKING_ID = "G-D9S582M60D"; // Your actual Measurement ID

const initializeAnalytics = () => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(TRACKING_ID);
    console.log("Analytics Initialized after consent.");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
  }
};

const RouteChangeTracker = () => {
  const location = useLocation();
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (process.env.NODE_ENV === 'production' && consent === 'granted') {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);
  return null;
};

function App() {
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'granted') {
      initializeAnalytics();
    }
  }, []);
  
  const MainContent = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const mainContentClass = `flex-grow flex ${isHomePage ? '' : 'pt-20'}`;

    return (
      <main className={mainContentClass}>
        <div className="w-full bg-white rounded-2xl shadow-xl">
          <Routes>
            <Route path="/" element={<RandomWorkSection />} />
            <Route path="/videos" element={<VideosSection />} />
            <Route path="/photos" element={<PhotosSection />} />
            <Route path="/developer" element={<DeveloperWorkSection />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/contact" element={<ContactSection />} />
          </Routes>
        </div>
      </main>
    );
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY || ''} scriptProps={{ async: true, defer: true, appendTo: 'head', nonce: undefined }}>
      <Router>
        <RouteChangeTracker />
        <div className="flex flex-col min-h-screen">
          <Header />
          <MainContent />
          <Footer />
        </div>
        <ModernCookieBanner onAccept={initializeAnalytics} />
      </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;