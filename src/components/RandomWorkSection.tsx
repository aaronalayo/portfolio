import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

// Loader component: White spinning star
const StarLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <svg
      style={{
        animation: "spin 3s linear infinite", // 3 seconds per full turn
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

    {/* Spin keyframes */}
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
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
      .then((data: Video[]) => {
        if (data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)];
          setRandomVideo(random);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black">
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
            src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1`}
            title={randomVideo.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
            className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ border: 'none' }}
          />
        </div>
      )}
    </section>
  );
};

export default RandomWorkSection;
