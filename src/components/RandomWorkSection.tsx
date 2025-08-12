import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

const RandomWorkSection = () => {
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);

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
      {randomVideo ? (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1`}
            title={randomVideo.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ border: 'none' }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 pt-10">Loading video...</p>
      )}
    </section>
  );
};

export default RandomWorkSection;
