// src/components/PhotosSection.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- 1. IMPORT HOOKS
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';
// Sanity's helper types may not be available at runtime in this project setup,
// so use a narrow local alias to avoid `any` while remaining flexible.
type SanityImageSource = unknown;

const builder = imageUrlBuilder(sanityClient);
type BuilderImageParam = Parameters<typeof builder.image>[0];
const urlFor = (source: SanityImageSource) => builder.image(source as BuilderImageParam);

// --- 2. ADD `slug` TO THE INTERFACE ---
interface Photo {
  _id: string;
  title: string;
  category: string;
  slug: {
    current: string;
  };
  image: {
    asset: {
      url: string;
    };
  };
}

const PhotosSection = () => {
  // --- Your original, working state remains the same ---
  const [, setPhotos] = useState<Photo[]>([]);
  const [groupedPhotos, setGroupedPhotos] = useState<{ [category: string]: Photo[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [animateImage, setAnimateImage] = useState(false);

  // --- 3. GET ROUTER FUNCTIONS ---
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // --- 4. UPDATE SANITY QUERY TO FETCH THE SLUG ---
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "photo"]{
          _id,
          title,
          slug, 
          category,
          image { asset -> { url } }
        }`
      )
      .then((data: unknown) => {
        const typed = data as Photo[];
        const grouped = typed.reduce((acc: { [category: string]: Photo[] }, photo: Photo) => {
          const key = photo.category || 'Uncategorized';
          if (!acc[key]) acc[key] = [];
          acc[key].push(photo);
          return acc;
        }, {} as { [category: string]: Photo[] });
        setPhotos(typed);
        setGroupedPhotos(grouped);
      })
      .catch((err) => console.error('Failed to fetch photos:', err));
  }, []);
  
  // URL-sync effect moved below after modal functions to ensure callbacks exist


  const openModal = useCallback((category: string, index: number, fromUrl = false) => {
    setSelectedCategory(category);
    setSelectedIndex(index);
    setTimeout(() => setAnimateImage(true), 300);
    
    // Only change the URL if this action wasn't triggered by a URL change itself.
    if (!fromUrl) {
      const photo = groupedPhotos[category]?.[index];
      if (photo) {
        navigate(`/photos/${photo.slug.current}`);
      }
    }
  }, [groupedPhotos, navigate]);

  const closeModal = useCallback((fromUrl = false) => {
    setAnimateImage(false);
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedIndex(0);
    }, 200);

    // Only change the URL if this action wasn't triggered by a URL change.
    if (!fromUrl) {
      navigate('/photos');
    }
  }, [navigate]);

  const handleNext = useCallback(() => {
    if (!selectedCategory) return;
    setAnimateImage(false);
    // This logic is safe and just updates the index
    const newIndex = (selectedIndex + 1) % groupedPhotos[selectedCategory].length;
    const nextPhoto = groupedPhotos[selectedCategory][newIndex];
    if (nextPhoto) {
      // Navigate to the next photo's URL, which will trigger the useEffect to update state
      navigate(`/photos/${nextPhoto.slug.current}`, { replace: true });
    }
  }, [selectedCategory, selectedIndex, groupedPhotos, navigate]);

  const handlePrev = useCallback(() => {
    if (!selectedCategory) return;
    setAnimateImage(false);
    const newIndex = (selectedIndex - 1 + groupedPhotos[selectedCategory].length) % groupedPhotos[selectedCategory].length;
    const prevPhoto = groupedPhotos[selectedCategory][newIndex];
    if (prevPhoto) {
      navigate(`/photos/${prevPhoto.slug.current}`, { replace: true });
    }
  }, [selectedCategory, selectedIndex, groupedPhotos, navigate]);

  // Keyboard navigation now uses the new URL-aware functions
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

  // Find the currently selected photo object for SEO tags and image display
  const selectedPhoto = selectedCategory ? groupedPhotos[selectedCategory]?.[selectedIndex] : null;

  // --- URL-sync effect: keep modal state and URL in sync ---
  useEffect(() => {
    if (slug && Object.keys(groupedPhotos).length > 0) {
      // Find the photo that matches the slug in the URL
      let foundCategory: string | undefined;
      let foundIndex: number = -1;
      for (const category in groupedPhotos) {
        const photoIndex = groupedPhotos[category].findIndex(p => p.slug.current === slug);
        if (photoIndex !== -1) {
          foundCategory = category;
          foundIndex = photoIndex;
          break;
        }
      }
      // If a photo is found, AND the modal isn't already open to it, update the state.
      if (foundCategory && (selectedCategory !== foundCategory || selectedIndex !== foundIndex)) {
        openModal(foundCategory, foundIndex, true); // `true` prevents a URL loop
      }
    } else if (!slug && selectedCategory) {
      // If the URL is cleared but the modal is open (e.g., browser back button), close it.
      closeModal(true); // `true` prevents a URL loop
    }
  }, [slug, groupedPhotos, openModal, closeModal, selectedCategory, selectedIndex]); // runs when URL or data changes

  return (
    <>
      {selectedPhoto ? (
        <>
          <title>{`${selectedPhoto.title} - Photo by Red Malanga`}</title>
          <meta name="description" content={`View the photo titled "${selectedPhoto.title}" from the creative portfolio of Red Malanga.`} />
          <link rel="canonical" href={`https://redmalanga.com/photos/${selectedPhoto.slug.current}`} />
        </>
      ) : (
        <>
          <title>Photography Portfolio - Red Malanga - Aaron ALAYO</title>
          <meta name="description" content="Explore a collection of high-quality photographs covering various subjects. View my complete photography portfolio." />
          <link rel="canonical" href="https://redmalanga.com/photos" />
        </>
      )}

      {/* --- YOUR ORIGINAL JSX IS COMPLETELY UNCHANGED --- */}
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
        {selectedCategory && selectedPhoto && (
          <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => closeModal()}>
            <button onClick={(e) => { e.stopPropagation(); closeModal(); }} className="fixed top-4 right-3 text-3xl text-black bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition" aria-label="Close">×</button>
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-black bg-white bg-opacity-70 h-10 flex items-center justify-center hover:bg-opacity-90 transition" aria-label="Previous">‹</button>
            <div className="relative flex items-center justify-center bg-white rounded-lg max-w-full w-[80vw]" style={{ maxHeight: '70vh', height: '70vh', overflowY: 'hidden' }}>
              <img
                key={selectedPhoto._id}
                src={urlFor(selectedPhoto.image).format('webp').url()}
                alt={selectedPhoto.title}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ease-out ${animateImage ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-black bg-white bg-opacity-70 h-10 flex items-center justify-center hover:bg-opacity-90 transition" aria-label="Next">›</button>
          </div>
        )}
      </section>
    </>
  );
};

export default PhotosSection;