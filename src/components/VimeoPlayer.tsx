// components/VimeoPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';

interface VimeoPlayerProps {
  vimeoId: string;
  width?: number;
}

const VimeoPlayer = ({ vimeoId, width = 640 }: VimeoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!playerRef.current) return;

    playerInstance.current = new Player(playerRef.current, {
      id: vimeoId,
      width,
      controls: true, // keep native controls for fullscreen + play/pause
      autoplay: false,
      responsive: true,
      title: false,
      byline: false,
      portrait: false,
    });

    // Sync state with Vimeo player events
    playerInstance.current.on('play', () => {
      setIsPlaying(true);
    });
    playerInstance.current.on('pause', () => {
      setIsPlaying(false);
    });
    playerInstance.current.on('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      playerInstance.current?.destroy();
    };
  }, [vimeoId, width]);

  const togglePlayPause = () => {
    if (!playerInstance.current) return;

    if (isPlaying) {
      playerInstance.current.pause();
    } else {
      playerInstance.current.play();
    }
  };

  return (
    <div
      style={{
        width: `${width}px`,
        aspectRatio: '16 / 9',
        position: 'relative',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <div
        ref={playerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {/* Show play overlay only when video is not playing */}
      {!isPlaying && (
        <button
          onClick={togglePlayPause}
          aria-label="Play video"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 60,
            lineHeight: 1,
            padding: 0,
            userSelect: 'none',
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          ▶
        </button>
      )}
    </div>
  );
};

export default VimeoPlayer;
