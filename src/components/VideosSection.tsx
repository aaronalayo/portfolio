// src/components/VideosSection.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
  slug: {
    current: string;
  };
}

const PAGE_SIZE = 6;

const VideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);

  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // --- THIS IS THE FIX (Part 1): The More Robust Sanity Query ---
  const loadMoreVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // We now only fetch videos where the slug's "current" property is defined.
      const query = `*[_type == "video" && defined(slug.current)] | order(_createdAt desc) [${start}...${start + PAGE_SIZE}] {
        _id, title, vimeoId, slug
      }`;
      const data: Video[] = await sanityClient.fetch(query);
      
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

  const handleVideoClick = useCallback((vimeoId: string) => {
    if (document.getElementById('video-modal-container')) return;

    const container = document.createElement('div');
    container.id = 'video-modal-container';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.background = 'rgba(0, 0, 0, 0.9)';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    const iframe = document.createElement('iframe');
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
    
    const closeAll = () => {
      const modal = document.getElementById('video-modal-container');
      if (modal && document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
      window.removeEventListener('keydown', handleEsc);
      navigate('/videos');
    };
    
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    closeBtn.addEventListener('click', closeAll);
    container.addEventListener('click', closeAll);
    window.addEventListener('keydown', handleEsc);
    
    container.appendChild(closeBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);
  }, [navigate]);

  useEffect(() => {
    if (slug && videos.length > 0) {
      const videoFromSlug = videos.find(v => v.slug.current === slug);
      if (videoFromSlug) {
        handleVideoClick(videoFromSlug.vimeoId);
      }
    }
  }, [slug, videos, handleVideoClick]);

  const selectedVideo = slug && videos.length > 0 ? videos.find(v => v.slug.current === slug) : null;

  return (
    <>
      {selectedVideo ? (
        <>
          <title>{`${selectedVideo.title} - Video by Red Malanga`}</title>
          <meta name="description" content={`Watch the video titled "${selectedVideo.title}" from the creative portfolio of Red Malanga.`} />
          <link rel="canonical" href={`https://redmalanga.com/videos/${selectedVideo.slug.current}`} />
        </>
      ) : (
        <>
          <title>Video & Editorial Work - Red Malanga - Aaron ALAYO</title>
          <meta name="description" content="A collection of professional video and editorial work. View my portfolio of creative video projects." />
          <link rel="canonical" href="https://redmalanga.com/videos" />
        </>
      )}

      <section className="w-full min-h-screen bg-white flex flex-col z-10 px-4 py-20">
        <h2 className="font-veep text-2xl mb-16 text-center uppercase tracking-tight text-black-900 drop-shadow-sm">
          EDITORIAL WORK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1600px] mx-auto px-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="aspect-video w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl relative group transition-transform hover-scale-105"
              // --- THIS IS THE FIX (Part 2): The Safeguarded onClick ---
              onClick={() => {
                // Only navigate if the video has a valid slug
                if (video.slug && video.slug.current) {
                  navigate(`/videos/${video.slug.current}`);
                } else {
                  console.warn("This video is missing a slug and cannot be opened via URL.", video);
                  // As a fallback, we can still open it the old way
                  handleVideoClick(video.vimeoId);
                }
              }}
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