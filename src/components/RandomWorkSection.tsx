import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

// --- (Your StarLoader component remains the same) ---
const StarLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <svg
      style={{
        animation: "spin 3s linear infinite",
      }}
      className="text-white"
      viewBox="0 0 24 24"
      width={80}
      height={80}
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);


const RandomWorkSection = () => {
  // --- (Your state and useEffect hooks remain the same) ---
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
      .then((data: Video[]) => {
        if (data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)];
          setRandomVideo(random);
        } else {
          // If no videos, stop loading to prevent infinite loader
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false); // Stop loading on error
      });
  }, []);

  return (
    // A React Fragment (<>) wraps your original JSX and the new SEO tags
    <>
      {/* 
        React 19 SEO Tags for the HOMEPAGE: 
        This is the most important set of tags for your entire site.
      */}
      <title>Red Malanga - Aaron ALAYO</title>
      <meta 
        name="description" 
        content="Welcome to the creative portfolio of Aaron ALAYO. Explore a curated collection of professional work in photography, video production, and software development." 
      />
      <link rel="canonical" href="https://redmalanga.com/" />

      {/* --- Your original component JSX starts here, completely unchanged --- */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <StarLoader />
          </div>
        )}

        {/* Video */}
        {randomVideo && (
          <div className="absolute inset-0 w-full h-full">
            <iframe
              src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1&quality=1080p`}
              title={randomVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              onLoad={() => setLoading(false)}
              className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ border: 'none' }}
            />
          </div>
        )}

        {/* Fallback for when there's no video and loading is done */}
        {!loading && !randomVideo && (
          <div className="flex flex-col items-center justify-center w-full h-full text-white text-center p-4">
             <h1 className="text-3xl font-bold">Welcome to My Portfolio</h1>
             <p className="mt-2 text-lg text-gray-300">Content is being updated. Please explore the other sections.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default RandomWorkSection;