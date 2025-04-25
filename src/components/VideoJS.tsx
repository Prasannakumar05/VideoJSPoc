/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback } from 'react';

import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-ads'; // Import videojs-contrib-ads
import 'videojs-ima';
import 'videojs-ima/dist/videojs.ima.css';
import 'videojs-youtube';

// Add type declaration for window.google
declare global {
    interface Window {
        google: any;
    }
}

const VideoJS = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=";

    // Clean up function to properly dispose the player
    const cleanupPlayer = useCallback(() => {
        if (playerRef.current) {
            try {
                console.log('Disposing player...');
                // Remove all event listeners
                playerRef.current.off();
                // Dispose the player
                playerRef.current.dispose();
                playerRef.current = null;
            } catch (error) {
                console.error('Error disposing player:', error);
            }
        }
    }, []);

    // Set mounted state when component mounts
    useEffect(() => {
        setIsMounted(true);
        
        return () => {
            setIsMounted(false);
            // Extra cleanup when component unmounts
            cleanupPlayer();
        };
    }, [cleanupPlayer]);

    // Function to initialize videojs player
    const initializePlayer = useCallback(() => {
        try {
            // Make sure we have a video element and the component is mounted
            if (!videoRef.current || !isMounted) {
                console.log('Video element not available or component not mounted');
                return;
            }
            
            // Clean up existing player if it exists
            cleanupPlayer();
            
            console.log('Initializing Video.js player');
            
            // Create a new player instance
            const player = videojs(videoRef.current, {
                controls: true,
                autoplay: false,
                //fullscreen: false,
                preload: 'auto',
                fluid: true,
                techOrder: ['youtube'],
                sources:[
                    {
                        src: 'https://www.youtube.com/watch?v=0Nu8R2CwvrA',
                        type: 'video/youtube',
                    },
                ]
            });

            // Store reference to player
            playerRef.current = player;

            // Make sure player is ready before initializing IMA
            player.ready(function() {
                // Check if component is still mounted
                if (!isMounted) {
                    console.log('Component unmounted during initialization');
                    player.dispose();
                    return;
                }
                
                console.log('Player is ready, initializing IMA');
                
                try {
                    // Check if still mounted
                    if (!isMounted) return;
                    
                    // Configure and initialize the IMA plugin
                    const imaOptions = {
                        id: videoRef.current?.id || 'content_video',
                        adTagUrl: adTagUrl,
                        debug: true
                    };
                    
                    // Need to use any type to bypass TypeScript error
                    if (typeof (player as any).ima === 'function') {
                        console.log('IMA function exists, initializing');
                        (player as any).ima(imaOptions);
                        
                        // Use IMA ready event instead of setTimeout
                        player.on('ima-ready', () => {
                            if (!isMounted) return;
                            
                            if ((player as any).ima) {
                                console.log('Requesting ads');
                                (player as any).ima.requestAds();
                            }
                        });
                    } else {
                        console.error('IMA plugin not properly loaded');
                    }
                } catch (imaError) {
                    console.error('Error initializing IMA:', imaError);
                }
            });

        } catch (error) {
            console.error('Error initializing player:', error);
        }
    }, [isMounted, adTagUrl, cleanupPlayer]);

    // Handle IMA SDK loading and player initialization
    useEffect(() => {
        // Skip if component is not mounted
        if (!isMounted) return;
        
        // Ensure IMA SDK is loaded properly before initializing player
        const loadImaSDK = () => {
            if (!window.google) {
                console.log('Loading IMA SDK');
                const script = document.createElement('script');
                script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
                script.async = true;
                
                // Only initialize player after script is fully loaded
                script.onload = () => {
                    // Check if component is still mounted
                    if (!isMounted) return;
                    
                    console.log('IMA SDK loaded successfully');
                    // Initialize immediately after script is loaded
                    initializePlayer();
                };
                
                script.onerror = (e) => {
                    console.error('Error loading IMA SDK:', e);
                };
                
                document.body.appendChild(script);
            } else {
                console.log('IMA SDK already loaded');
                initializePlayer();
            }
        };

        loadImaSDK();
        
        // Cleanup function
        return cleanupPlayer;
    }, [isMounted, adTagUrl, initializePlayer, cleanupPlayer]);

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                id="content_video"
                className="video-js"
                preload="auto"
            >
            </video>
        </div>
    );
};

export default VideoJS;