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
    <section className="w-full wh-screen overflow-hidden m-0 p-0">
      {randomVideo ? (
        <div className="w-full h-full aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1`}
            title={randomVideo.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-none"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 pt-10">Loading video...</p>
      )}
    </section>
  );
};

export default RandomWorkSection;
