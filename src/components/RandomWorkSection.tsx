// src/components/RandomWorkSection.tsx
import { useEffect, useState, useRef } from 'react';
import sanityClient from '../sanityClient';
import Player from '@vimeo/player';

// --- (Your icons and other components remain the same) ---
const UnmutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path></svg> );
const MutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2"></path></svg> );
interface Video { _id: string; title: string; vimeoId: string; }
const StarLoader = () => ( <div className="flex items-center justify-center w-full h-full"><svg style={{ animation: "spin 3s linear infinite" }} className="text-white" viewBox="0 0 24 24" width={80} height={80} fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg><style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style></div> );

const RandomWorkSection = () => {
  const [randomVideo, setRandomVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  // ... (Your useEffect for fetching data and the toggleMute function remain the same) ...

  return (
    <>
      <title>Red Malanga - Aaron ALAYO - Creative Portfolio</title>
      <meta name="description" content="Welcome to the creative portfolio of Aaron Alayo. Explore a curated collection of professional work in photography, video production, and software development." />
      <link rel="canonical" href="https://redmalanga.com/" />

      <section className="relative w-full h-screen overflow-hidden bg-black">
        {loading && ( <div className="absolute inset-0 flex items-center justify-center z-30 bg-black"><StarLoader /></div> )}
        
        {randomVideo && ( 
          <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
            <iframe 
              ref={iframeRef} 
              // --- UPDATED URL for better performance and privacy ---
              src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&controls=0&quality=1080p&autopause=0&loop=1&transparent=0&dnt=1`}
              title={randomVideo.title} 
              
              // --- ADDED ATTRIBUTES for mobile compatibility ---
              allow="autoplay; fullscreen"
              allowFullScreen
              // This is the key for preventing fullscreen takeover on iOS
              playsInline 
              
              onLoad={() => setLoading(false)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[168.75vw] min-h-screen md:w-[177.77vh] md:h-[100vh] min-w-full"
              style={{ border: 'none' }} 
            />
          </div> 
        )}
        
        {/* --- Text is now inside a separate container for z-index safety --- */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="flex flex-col items-center justify-start h-full pt-24 md:pt-32 text-center text-white p-4">
            <h1 className="font-veep text-3xl md:text-4xl uppercase tracking-wider drop-shadow-xl">
              Red Malanga
            </h1>
          </div>
        </div>

        {/* --- Mute button is also in a separate container --- */}
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