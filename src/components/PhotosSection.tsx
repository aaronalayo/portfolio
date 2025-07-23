import { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

interface Photo {
  _id: string;
  title: string;
  image: {
    asset: {
      url: string;
    };
  };
}

const PhotosSection = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "photo"]{
          _id,
          title,
          image {
            asset -> {
              url
            }
          }
        }`
      )
      .then((data: Photo[]) => setPhotos(data))
      .catch((err) => console.error('Error fetching photos:', err));
  }, []);

  return (
    <section className="min-h-screen bg-white px-4 py-20 flex flex-col items-center z-10">
      <h2 className="text-5xl font-extrabold mb-16 text-center uppercase tracking-tight text-blue-900 drop-shadow-sm">
        PHOTOS
      </h2>

      {/* Responsive flex layout with spacing */}
      <style>{`
        .photo-item {
          flex: 0 0 calc((100% / 5) - 16px);
          margin: 8px;
        }

        @media (max-width: 1280px) {
          .photo-item {
            flex: 0 0 calc((100% / 4) - 16px);
          }
        }

        @media (max-width: 768px) {
          .photo-item {
            flex: 0 0 calc((100% / 2) - 16px);
          }
        }

        @media (max-width: 480px) {
          .photo-item {
            flex: 0 0 100%;
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="flex flex-wrap justify-center w-full max-w-7xl">
        {photos.map((photo) => (
          <div
            key={photo._id}
            onClick={() => setSelectedPhoto(photo)}
            className="photo-item cursor-pointer bg-white rounded-lg shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src={urlFor(photo.image).width(400).height(200).url()}
              alt={photo.title}
              className="w-full h-[200px] object-contain bg-gray-100"
              loading="lazy"
            />
            <h3 className="text-sm text-blue-900 font-semibold text-center p-1 truncate">
              {photo.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            aria-label="Close"
            className="absolute top-6 right-6 text-white text-5xl font-bold z-50 cursor-pointer hover:scale-110 transition-transform"
            style={{ background: 'transparent', border: 'none' }}
          >
            &times;
          </button>

          <img
            src={selectedPhoto.image.asset.url}
            alt={selectedPhoto.title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
};

export default PhotosSection;
