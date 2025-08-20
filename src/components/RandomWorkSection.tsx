
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
    // This efficient query filters the videos directly in Sanity
    const query = `*[_type == "video" && excludeFromHomepage != true]{ _id, title, vimeoId }`;

    sanityClient.fetch(query)
      .then((eligibleVideos: Video[]) => {
        if (eligibleVideos.length > 0) {
          const random = eligibleVideos[Math.floor(Math.random() * eligibleVideos.length)];
          setRandomVideo(random);
        } else {
          // If no videos are eligible, stop the loading animation
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch videos from Sanity:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Initialize the Vimeo Player API when the iframe is ready
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
      {/* SEO Metadata for the Homepage */}
      <title>Red Malanga - Aaron ALAYO - Creative Portfolio</title>
      <meta name="description" content="Welcome to the creative portfolio of Aaron Alayo. Explore a curated collection of professional work in photography, video production, and software development." />
      <link rel="canonical" href="https://redmalanga.com/" />

      {/* Main container for the full-screen section */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black">
            <StarLoader />
          </div>
        )}
        
        {/* Video Player */}
        {randomVideo && (
          // This parent container acts as the "window" for the massive iframe
          <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
            <iframe
              ref={iframeRef}
              src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&controls=0&quality=1080p&autopause=0&loop=1`}
              title={randomVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              onLoad={() => setLoading(false)}
              // These robust classes make the iframe massive and centered to create the "cover" effect
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[180vw] min-h-screen md:w-[177.77vh] md:h-[100vh] min-w-full"
              style={{ border: 'none' }}
            />
          </div>
        )}
        
        {/* Text Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-24 md:pt-32 text-center text-white p-4 pointer-events-none">
          <h1 className="font-veep text-4xl md:text-6xl uppercase tracking-wider drop-shadow-xl">
            Aaron Alayo
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-xl">
            Videography, Photography & Web Development
          </p>
        </div>

        {/* Mute/Unmute Button */}
        <div className="absolute bottom-5 right-5 z-20">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="text-white opacity-60 hover:opacity-100 transition"
          >
            {isMuted ? <MutedIcon /> : <UnmutedIcon />}
          </button>
        </div>
      </section>
    </>
  );
};

export default RandomWorkSection;


// The version you can revert to AFTER Google updates its search result

// import { useEffect, useState, useRef } from 'react';
// import sanityClient from '../sanityClient';
// import Player from '@vimeo/player';

// const UnmutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path></svg> );
// const MutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2"></path></svg> );
// interface Video { _id: string; title: string; vimeoId: string; }
// const StarLoader = () => ( <div className="flex items-center justify-center w-full h-full"><svg style={{ animation: "spin 3s linear infinite" }} className="text-white" viewBox="0 0 24 24" width={80} height={80} fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg><style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style></div> );

// const RandomWorkSection = () => {
//   const [randomVideo, setRandomVideo] = useState<Video | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(true);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const playerRef = useRef<Player | null>(null);

//   useEffect(() => {
//     sanityClient.fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
//       .then((data: Video[]) => {
//         if (data.length > 0) { setRandomVideo(data[Math.floor(Math.random() * data.length)]); } else { setLoading(false); }
//       }).catch(err => { console.error(err); setLoading(false); });
//   }, []);

//   useEffect(() => { if (iframeRef.current) { playerRef.current = new Player(iframeRef.current); } }, [randomVideo]);

//   const toggleMute = () => {
//     const newMutedState = !isMuted;
//     setIsMuted(newMutedState);
//     if (playerRef.current) { playerRef.current.setVolume(newMutedState ? 0 : 1); }
//   };

//   return (
//     <>
//       <title>Red Malanga - Aaron ALAYO - Creative Portfolio</title>
//       <meta name="description" content="Welcome to the creative portfolio of Aaron Alayo. Explore a curated collection of professional work in photography, video production, and software development." />
//       <link rel="canonical" href="https://redmalanga.com/" />
//       <section className="relative w-full h-screen overflow-hidden bg-black">
//         {loading && ( <div className="absolute inset-0 flex items-center justify-center z-30 bg-black"><StarLoader /></div> )}
//         {randomVideo && ( <div className="absolute inset-0 w-full h-full z-10"><iframe ref={iframeRef} src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1&quality=1080p`} title={randomVideo.title} allow="autoplay; fullscreen" allowFullScreen onLoad={() => setLoading(false)} className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2" style={{ border: 'none' }} /></div> )}
        
//         <div className="absolute top-4 left-20 z-20 flex items-center h-12">
//           <h1 className="font-veep font-bold text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-lg">
//             Welcome
//           </h1>
//         </div>

//         <div className="absolute bottom-5 right-5 z-20"><button onClick={toggleMute} aria-label={isMuted ? 'Unmute video' : 'Mute video'} className="text-white opacity-60 hover:opacity-100 transition">{isMuted ? <MutedIcon /> : <UnmutedIcon />}</button></div>
//       </section>
//     </>
//   );
// };

// export default RandomWorkSection;



// The version you can revert to AFTER Google updates its search result

// import { useEffect, useState, useRef } from 'react';
// import sanityClient from '../sanityClient';
// import Player from '@vimeo/player';

// const UnmutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path></svg> );
// const MutedIcon = ({ className = 'w-5 h-5' }) => ( <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2"></path></svg> );
// interface Video { _id: string; title: string; vimeoId: string; }
// const StarLoader = () => ( <div className="flex items-center justify-center w-full h-full"><svg style={{ animation: "spin 3s linear infinite" }} className="text-white" viewBox="0 0 24 24" width={80} height={80} fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg><style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style></div> );

// const RandomWorkSection = () => {
//   const [randomVideo, setRandomVideo] = useState<Video | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(true);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const playerRef = useRef<Player | null>(null);

//   useEffect(() => {
//     sanityClient.fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
//       .then((data: Video[]) => {
//         if (data.length > 0) { setRandomVideo(data[Math.floor(Math.random() * data.length)]); } else { setLoading(false); }
//       }).catch(err => { console.error(err); setLoading(false); });
//   }, []);

//   useEffect(() => { if (iframeRef.current) { playerRef.current = new Player(iframeRef.current); } }, [randomVideo]);

//   const toggleMute = () => {
//     const newMutedState = !isMuted;
//     setIsMuted(newMutedState);
//     if (playerRef.current) { playerRef.current.setVolume(newMutedState ? 0 : 1); }
//   };

//   return (
//     <>
//       <title>Red Malanga - Aaron ALAYO - Creative Portfolio</title>
//       <meta name="description" content="Welcome to the creative portfolio of Aaron Alayo. Explore a curated collection of professional work in photography, video production, and software development." />
//       <link rel="canonical" href="https://redmalanga.com/" />
//       <section className="relative w-full h-screen overflow-hidden bg-black">
//         {loading && ( <div className="absolute inset-0 flex items-center justify-center z-30 bg-black"><StarLoader /></div> )}
//         {randomVideo && ( <div className="absolute inset-0 w-full h-full z-10"><iframe ref={iframeRef} src={`https://player.vimeo.com/video/${randomVideo.vimeoId}?autoplay=1&muted=1&background=1&quality=1080p`} title={randomVideo.title} allow="autoplay; fullscreen" allowFullScreen onLoad={() => setLoading(false)} className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2" style={{ border: 'none' }} /></div> )}
        
//         <div className="absolute top-4 left-20 z-20 flex items-center h-12">
//           <h1 className="font-veep font-bold text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-lg">
//             Welcome
//           </h1>
//         </div>

//         <div className="absolute bottom-5 right-5 z-20"><button onClick={toggleMute} aria-label={isMuted ? 'Unmute video' : 'Mute video'} className="text-white opacity-60 hover:opacity-100 transition">{isMuted ? <MutedIcon /> : <UnmutedIcon />}</button></div>
//       </section>
//     </>
//   );
// };

// export default RandomWorkSection;