import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Video {
  _id: string;
  title: string;
  vimeoId: string;
}

const VideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "video"]{ _id, title, vimeoId }`)
      .then((data: Video[]) => setVideos(data));
  }, []);

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
    iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0`;
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.width = '80%';
    iframe.style.height = '80%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 10px 40px rgba(255, 255, 255, 1)';

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

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(container);
    });

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);
  };

  return (
    <section className="min-h-screen bg-white px-4 py-20 flex flex-col items-center z-10">
      <h2 className="text-5xl font-extrabold mb-16 text-center uppercase tracking-tight text-blue-900 drop-shadow-sm">
        WORK
      </h2>

      <div style={{gap: '14px', margin: '10px'}} className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl w-full px-4">
        {videos.map((video) => (
          <div
            key={video._id}
            style={{borderRadius: '16px'}} className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition transform hover:scale-105"
            onClick={() => handleVideoClick(video.vimeoId)}
          >
            <img
              src={`https://vumbnail.com/${video.vimeoId}.jpg`}
              alt={video.title}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition">
              <h3 className="text-white text-lg font-bold text-center px-4">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosSection;
