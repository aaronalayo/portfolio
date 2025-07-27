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
      <h2 className="text-5xl font-extrabold mb-16 text-center uppercase tracking-tight text-black-900">
        PHOTOS
      </h2>

      {Object.entries(groupedPhotos).map(([category, photos]) => (
        <div key={category} >
          <div className="max-w-7xl mx-auto px-4">
                      <h3 className="text-2xl font-bold text-black-800 uppercase">{category}</h3>

            <div className="flex flex-wrap justify-start gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo._id}
                  onClick={() => openModal(category, index)}
                  className="sm:w-[48%] md:w-[30%] cursor-pointer bg-white rounded shadow overflow-hidden hover:scale-105 transition-transform"
                >
                  <img
                    src={urlFor(photo.image).width(600).height(400).url()}
                    alt={photo.title}
                    style={{ gap: '12px', margin: '10px' }} className="w-full h-[220px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      ))}


      {/* Modal */}
   {selectedCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeModal}
        >
          {/* Placeholder Container */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)', // Gray background
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed', // Use fixed positioning to ensure it's relative to the viewport
              top: '50%', // Center vertically
              left: '50%', // Center horizontally
              transform: 'translate(-50%, -50%)', // Adjust for the container's dimensions
              borderRadius: '10px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: '80vw',
              height: '80vh',
            }}
  
          >
            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                fontSize: '4rem', // Thinner button
                fontFamily: 'Roboto, Arial, sans-serif', 
                fontWeight: 100, // Use Helvetica font
                color: 'white',
                zIndex: 50,
                cursor: 'pointer',
                backgroundColor: 'rgba(71, 68, 68, 0.7)', // Gray background
                borderRadius: 'none', // Circular shape
                padding: '0.5rem', // Space inside the button
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

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                position: 'absolute',
                top: '50%',
                right: '0',
                transform: 'translateY(-50%)',
                fontSize: '4rem', // Thinner button
                fontFamily: 'Roboto, Arial, sans-serif', // Use Helvetica font
                color: 'white',
                zIndex: 50,
                cursor: 'pointer',
                backgroundColor: 'rgba(71, 68, 68, 0.7)', // Gray background
                borderRadius: 'none', // Circular shape
                padding: '0.5rem', // Space inside the button
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
