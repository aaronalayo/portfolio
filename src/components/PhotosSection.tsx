import { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';

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
  const [, setPhotos] = useState<Photo[]>([]);
  const [groupedPhotos, setGroupedPhotos] = useState<{ [category: string]: Photo[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

  const openModal = (category: string, index: number) => {
    setSelectedCategory(category);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setSelectedIndex(0);
  };

  const handleNext = () => {
    if (!selectedCategory) return;
    setSelectedIndex((prev) => (prev + 1) % groupedPhotos[selectedCategory].length);
  };

  const handlePrev = () => {
    if (!selectedCategory) return;
    setSelectedIndex((prev) => (prev - 1 + groupedPhotos[selectedCategory].length) % groupedPhotos[selectedCategory].length);
  };

  return (
    <section className="min-h-screen bg-white px-4 py-20 flex flex-col z-10 w-full">
      <h2 className="font-veep font-bold text-2xl mb-16 text-center uppercase tracking-tight text-black-900">
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
                      src={urlFor(photo.image).width(600).height(400).url()}
                      alt={photo.title}
                      className="w-full h-[420px] object-cover transform transition-transform duration-300 hover:scale-110"
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
          className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '10px',
              maxWidth: '100vw',
              maxHeight: '90vh',
              width: '90vw',
              height: '80vh',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '-65px',
                right: '10px',
                fontSize: '2rem',
                fontWeight: 300,
                color: 'black',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
              }}
              aria-label="Close"
            >
              ×
            </button>

            {/* Previous button */}
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                fontSize: '2rem',
                fontWeight: 200,
                color: 'black',
                zIndex: 50,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                padding: '0.2rem',
                border: 'none',
              }}
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Image */}
            <img
              src={groupedPhotos[selectedCategory][selectedIndex].image.asset.url}
              alt={groupedPhotos[selectedCategory][selectedIndex].title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next button */}
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '0',
                transform: 'translateY(-50%)',
                fontSize: '2rem',
                fontWeight: 200,
                color: 'black',
                zIndex: 50,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                padding: '0.2rem',
                border: 'none',
              }}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotosSection;
