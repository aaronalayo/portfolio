import { useEffect, useState, useCallback } from 'react';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

const PAGE_SIZE = 6;

const VideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);

  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data: Video[] = await sanityClient.fetch(
        `*[_type == "video"] | order(_createdAt desc) [${start}...${start + PAGE_SIZE}] {
          _id, title, vimeoId
        }`
      );
      if (data.length > 0) {
        setVideos((prev) => [...prev, ...data].filter((v, i, self) => self.findIndex(x => x._id === v._id) === i));
        setStart((prev) => prev + PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [start, loading, hasMore]);

  useEffect(() => {
    loadMoreVideos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVideoClick = (vimeoId: string) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.background = 'rgba(0, 0, 0, 0.9)';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    const iframe = document.createElement('iframe');
    
    // --- THIS IS THE UPDATED URL ---
    // We add parameters to hide the title, byline, and portrait for a minimal look.
    iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&title=0&byline=0&portrait=0&dnt=1`;
    
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.width = '90%';
    iframe.style.height = '90%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '30px';
    closeBtn.style.fontSize = '32px';
    closeBtn.style.color = 'white';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '1001';
    
    const closeAll = () => { document.body.removeChild(container); window.removeEventListener('keydown', handleEsc); };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    closeBtn.addEventListener('click', closeAll);
    container.addEventListener('click', closeAll);
    window.addEventListener('keydown', handleEsc);
    
    container.appendChild(closeBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);
  };

  return (
    <>
      <title>Video & Editorial Work - Red Malanga - Aaron ALAYO</title>
      <meta name="description" content="A collection of professional video and editorial work. View my portfolio of creative video projects." />
      <link rel="canonical" href="https://redmalanga.com/videos" />

      <section className="w-full min-h-screen bg-white flex flex-col z-10 px-4 py-20">
        <h2 className="font-veep font-bold text-2xl mb-16 text-center uppercase tracking-tight text-black-900 drop-shadow-sm">
          EDITORIAL WORK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1600px] mx-auto px-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="aspect-video w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl relative group transition-transform hover:scale-105"
              onClick={() => handleVideoClick(video.vimeoId)}
            >
              <img src={`https://vumbnail.com/${video.vimeoId}.jpg`} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition">
                <h3 className="text-white text-2xl font-semibold px-4 text-center">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {hasMore && (
            <button
              onClick={loadMoreVideos}
              disabled={loading}
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-base cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? 'Loading...' : '+'}
            </button>
          )}
          {!hasMore && (
             <p className="text-center italic mt-6 text-gray-500">That's all folks!</p>
          )}
        </div>
      </section>
    </>
  );
};

export default VideosSection;