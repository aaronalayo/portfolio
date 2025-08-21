// src/components/RandomWorkSection.tsx
import { useEffect, useState, useRef } from 'react';
import sanityClient from '../sanityClient';
import Player from '@vimeo/player';

// --- Icon Components ---
const UnmutedIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path>
  </svg>
);
const MutedIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2"></path>
  </svg>
);

// --- Interface for our video data ---
interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

// --- Loading animation component ---
const StarLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <svg style={{ animation: "spin 3s linear infinite" }} className="text-white" viewBox="0 0 24 24" width={80} height={80} fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// --- Main Homepage Component ---
const RandomWorkSection = () => {
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const query = `*[_type == "video" && excludeFromHomepage != true]{ _id, title, vimeoId }`;
    sanityClient.fetch(query)
      .then((eligibleVideos: Video[]) => {
        if (eligibleVideos.length > 0) {
          const random = eligibleVideos[Math.floor(Math.random() * eligibleVideos.length)];
          setRandomVideo(random);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch videos from Sanity:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      playerRef.current = new Player(iframeRef.current);
    }
  }, [randomVideo]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (playerRef.current) {
      playerRef.current.setVolume(newMutedState ? 0 : 1);
    }
  };

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
          <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
            <iframe
              {...{ // Using the `as any` assertion to bypass the TypeScript error for playsInline
                ref: iframeRef,
                src: `https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&controls=0&quality=720p&autopause=0&loop=1&transparent=0&dnt=1`,
                title: randomVideo.title,
                allow: "autoplay; fullscreen",
                allowFullScreen: true,
                playsInline: true,
                onLoad: () => setLoading(false),
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[168.75vw] min-h-screen md:w-[177.77vh] md:h-[100vh] min-w-full",
                style: { border: 'none' }
              } as any}
            />
          </div>
        )}
        

        {/* Mute/Unmute Button Container */}
        <div className="absolute inset-0 z-20">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-5 right-5 text-white opacity-60 hover:opacity-100 transition"
          >
            {isMuted ? <MutedIcon /> : <UnmutedIcon />}
          </button>
        </div>
      </section>
    </>
  );
};

export default RandomWorkSection;