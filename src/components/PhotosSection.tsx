import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';

type SanityImageSource = unknown;
const builder = imageUrlBuilder(sanityClient);
type BuilderImageParam = Parameters<typeof builder.image>[0];
const urlFor = (source: SanityImageSource) => builder.image(source as BuilderImageParam);

interface Photo {
  _id: string;
  title: string;
  categories: string[]; // Change this from 'category: string'
  slug: { current: string };
  image: { asset: { url: string } };
}

const ALL_CATEGORY = 'All';

const PhotosSection = () => {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [animateImage, setAnimateImage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // 1. Fetch Data
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "photo" && defined(slug.current)] | order(categories[0] asc) {
          _id,
          title,
          slug, 
          categories,
          image { asset -> { url } }
        }`
      )
      .then((data: Photo[]) => {
        setAllPhotos(data);
        setIsLoaded(true);
      })
      .catch((err) => console.error('Failed to fetch photos:', err));
  }, []);

  // 2. Derive Categories for the filter bar
  const categoryOptions = useMemo(() => {
    // Extract all categories from all photos and flatten them into one big list
    const allCategoryTags = allPhotos.flatMap(p => p.categories || ['Uncategorized']);
    // Remove duplicates
    return [ALL_CATEGORY, ...Array.from(new Set(allCategoryTags))].sort();
  }, [allPhotos]);

  // 3. Filter photos based on selection
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) {
      // Sort all photos by their first category so like-items are grouped together
      return [...allPhotos].sort((a, b) => {
        const catA = a.categories?.[0] || 'Uncategorized';
        const catB = b.categories?.[0] || 'Uncategorized';
        return catA.localeCompare(catB);
      });
    }
    
    // If a specific category is selected, just filter for it
    return allPhotos.filter(p => 
      (p.categories || ['Uncategorized']).includes(selectedCategory)
    );
  }, [allPhotos, selectedCategory]);
  // 4. Modal Handlers
  const openModal = useCallback((index: number, fromUrl = false) => {
    setSelectedIndex(index);
    setTimeout(() => setAnimateImage(true), 50);
    
    if (!fromUrl) {
      const photo = filteredPhotos[index];
      if (photo) navigate(`/photos/${photo.slug.current}`);
    }
  }, [filteredPhotos, navigate]);

  const closeModal = useCallback((fromUrl = false) => {
    setAnimateImage(false);
    setTimeout(() => {
      // We don't null the category here because we want to stay in the filtered view
      setSelectedIndex(0);
    }, 200);
    if (!fromUrl) navigate('/photos');
  }, [navigate]);

  const handleNext = useCallback(() => {
    const newIndex = (selectedIndex + 1) % filteredPhotos.length;
    navigate(`/photos/${filteredPhotos[newIndex].slug.current}`, { replace: true });
  }, [selectedIndex, filteredPhotos, navigate]);

  const handlePrev = useCallback(() => {
    const newIndex = (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    navigate(`/photos/${filteredPhotos[newIndex].slug.current}`, { replace: true });
  }, [selectedIndex, filteredPhotos, navigate]);

  // 5. URL Sync: This opens the modal AND sets the correct category filter automatically
  useEffect(() => {
    if (isLoaded && slug) {
      const photo = allPhotos.find(p => p.slug.current === slug);
      if (photo) {
        const photoCategories = photo.categories || ['Uncategorized'];
        
        // If the currently selected category isn't one of this photo's categories,
        // switch to the photo's first category so the Next/Prev buttons work.
        if (!photoCategories.includes(selectedCategory) && selectedCategory !== ALL_CATEGORY) {
          setSelectedCategory(photoCategories[0]);
        }
  
        // Re-calculate index based on the (potentially updated) filtered list
        const indexInFiltered = allPhotos
          .filter(p => selectedCategory === ALL_CATEGORY || (p.categories || ['Uncategorized']).includes(selectedCategory))
          .findIndex(p => p.slug.current === slug);
  
        setSelectedIndex(indexInFiltered);
        setAnimateImage(true);
      }
    }
  }, [slug, isLoaded, allPhotos, selectedCategory]);
  // 6. Keyboard Events
  useEffect(() => {
    const isModalOpen = !!slug;
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slug, handleNext, handlePrev, closeModal]);

  const selectedPhoto = slug ? filteredPhotos[selectedIndex] : null;

  return (
    <>
      <section className="min-h-screen bg-white px-4 py-20 flex flex-col w-full">
        <h2 className="font-veep text-2xl mb-12 text-center uppercase tracking-tight text-black-900">
          PHOTOGRAPHY
        </h2>

        {/* --- Category Filter Bar --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border text-xs uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black/20 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Unified Grid (No internal category titles) --- */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo._id}
                onClick={() => openModal(index)}
                className="group cursor-pointer bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={urlFor(photo.image).width(600).height(400).format('webp').url()}
                    alt={photo.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

{/* --- Modal --- */}
{selectedPhoto && (
  <div 
    className="fixed inset-0 bg-white/98 backdrop-blur-md flex flex-col items-center justify-center z-[1000] p-4" 
    onClick={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}
  >
    {/* 1. TOP BAR (Close Button area) */}
    <div className="w-full h-16 flex justify-end items-center px-2 shrink-0">
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          closeModal(); 
        }}
        className="text-4xl text-black hover:rotate-90 transition-transform cursor-pointer p-2 leading-none z-[1020]"
        aria-label="Close"
      >
        ×
      </button>
    </div>
    
    {/* 2. MAIN AREA (Image) */}
    <div className="relative flex-1 flex items-center justify-center w-full min-h-0 pointer-events-none px-2 sm:px-12">
      <img
        key={selectedPhoto.slug.current}
        src={urlFor(selectedPhoto.image).width(1600).format('webp').url()}
        alt={selectedPhoto.title}
        // max-h-full ensures it never exceeds the area between the Close bar and Title bar
        className={`max-w-full max-h-full object-contain shadow-2xl transition-all duration-500 pointer-events-auto ${
          animateImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    {/* 3. BOTTOM BAR (Controls & Title) */}
    <div className="w-full max-w-5xl h-24 flex items-center justify-between px-4 shrink-0 pointer-events-auto">
      
      {/* Previous Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
        className="text-4xl sm:text-5xl text-black hover:scale-125 transition-transform cursor-pointer p-4"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Title */}
      <div className="flex flex-col items-center">
         <p className="font-veep uppercase tracking-[0.2em] text-[10px] sm:text-xs text-black text-center px-4">
          {selectedPhoto.title}
        </p>
      </div>

      {/* Next Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleNext(); }} 
        className="text-4xl sm:text-5xl text-black hover:scale-125 transition-transform cursor-pointer p-4"
        aria-label="Next"
      >
        ›
      </button>
      
    </div>
  </div>
)}
      </section>
    </>
  );
};

export default PhotosSection;