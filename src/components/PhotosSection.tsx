import { useEffect, useState, useCallback } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';

// --- (Your existing helper functions remain the same) ---
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

interface Photo {
  _id: string;
  title: string;
  category: string;
  image: {
    asset: {
      url: string;
    };
  };
}

const PhotosSection = () => {
  // --- (All your existing state and hooks remain the same) ---
  const [, setPhotos] = useState<Photo[]>([]);
  const [groupedPhotos, setGroupedPhotos] = useState<{ [category: string]: Photo[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [animateImage, setAnimateImage] = useState(false);

  // --- (Your useEffect for fetching data remains the same) ---
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "photo"]{
          _id,
          title,
          category,
          image {
            asset -> {
              url
            }
          }
        }`
      )
      .then((data: Photo[]) => {
        const grouped = data.reduce((acc, photo) => {
          const key = photo.category || 'Uncategorized';
          if (!acc[key]) acc[key] = [];
          acc[key].push(photo);
          return acc;
        }, {} as { [category: string]: Photo[] });

        setPhotos(data);
        setGroupedPhotos(grouped);
      });
  }, []);

  // --- (All your event handlers like openModal, closeModal, etc., remain the same) ---
  const openModal = (category: string, index: number) => {
    setSelectedCategory(category);
    setSelectedIndex(index);
    setTimeout(() => setAnimateImage(true), 300);
  };

  const closeModal = () => {
    setAnimateImage(false);
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedIndex(0);
    }, 200);
  };

  const handleNext = useCallback(() => {
    if (!selectedCategory) return;
    setAnimateImage(false);
    setSelectedIndex((prev) => (prev + 1) % groupedPhotos[selectedCategory].length);
    requestAnimationFrame(() => setAnimateImage(true));
  }, [selectedCategory, groupedPhotos]);

  const handlePrev = useCallback(() => {
    if (!selectedCategory) return;
    setAnimateImage(false);
    setSelectedIndex((prev) => (prev - 1 + groupedPhotos[selectedCategory].length) % groupedPhotos[selectedCategory].length);
    requestAnimationFrame(() => setAnimateImage(true));
  }, [selectedCategory, groupedPhotos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCategory) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory, handleNext, handlePrev, closeModal]);


  return (
    // A React Fragment (<>) is used to wrap everything
    <>
      {/* 
        React 19 SEO Tags: 
        This is the new, built-in way to add SEO metadata. 
        No external libraries like Helmet are needed.
      */}
      <title>Photography Portfolio - Red Malanga - Aaron ALAYO</title>
      <meta 
        name="description" 
        content="Explore a collection of high-quality photographs covering various subjects. View my complete photography portfolio." 
      />
      <link rel="canonical" href="https://redmalanga.com/photos" />

      {/* --- Your original component JSX starts here, completely unchanged --- */}
      <section className="min-h-screen bg-white px-4 py-20 flex flex-col z-10 w-full">
        <h2 className="font-veep text-2xl mb-16 text-center uppercase tracking-tight text-black-900">
          PHOTOGRAPHY
        </h2>

        {Object.entries(groupedPhotos).map(([category, photos]) => (
          <div key={category}>
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold uppercase font-veep mb-6 mt-6">{category}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
                {photos.map((photo, index) => (
                  <div
                    key={photo._id}
                    onClick={() => openModal(category, index)}
                    className="cursor-pointer bg-white rounded shadow overflow-hidden transition-transform duration-300"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={urlFor(photo.image).width(600).height(400).format('webp').url()}
                        alt={photo.title}
                        className="w-full h-[220px] object-cover transform transition-transform duration-300 hover:scale-110"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {selectedCategory && (
          <div
            className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeModal(); }}
              className="fixed top-4 right-3 text-3xl text-black bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition"
              aria-label="Close"
            >
              ×
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-black bg-white bg-opacity-70 h-10 flex items-center justify-center hover:bg-opacity-90 transition"
              aria-label="Previous"
            >
              ‹
            </button>
            <div
              className="relative flex items-center justify-center bg-white rounded-lg max-w-full w-[80vw]"
              style={{ maxHeight: '70vh', height: '70vh', overflowY: 'hidden' }}
            >
              <img
                key={groupedPhotos[selectedCategory][selectedIndex]._id}
                src={urlFor(groupedPhotos[selectedCategory][selectedIndex].image).format('webp').url()}
                alt={groupedPhotos[selectedCategory][selectedIndex].title}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ease-out ${animateImage ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-black bg-white bg-opacity-70 h-10 flex items-center justify-center hover:bg-opacity-90 transition"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default PhotosSection;