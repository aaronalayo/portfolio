// src/App.tsx

// --- React and Router Imports ---
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// --- Visitor Tracking (Google Analytics) Import ---
import ReactGA from 'react-ga4';

// --- Your Component Imports ---
import VideosSection from './components/VideosSection';
import PhotosSection from './components/PhotosSection';
import DeveloperWorkSection from './components/DeveloperWorkSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Menu from './components/Menu';
import Footer from './components/Footer';
import RandomWorkSection from './components/RandomWorkSection';
import HomeButton from './components/HomeButton';

// --- Analytics Helper Section ---
// NOTE: Replace with your actual Google Analytics Measurement ID
const TRACKING_ID = "G-M4HY1PVYZ9"; 

// Initialize Google Analytics only in the production environment
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(TRACKING_ID);
  console.log("Google Analytics Initialized"); // Optional: for debugging
}

// This component tracks page views whenever the route changes
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only send data in production
    if (process.env.NODE_ENV === 'production') {
      // Send a pageview event to Google Analytics
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]); // This effect runs every time the location changes

  return null; // This component doesn't render any visible UI
};


function App() {
  return (
    // The <HelmetProvider> is removed because React 19 handles SEO tags natively
    <Router>
      {/* This component will now track all route changes for Google Analytics */}
      <RouteChangeTracker /> 
      
      <div className="flex flex-col min-h-screen">
        <Menu />
        <main className="flex-grow flex">
          <div className="w-full bg-white rounded-2xl shadow-xl">
            <HomeButton />
            <Routes>
              {/* Each of these components should now contain its own <title> and <meta> tags */}
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
    </Router>
  );
}

export default App;