/* ======================================================
   श्रीकृष्ण जन्मोत्सव 2026 - Master Production JS Engine
   Responsive Touch & Desktop Optimization
   Location: assets/js/main.js
   ====================================================== */

'use strict';

/**
 * Class representing a twinkling Star in the night sky.
 */
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
    }

    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 1.5 + 0.4;

        const colors = ['#ffffff', '#fef08a', '#fbbf24', '#e0f2fe', '#bae6fd'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.baseAlpha = Math.random() * 0.45 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.003 + 0.001;
        this.phase = Math.random() * Math.PI * 2;
        this.isLens = Math.random() > 0.88; // 12% chance for 4-point lens flare
    }

    update(timestamp) {
        // Smooth Sinusoidal Twinkle Effect
        this.alpha = this.baseAlpha + Math.sin(timestamp * this.twinkleSpeed + this.phase) * 0.35;
        this.alpha = Math.max(0.08, Math.min(1, this.alpha));
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius > 1.2 ? 6 : 2;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Lens Flare for brighter stars
        if (this.isLens && this.alpha > 0.6) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.5;
            const flareLength = this.radius * 4;

            ctx.beginPath();
            ctx.moveTo(this.x - flareLength, this.y);
            ctx.lineTo(this.x + flareLength, this.y);
            ctx.moveTo(this.x, this.y - flareLength);
            ctx.lineTo(this.x, this.y + flareLength);
            ctx.stroke();
        }

        ctx.restore();
    }
}

/**
 * Class representing a Shooting Star (Comet/Meteor).
 */
class ShootingStar {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth * 0.75;
        this.y = Math.random() * (this.canvasHeight * 0.4);
        this.length = Math.random() * 90 + 50;
        this.speed = Math.random() * 9 + 6;
        this.angle = (Math.PI / 180) * (Math.random() * 15 + 30);
        this.opacity = 1;
        this.active = false;
    }

    spawn() {
        this.reset();
        this.active = true;
    }

    update(deltaTime) {
        if (!this.active) return;

        const factor = deltaTime / 16.67;
        this.x += Math.cos(this.angle) * this.speed * factor;
        this.y += Math.sin(this.angle) * this.speed * factor;
        this.opacity -= 0.014 * factor;

        if (this.opacity <= 0 || this.x > this.canvasWidth || this.y > this.canvasHeight) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#fef08a');
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.restore();
    }
}

/**
 * Master Application Class for Countdown & Visual Engine.
 */
