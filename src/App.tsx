// src/App.tsx

// --- React and Router Imports ---
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// --- Visitor Tracking (Google Analytics) Import ---
import ReactGA from 'react-ga4';

// --- Your Component Imports ---
import VideosSection from './components/VideosSection';
import PhotosSection from './components/PhotosSection';
// ... other component imports
import RandomWorkSection from './components/RandomWorkSection';
import Menu from './components/Menu';
import Footer from './components/Footer';
import HomeButton from './components/HomeButton';
import AboutSection from './components/AboutSection';
import DeveloperWorkSection from './components/DeveloperWorkSection';
import ContactSection from './components/ContactSection';
// --- Import the new Cookie Consent Banner ---
import ModernCookieBanner from './components/ModernCookieBanner';


// --- Analytics Helper Section ---
const TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your real Measurement ID

// IMPORTANT: We REMOVE the automatic initialization from here.
// We create a function to initialize it on demand.
const initializeAnalytics = () => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(TRACKING_ID);
    console.log("Analytics Initialized after consent.");
    // Optionally, send the first pageview right after initialization
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
  }
};


// This component now tracks page views ONLY IF consent has been granted
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
  // Remove unwanted UTM parameters from the URL on first load
  useEffect(() => {
    const url = new URL(window.location.href);
    let changed = false;

    // Loop through query parameters and delete UTM ones
    url.searchParams.forEach((key) => {
      if (key.toLowerCase().startsWith("utm_")) {
        url.searchParams.delete(key);
        changed = true;
      }
    });

    // Update the URL without reloading the page
    if (changed) {
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, []);

  // This effect checks on app load if consent was *already* given in a previous session.
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'granted') {
      initializeAnalytics();
    }
  }, []);

  return (
    <Router>
      <RouteChangeTracker />
      <div className="flex flex-col min-h-screen">
        <Menu />
        <main className="flex-grow flex">
          <div className="w-full bg-white rounded-2xl shadow-xl">
            <HomeButton />
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
        <Footer />
      </div>
      <ModernCookieBanner onAccept={initializeAnalytics} />
    </Router>
  );
}
export default App;