import React, { useRef, useState, useEffect } from 'react';
import './CustomVideoPlayer.css';

const CustomVideoPlayer = ({ src, poster }) => {
    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Track last valid time for anti-seek logic
    const lastValidTime = useRef(0);

    // Toggle Play/Pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (playerContainerRef.current.requestFullscreen) {
                playerContainerRef.current.requestFullscreen();
            } else if (playerContainerRef.current.webkitRequestFullscreen) { /* Safari */
                playerContainerRef.current.webkitRequestFullscreen();
            } else if (playerContainerRef.current.msRequestFullscreen) { /* IE11 */
                playerContainerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    // Format time Helper
    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Handle Time Update & Anti-Seek Logic
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;

            // Check if user tried to seek (jumped more than 1.5s)
            // But verify we are not just starting playback from 0
            if (Math.abs(current - lastValidTime.current) > 1.5 && lastValidTime.current > 0) {
                // REVERT SEEK
                videoRef.current.currentTime = lastValidTime.current;
                return;
            }

            // Update valid time
            lastValidTime.current = current;
            setCurrentTime(current);
            const progressPercent = (current / videoRef.current.duration) * 100;
            setProgress(progressPercent);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    // Prevent Seeking via Keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            // ArrowLeft, ArrowRight, J, L
            if ([37, 39, 74, 76].includes(e.keyCode)) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Listen for fullscreen change events (ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Prevent context menu (Right click)
    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    return (
        <div
            ref={playerContainerRef}
            className={`custom-video-wrapper ${!isPlaying ? 'paused' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
            onContextMenu={handleContextMenu}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
            >
                <p>Your browser does not support the video tag.</p>
            </video>

            {/* Custom Controls */}
            <div className="custom-controls-overlay">
                {/* Visual Progress Bar (Non-interactive) */}
                <div className="custom-progress-bar-container">
                    <div
                        className="custom-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="custom-controls-row">
                    <button className="custom-control-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? (
                            <svg className="custom-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg className="custom-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <div className="custom-time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    <div style={{ flex: 1 }}></div>

                    {/* Fullscreen Button */}
                    <button className="custom-control-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                        {isFullscreen ? (
                            <svg className="custom-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                            </svg>
                        ) : (
                            <svg className="custom-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;
