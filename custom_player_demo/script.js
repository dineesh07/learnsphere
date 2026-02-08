document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('courseVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    let lastValidTime = 0;
    let isSeeking = false;

    // --- Core Logic: Prevent Seeking ---

    // 1. Disable seeking interaction
    // Note: We used a <div> for progress bar, not <input type="range">. 
    // This physically prevents click-to-seek behaviors.

    // 2. Monitoring time updates
    video.addEventListener('timeupdate', () => {
        if (!video.seeking) {
            // If playing normally, update our last valid position
            lastValidTime = video.currentTime;
            updateProgress();
        }
    });

    // 3. Detect and revert seeking attempts
    video.addEventListener('seeking', () => {
        // Calculate how far they tried to jump
        const delta = Math.abs(video.currentTime - lastValidTime);

        // If jump is significant (more than 1 second), revert it
        // We allow tiny jumps to prevent stuttering loops
        if (delta > 1.0) {
            video.currentTime = lastValidTime;
        }
    });

    // 4. Disable keyboard shortcuts for seeking
    document.addEventListener('keydown', (e) => {
        // Block ArrowLeft (37), ArrowRight (39), 'J', 'L'
        if ([37, 39, 74, 76].includes(e.keyCode)) {
            e.preventDefault();
        }
    });

    // --- Standard Controls Logic ---

    // Toggle Play/Pause
    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    }

    // Update UI on Play/Pause events
    video.addEventListener('play', () => {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });

    video.addEventListener('pause', () => {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    // Update Progress Bar & Time
    function updateProgress() {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${percent}%`;

            currentTimeEl.textContent = formatTime(video.currentTime);
            durationEl.textContent = formatTime(video.duration);
        }
    }

    // Format seconds to MM:SS
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Initialize duration display once metadata loads
    video.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(video.duration);
    });
});
