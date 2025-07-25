import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideosSection from './components/VideosSection';
import PhotosSection from './components/PhotosSection';
import DeveloperWorkSection from './components/DeveloperWorkSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Menu from './components/Menu';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Menu />

        {/* Main content fills space and centers content */}
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-3xl px-6 py-12 bg-white rounded-2xl shadow-xl mt-10 mb-10">
            <Routes>
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
