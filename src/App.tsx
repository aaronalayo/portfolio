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
      <Menu />
      <main className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-xl mt-16 mb-12">
        <Routes>
          <Route path="/videos" element={<VideosSection />} />
          <Route path="/photos" element={<PhotosSection />} />
          <Route path="/developer" element={<DeveloperWorkSection />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactSection />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