class CountdownApp {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);

        // 1. Primary Target Date: Shri Krishna Janmotsav (4 September 2026 11:59:00 PM IST)
        const primaryTargetISO = '2026-09-04T23:59:00+05:30';
        const primaryTargetMs = new Date(primaryTargetISO).getTime();

        // 24-Hour Celebration Window after 11:59 PM (until 5 September 2026 11:59:00 PM IST)
        const celebrationWindowMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // 2. Next Year Target Date: Shri Krishna Janmashtami 2027 (25 August 2027 00:00:00 IST)
        const nextYearTargetISO = '2027-08-25T00:00:00+05:30';
        const nextYearTargetMs = new Date(nextYearTargetISO).getTime();

        const now = Date.now();

        // Target Date Initialization (Live Production Mode vs Demo Parameters)
        if (urlParams.get('force') === 'celebration') {
            this.targetDate = now - 1000;
            this.celebrationEndTime = now + celebrationWindowMs;
        } else if (urlParams.get('force') === 'countdown') {
            this.targetDate = nextYearTargetMs;
            this.celebrationEndTime = 0;
        } else if (urlParams.get('demo') === 'true' || urlParams.get('test') === 'true') {
            const demoSeconds = parseInt(urlParams.get('seconds'), 10) || 5;
            this.targetDate = now + demoSeconds * 1000;
            this.celebrationEndTime = this.targetDate + celebrationWindowMs;
        } else {
            // Live Production Time Cycle:
            if (now < primaryTargetMs) {
                // Count down to Shri Krishna Janmotsav (4 September 2026 11:59:00 PM IST)
                this.targetDate = primaryTargetMs;
                this.celebrationEndTime = primaryTargetMs + celebrationWindowMs;
            } else if (now >= primaryTargetMs && now < (primaryTargetMs + celebrationWindowMs)) {
                // Active 24-hour celebration window post-birth
                this.targetDate = primaryTargetMs;
                this.celebrationEndTime = primaryTargetMs + celebrationWindowMs;
            } else {
                // After 24 hours pass -> Target next year's Janmashtami (2027)
                this.targetDate = nextYearTargetMs;
                this.celebrationEndTime = 0;
            }
        }

        // DOM Elements
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.celebrationEl = document.getElementById('celebration-message');

        // Jail Gate & Video Darshan DOM
        this.jailOverlay = document.getElementById('jail-gate-overlay');
        this.leftGate = document.getElementById('left-gate');
        this.rightGate = document.getElementById('right-gate');
        this.jailLock = document.getElementById('jail-lock');
        this.flowerContainer = document.getElementById('flower-shower-container');
        this.videoEl = document.getElementById('krishna-divine-video');
        this.videoSource = document.getElementById('video-source');
        this.muteBtn = document.getElementById('video-mute-btn');
        this.muteIcon = document.getElementById('mute-icon');
        this.soundLabel = document.getElementById('sound-label');

        // Flower Emojis Array (Filtered: 🌸 🌺 🌻 🪷 🌼 🏵️)
        this.flowerEmojis = ['🌸', '🌺', '🌻', '🪷', '🌼', '🏵️'];
        this.hasCelebrated = false;
        this.flowerInterval = null;

        // Audio/Video State Tracking
        this._isPlayInProgress = false;   // Prevents concurrent play() calls
        this._audioUnlocked = false;       // Tracks if user gesture unlocked audio
        this._userPaused = false;          // Tracks if user intentionally paused

        // Canvas Setup
        this.canvas = document.getElementById('star-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.stars = [];
        this.shootingStar = null;
        this.lastTime = 0;

        this.init();
    }

    stopFlowerShower() {
        if (this.flowerInterval) {
            clearInterval(this.flowerInterval);
            this.flowerInterval = null;
        }
        if (this.flowerContainer) {
            this.flowerContainer.innerHTML = '';
        }
    }

    startFlowerShower() {
        if (!this.flowerContainer) return;

        this.flowerContainer.innerHTML = '';

        for (let i = 0; i < 35; i++) {
            setTimeout(() => this.spawnSingleFlower(), i * 80);
        }

        if (this.flowerInterval) clearInterval(this.flowerInterval);
        this.flowerInterval = setInterval(() => {
            this.spawnSingleFlower();
        }, 250);
    }

    spawnSingleFlower() {
        if (!this.flowerContainer) return;

        const flowerEl = document.createElement('div');
        flowerEl.className = 'flower-particle';

        const emoji = this.flowerEmojis[Math.floor(Math.random() * this.flowerEmojis.length)];
        flowerEl.textContent = emoji;

        const startX = Math.random() * 96;
        const fallDuration = (Math.random() * 3.5 + 3.8).toFixed(2);
        const swayDuration = (Math.random() * 2.2 + 2.0).toFixed(2);
        const scale = (Math.random() * 0.7 + 0.7).toFixed(2);

        flowerEl.style.left = `${startX}vw`;
        flowerEl.style.setProperty('--fall-duration', `${fallDuration}s`);
        flowerEl.style.setProperty('--sway-duration', `${swayDuration}s`);
        flowerEl.style.setProperty('--flower-scale', scale);

        this.flowerContainer.appendChild(flowerEl);

        setTimeout(() => {
            if (flowerEl && flowerEl.parentNode) {
                flowerEl.parentNode.removeChild(flowerEl);
            }
        }, parseFloat(fallDuration) * 1000 + 100);
    }

    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);

        // 24-Hour Celebration: Video loops continuously.
        // After 24 hours, stop looping and show the festive greeting.
        const greetingOverlay = document.getElementById('video-end-greeting');
        const replayBtn = document.getElementById('replay-darshan-btn');

        const CELEBRATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

        if (this.videoEl) {
            // After 24 hours, stop the loop and show greeting
            setTimeout(() => {
                if (this.videoEl) {
                    this.videoEl.loop = false;
                    this.videoEl.addEventListener('ended', () => {
                        if (greetingOverlay) greetingOverlay.classList.remove('d-none');
                        this.stopFlowerShower();
                    }, { once: true });
                }
            }, CELEBRATION_DURATION_MS);
        }

        if (replayBtn && this.videoEl) {
            replayBtn.addEventListener('click', () => {
                if (greetingOverlay) greetingOverlay.classList.add('d-none');
                this._userPaused = false; // Reset so auto-resume works
                this.videoEl.loop = true;
                this.videoEl.currentTime = 0;
                this.unmuteAndPlayVideo();
                this.startFlowerShower();
            });
        }

        // One-time User Interaction Listener: Unmutes & starts song on first user gesture
        // After audio is successfully unlocked, these listeners are removed to prevent
        // repeated play() calls that cause stuttering on mobile browsers.
        const unlockAudioOnUserGesture = () => {
            if (!this.videoEl) return;
            if (this._audioUnlocked) {
                // Already unlocked, remove all listeners
                this._removeUnlockListeners();
                return;
            }
            this.unmuteAndPlayVideo();
        };

        // Store reference for cleanup
        this._unlockHandler = unlockAudioOnUserGesture;
        this._unlockEventTypes = ['click', 'touchstart', 'pointerdown', 'keydown'];

        this._unlockEventTypes.forEach((eventType) => {
            document.addEventListener(eventType, this._unlockHandler, { passive: true });
        });

        // Video container & jail overlay - single click to unmute
        const videoWrapper = document.querySelector('.krishna-video-wrapper');
        if (videoWrapper) {
            videoWrapper.addEventListener('click', () => this.unmuteAndPlayVideo());
        }
        if (this.jailOverlay) {
            this.jailOverlay.addEventListener('click', () => this.unmuteAndPlayVideo());
        }

        // Auto-resume: If browser pauses video (resource contention, audio focus loss),
        // automatically resume playback unless user intentionally paused/closed darshan.
        if (this.videoEl) {
            this.videoEl.addEventListener('pause', () => {
                // Only auto-resume if not user-initiated pause
                if (!this._userPaused && this._audioUnlocked && !this.videoEl.ended) {
                    setTimeout(() => {
                        if (this.videoEl && this.videoEl.paused && !this._userPaused && !this.videoEl.ended) {
                            this.videoEl.play().catch(() => { });
                        }
                    }, 300);
                }
            });

            // Handle 'waiting' event (buffering) - ensure playback resumes after buffer
            this.videoEl.addEventListener('waiting', () => {
                // Browser is buffering, nothing to do - it will auto-resume via 'playing' event
            });

            // Track successful play state
            this.videoEl.addEventListener('playing', () => {
                this._isPlayInProgress = false;
            });
        }

        // Handle tab visibility change - resume when user returns to tab
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this._audioUnlocked && !this._userPaused) {
                if (this.videoEl && this.videoEl.paused && !this.videoEl.ended) {
                    this.videoEl.play().catch(() => { });
                }
            }
        });

        // Video Audio Mute/Unmute Toggle
        if (this.muteBtn && this.videoEl) {
            this.muteBtn.addEventListener('click', () => {
                if (this.videoEl.muted) {
                    this.unmuteAndPlayVideo();
                } else {
                    this.videoEl.muted = true;
                    if (this.muteIcon) this.muteIcon.className = 'fas fa-volume-mute';
                    if (this.soundLabel) this.soundLabel.textContent = 'ध्वनि चालू करें';
                }
            });
        }

        // Video Tab Switcher
        const tabBtns = document.querySelectorAll('.video-tab-btn');
        tabBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const targetVideo = btn.getAttribute('data-video');
                if (targetVideo && this.videoEl && this.videoSource) {
                    if (greetingOverlay) greetingOverlay.classList.add('d-none');
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    this.videoSource.src = targetVideo;
                    this.videoEl.load();
                    this.unmuteAndPlayVideo();
                }
            });
        });

        // Bind Pushpanjali and Close Darshan buttons
        const pushpanjaliBtn = document.getElementById('pushpanjali-btn');
        if (pushpanjaliBtn) {
            pushpanjaliBtn.addEventListener('click', () => {
                this.startFlowerShower();
                this.playSynthSound('templeChime');
            });
        }

        const closeDarshanBtn = document.getElementById('close-darshan-btn');
        if (closeDarshanBtn && this.jailOverlay) {
            closeDarshanBtn.addEventListener('click', () => {
                this._userPaused = true; // Mark as user-intentional pause
                this.jailOverlay.style.opacity = '0';
                setTimeout(() => {
                    this.jailOverlay.classList.add('d-none');
                    if (this.videoEl) this.videoEl.pause();
                    if (greetingOverlay) greetingOverlay.classList.add('d-none');
                    this.stopFlowerShower();
                }, 800);
            });
        }

        if (this.canvas && this.ctx) {
            this.setupCanvas();
            if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
                this.setup3DTilt();
            }
        }
    }

    updateCountdown() {
        const now = Date.now();
        const difference = this.targetDate - now;

        // Check if we are currently within the 24-hour celebration window post 4th Sept 11:59 PM
        const isCelebrationWindow = (now >= this.targetDate) && (this.celebrationEndTime === 0 || now < this.celebrationEndTime);

        if (isCelebrationWindow) {
            this.renderValues(0, 0, 0, 0);
            if (!this.hasCelebrated) {
                this.triggerJailGateOpening();
            }
            if (this.celebrationEl) this.celebrationEl.classList.remove('d-none');
            return;
        }

        // If 24 hours have passed post birth, transition target to next year (2027)
        if (now >= this.celebrationEndTime && this.celebrationEndTime > 0) {
            const nextYearMs = new Date('2027-08-25T00:00:00+05:30').getTime();
            this.targetDate = nextYearMs;
            this.celebrationEndTime = 0;
            this.hasCelebrated = false;
            if (this.jailOverlay) {
                this.jailOverlay.classList.add('d-none');
            }
        }

        if (this.celebrationEl) this.celebrationEl.classList.add('d-none');

        const remainingDiff = Math.max(0, this.targetDate - now);
        const days = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingDiff % (1000 * 60)) / 1000);

        this.renderValues(days, hours, minutes, seconds);
    }

    renderValues(days, hours, minutes, seconds) {
        if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
        if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
        if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
        if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    triggerJailGateOpening() {
        this.hasCelebrated = true;
        if (!this.jailOverlay) return;

        const jailFrame = document.getElementById('jail-frame');

        // Reset Overlay, Frame Rumble & Gates State
        this.jailOverlay.classList.remove('d-none');
        this.jailOverlay.style.opacity = '1';
        if (jailFrame) jailFrame.classList.remove('rumble');
        if (this.jailLock) this.jailLock.classList.remove('broken');
        if (this.leftGate) this.leftGate.classList.remove('open');
        if (this.rightGate) this.rightGate.classList.remove('open');
        this.jailOverlay.classList.remove('active');

        // Step 1: Pre-opening Fortress Camera Rumble (0ms)
        if (jailFrame) jailFrame.classList.add('rumble');

        // Step 2: Metallic Lock Shatter & Divine Light Eruption (450ms)
        setTimeout(() => {
            if (jailFrame) jailFrame.classList.remove('rumble');
            if (this.jailLock) this.jailLock.classList.add('broken');
            this.jailOverlay.classList.add('active');

            this.playSynthSound('shatter');
        }, 450);

        // Step 3: Heavy 3D Wooden/Iron Gate Doors Swing Open Outward (1200ms)
        setTimeout(() => {
            if (this.leftGate) this.leftGate.classList.add('open');
            if (this.rightGate) this.rightGate.classList.add('open');

            this.playSynthSound('gateOpen');
        }, 1200);

        // Step 4: Auto Pushpanjali & Poster Display (1800ms) - Show poster for 3 seconds first
        setTimeout(() => {
            // Auto Pushpanjali - Flower shower starts automatically
            this.startFlowerShower();
            if (this.celebrationEl) this.celebrationEl.classList.remove('d-none');
            this.playSynthSound('templeChime');

            // Step 4b: After 3-second divine poster display, start Krishna Janmashtami video with song (4800ms)
            setTimeout(() => {
                if (this.videoEl) {
                    this.videoEl.loop = true; // Ensure 24-hour loop is set
                    this.unmuteAndPlayVideo();
                }
            }, 3000); // 3-second poster/bhajan-loading pause
        }, 1800);
    }

    /**
     * Remove global unlock event listeners after audio is successfully unlocked.
     */
    _removeUnlockListeners() {
        if (this._unlockHandler && this._unlockEventTypes) {
            this._unlockEventTypes.forEach((eventType) => {
                document.removeEventListener(eventType, this._unlockHandler);
            });
            this._unlockHandler = null;
        }
    }

    /**
     * Unmute video and trigger play with audio (Song).
     * Guarded against concurrent play() calls that cause mobile stuttering.
     */
    unmuteAndPlayVideo() {
        if (!this.videoEl) return;

        // Prevent overlapping play() calls - this is the primary cause of mobile stuttering
        if (this._isPlayInProgress) return;
        this._isPlayInProgress = true;
        this._userPaused = false; // Reset user-pause flag since we're explicitly playing

        this.videoEl.muted = false;
        this.videoEl.play().then(() => {
            this._isPlayInProgress = false;
            this._audioUnlocked = true;

            // Remove global unlock listeners now that audio is playing successfully
            this._removeUnlockListeners();

            if (this.muteIcon) this.muteIcon.className = 'fas fa-volume-up text-warning';
            if (this.soundLabel) this.soundLabel.textContent = 'ध्वनि बंद करें';
        }).catch((err) => {
            console.warn("Autoplay with sound blocked, trying muted play fallback:", err);
            this.videoEl.muted = true;
            this.videoEl.play().then(() => {
                this._isPlayInProgress = false;
                // Muted play succeeded - keep unlock listeners active for future unmute attempt
            }).catch(() => {
                this._isPlayInProgress = false;
            });
        });
    }

    /**
     * Native Web Audio API Sound Synthesizer Engine (Zero external audio files required)
     */
    playSynthSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            if (type === 'shatter') {
                // Metallic Impact & Shatter Sound Synth
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

                gain.gain.setValueAtTime(0.6, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === 'gateOpen') {
                // Low Deep Wooden/Iron Creak Resonance Synth
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(80, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 1.2);

                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } else if (type === 'templeChime') {
                // Celestial Temple Bell Frequencies (Golden Chime)
                const frequencies = [523.25, 659.25, 783.99, 1046.50];
                frequencies.forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, ctx.currentTime);

                        gain.gain.setValueAtTime(0.3, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 1.8);
                    }, index * 120);
                });
            }
        } catch (e) {
            // Audio context silently handled if user hasn't interacted with page yet
        }
    }

    setupCanvas() {
        let resizeTimeout;
        const resize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.initStarfield();
                if (this.shootingStar) {
                    this.shootingStar.canvasWidth = this.canvas.width;
                    this.shootingStar.canvasHeight = this.canvas.height;
                }
            }, 100);
        };

        window.addEventListener('resize', resize, { passive: true });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initStarfield();

        this.shootingStar = new ShootingStar(this.canvas.width, this.canvas.height);

        setInterval(() => {
            if (this.shootingStar && !this.shootingStar.active && Math.random() > 0.35) {
                this.shootingStar.spawn();
            }
        }, 4000);

        requestAnimationFrame((timestamp) => this.renderLoop(timestamp));
    }

    initStarfield() {
        this.stars = [];
        const count = Math.floor((this.canvas.width * this.canvas.height) / 3200);
        const total = Math.max(100, Math.min(count, 300)); // Dynamic star density per screen size

        for (let i = 0; i < total; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    renderLoop(timestamp) {
        const deltaTime = timestamp - (this.lastTime || timestamp);
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].update(timestamp);
            this.stars[i].draw(this.ctx);
        }

        if (this.shootingStar) {
            this.shootingStar.update(deltaTime);
            this.shootingStar.draw(this.ctx);
        }

        requestAnimationFrame((ts) => this.renderLoop(ts));
    }

    setup3DTilt() {
        const cards = document.querySelectorAll('.countdown-box');
        if (!cards.length) return;

        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateX = (-y / (rect.height / 2)) * 10;
                const rotateY = (x / (rect.width / 2)) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            }, { passive: true });
        });
    }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CountdownApp();
});