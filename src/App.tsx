import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideosSection from './components/VideosSection';
import PhotosSection from './components/PhotosSection';
import DeveloperWorkSection from './components/DeveloperWorkSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Menu from './components/Menu';
import Footer from './components/Footer';
import RandomWorkSection from './components/RandomWorkSection';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Menu />

        {/* Main content fills space and centers content */}
        <main className="flex-grow flex">

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

        <Footer />
      </div>
    </Router>
  );
}

export default App;
