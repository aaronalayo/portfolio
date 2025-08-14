// src/components/RandomWorkSection.tsx
import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Video { _id: string; title: string; vimeoId: string; }

const StarLoader = () => (
    <div className="flex items-center justify-center w-full h-full">
      <svg style={{ animation: "spin 3s linear infinite" }} className="text-white" viewBox="0 0 24 24" width={80} height={80} fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
);

const RandomWorkSection = () => {
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
      .then((data: Video[]) => {
        if (data.length > 0) {
          setRandomVideo(data[Math.floor(Math.random() * data.length)]);
        } else { setLoading(false); }
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <>
      <title>Red Malanga - Aaron ALAYO - Creative Portfolio</title>
      <meta name="description" content="Welcome to the creative portfolio of Aaron Alayo. Explore a curated collection of professional work in photography, video production, and software development." />
      <link rel="canonical" href="https://redmalanga.com/" />

      <section className="relative w-full h-screen overflow-hidden bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black">
            <StarLoader />
          </div>
        )}

        {randomVideo && (
          <div className="absolute inset-0 w-full h-full z-10">
            <iframe
              src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1&quality=1080p`}
              title={randomVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              onLoad={() => setLoading(false)}
              className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
              style={{ border: 'none' }}
            />
          </div>
        )}
        
        {/* 
          --- THE NEW LAYOUT FIX ---
          This container is now positioned in the top-left to align with the Menu star.
        */}
        <div className="absolute top-4 left-20 z-20 flex items-center h-12">
          <h1 className="font-veep font-bold text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-lg">
            Welcome
          </h1>
        </div>

        {/* 
          The hidden sr-only paragraph is no longer necessary with this design, 
          as the page title and meta description handle the SEO keywords effectively.
          This keeps the component cleaner.
        */}

      </section>
    </>
  );
};

export default RandomWorkSection;