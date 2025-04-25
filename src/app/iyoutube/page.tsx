'use client';
import React, { useEffect, useRef, useState } from 'react';

// Extend the Window interface to include onYouTubeIframeAPIReady
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: Record<string, number>;
          events: {
            onReady: (event: { target: { seekTo: (seconds: number, allowSeekAhead: boolean) => void; }; }) => void;
            onStateChange: (event: { data: number; }) => void;
          };
        }
      ) => { destroy: () => void; getCurrentTime: () => number; };
    };
  }
}

export default function Page() {
  const playerRef = useRef<{ destroy: () => void; getCurrentTime: () => number; } | null>(null); // Ref for the YouTube player instance
  const playerContainerId = 'youtube-player'; // Unique ID for the player container
  const [currentTime, setCurrentTime] = useState<number>(0); // State for current playback time

  useEffect(() => {
    // Load the YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else {
      // If the API is already loaded, initialize the player immediately
      initializePlayer();
    }

    // Initialize the YouTube player once the API is ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    function initializePlayer() {
      if (!playerRef.current && window.YT) {
        playerRef.current = new window.YT.Player(playerContainerId, {
          videoId: 'wTGVHLyV09M', // Replace with your video ID
          playerVars: {
            autoplay: 0, // Auto-play the video when ready
            mute: 1, // Start the video muted
            controls: 1, // Show controls
            rel: 0, // Do not show related videos at the end
            modestbranding: 1, // Minimal YouTube branding
          },
          events: {
            onReady: (event) => {
              console.log('Player is ready');
              event.target.seekTo(10, true); // Seek to 10 seconds when the player is ready
            },
            onStateChange: (event) => {
              console.log('Player state changed:', event.data);
            },
          },
        });
      }
    }
    return()=>{
      playerRef.current?.destroy();
      playerRef.current = null; 
    }
  }, []);

  // Function to get the current playback time
  const handleGetCurrentTime = () => {
    if (playerRef.current) {
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);
      console.log('Current playback time:', time);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center m-10 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">YouTube Player</h1>
      <div className="w-full aspect-video">
        <div id={playerContainerId} className="youtube-player w-full h-full"></div>
      </div>
      <button
        onClick={handleGetCurrentTime}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Current Time
      </button>
      <div className="mt-2">Current Time: {currentTime.toFixed(2)} seconds</div>
    </main>
  );
}