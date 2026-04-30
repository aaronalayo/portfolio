import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '../sanityClient';

type SanityImageSource = unknown;
const builder = imageUrlBuilder(sanityClient);
type BuilderImageParam = Parameters<typeof builder.image>[0];
const urlFor = (source: SanityImageSource) => builder.image(source as BuilderImageParam);

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
  category: string;
  slug: {
    current: string;
  };
  thumbnail?: SanityImageSource;
}

interface CategoryOption {
  label: string;
  normalized: string;
}

const PAGE_SIZE = 6;
const ALL_CATEGORY = 'All';
const normalizeCategory = (value: string) => value.trim().toLowerCase();

const VideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // 1. Fetch all unique categories available in Sanity on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "video" && defined(category)].category`;
        const rawCategories: string[] = await sanityClient.fetch(query);
        const unique = Array.from(new Set(rawCategories.map((c) => c.trim())))
          .map((c) => ({ label: c, normalized: normalizeCategory(c) }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCategories(unique);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Modified Load Function: Now supports category-specific server-side fetching
  const loadVideos = useCallback(async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    const currentStart = reset ? 0 : start;
    
    // Build the query filter based on category
    const categoryFilter = selectedCategory !== ALL_CATEGORY 
      ? `&& category == "${selectedCategory}"` 
      : "";

    try {
      const query = `*[_type == "video" && defined(slug.current) ${categoryFilter}] | order(_createdAt desc) [${currentStart}...${currentStart + PAGE_SIZE}] {
        _id, title, vimeoId, category, slug, thumbnail
      }`;
      
      const data: Video[] = await sanityClient.fetch(query);
      
      if (reset) {
        setVideos(data);
        setStart(PAGE_SIZE);
        setHasMore(data.length === PAGE_SIZE);
      } else {
        if (data.length > 0) {
          setVideos((prev) => [...prev, ...data].filter((v, i, self) => self.findIndex(x => x._id === v._id) === i));
          setStart((prev) => prev + PAGE_SIZE);
          setHasMore(data.length === PAGE_SIZE);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [start, loading, selectedCategory]);

  // Initial load or category change
  useEffect(() => {
    loadVideos(true);
  }, [selectedCategory]);

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

        {/* Categories Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCategory(ALL_CATEGORY)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              selectedCategory === ALL_CATEGORY
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black/40 hover:border-black'
            }`}
          >
            {ALL_CATEGORY}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.normalized}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                normalizeCategory(selectedCategory) === cat.normalized
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black/40 hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1600px] mx-auto px-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="aspect-video w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl relative group transition-transform hover-scale-105"
              onClick={() => {
                if (video.slug && video.slug.current) {
                  navigate(`/videos/${video.slug.current}`);
                } else {
                  handleVideoClick(video.vimeoId);
                }
              }}
            >
              <img
                src={
                  video.thumbnail
                    ? urlFor(video.thumbnail).width(800).height(450).format('webp').url()
                    : `https://vumbnail.com/${video.vimeoId}.jpg`
                }
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition">
                <h3 className="text-white text-lg md:text-xl font-semibold px-4 text-center">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {hasMore && (
            <button
              onClick={() => loadVideos()}
              disabled={loading}
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-base cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? 'Loading...' : '+'}
            </button>
          )}
          {!hasMore && videos.length > 0 && (
             <p className="text-center italic mt-6 text-gray-500">That's all folks!</p>
          )}
          {!loading && videos.length === 0 && (
            <p className="text-center italic mt-6 text-gray-500">No videos found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default VideosSection;