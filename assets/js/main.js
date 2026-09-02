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
        // Target Date: 4 September 2026 00:00:00 IST
        this.targetDate = new Date('September 4, 2026 00:00:00').getTime();
        // this.targetDate = Date.now() + 5000;

        // DOM Elements
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.celebrationEl = document.getElementById('celebration-message');

        // Jail Gate & Flower Shower DOM
        this.jailOverlay = document.getElementById('jail-gate-overlay');
        this.leftGate = document.getElementById('left-gate');
        this.rightGate = document.getElementById('right-gate');
        this.jailLock = document.getElementById('jail-lock');
        this.flowerContainer = document.getElementById('flower-shower-container');

        // Flower Emojis Array (Filtered: 🌸 🌺 🌻 🪷 🌼 🏵️)
        this.flowerEmojis = ['🌸', '🌺', '🌻', '🪷', '🌼', '🏵️'];
        this.hasCelebrated = false;
        this.flowerInterval = null;

        // Canvas Setup
        this.canvas = document.getElementById('star-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        this.stars = [];
        this.shootingStar = null;
        this.lastTime = 0;

        this.init();
    }

    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);

        if (this.canvas && this.ctx) {
            this.setupCanvas();
            // Enable 3D Tilt only for non-touch desktop devices
            if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
                this.setup3DTilt();
            }
        }
    }

    updateCountdown() {
        const now = Date.now();
        const difference = this.targetDate - now;

        if (difference <= 0) {
            this.renderValues(0, 0, 0, 0);
            if (!this.hasCelebrated) {
                this.triggerJailGateOpening();
            }
            if (this.celebrationEl) this.celebrationEl.classList.remove('d-none');
            return;
        }

        if (this.celebrationEl) this.celebrationEl.classList.add('d-none');

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

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

        // Reset Overlay & Gates State
        this.jailOverlay.classList.remove('d-none');
        this.jailOverlay.style.opacity = '1';
        if (this.jailLock) this.jailLock.classList.remove('broken');
        if (this.leftGate) this.leftGate.classList.remove('open');
        if (this.rightGate) this.rightGate.classList.remove('open');
        this.jailOverlay.classList.remove('active');

        // Step 1: Break Lock & Trigger Divine Beam Light (500ms)
        setTimeout(() => {
            if (this.jailLock) this.jailLock.classList.add('broken');
            this.jailOverlay.classList.add('active');
        }, 400);

        // Step 2: Swing 3D Jail Gate Doors Open Outward (1000ms)
        setTimeout(() => {
            if (this.leftGate) this.leftGate.classList.add('open');
            if (this.rightGate) this.rightGate.classList.add('open');
        }, 1000);

        // Step 3: Start Cascade Flower Shower Rain & Display Banner (1800ms)
        setTimeout(() => {
            this.startFlowerShower();
            if (this.celebrationEl) this.celebrationEl.classList.remove('d-none');
        }, 1600);

        // Step 4: Fade Out Overlay Overlay after gates fully open so full interface & flower rain shine through (4800ms)
        setTimeout(() => {
            this.jailOverlay.style.opacity = '0';
            setTimeout(() => {
                this.jailOverlay.classList.add('d-none');
            }, 800);
        }, 4800);
    }

    startFlowerShower() {
        if (!this.flowerContainer) return;

        // Clear existing flowers
        this.flowerContainer.innerHTML = '';

        // Initial burst of 35 flowers
        for (let i = 0; i < 35; i++) {
            setTimeout(() => this.spawnSingleFlower(), i * 80);
        }

        // Continuous shower every 250ms
        if (this.flowerInterval) clearInterval(this.flowerInterval);
        this.flowerInterval = setInterval(() => {
            this.spawnSingleFlower();
        }, 250);
    }

    spawnSingleFlower() {
        if (!this.flowerContainer) return;

        const flowerEl = document.createElement('div');
        flowerEl.className = 'flower-particle';

        // Pick random flower emoji from active list: 🌸 🌺 🌻 🪷 🌼 🏵️
        const emoji = this.flowerEmojis[Math.floor(Math.random() * this.flowerEmojis.length)];
        flowerEl.textContent = emoji;

        // Random positions and speeds
        const startX = Math.random() * 96; // 0% to 96%
        const fallDuration = (Math.random() * 3.5 + 3.8).toFixed(2); // 3.8s to 7.3s
        const swayDuration = (Math.random() * 2.2 + 2.0).toFixed(2); // 2s to 4.2s
        const scale = (Math.random() * 0.7 + 0.7).toFixed(2); // 0.7 to 1.4

        flowerEl.style.left = `${startX}vw`;
        flowerEl.style.setProperty('--fall-duration', `${fallDuration}s`);
        flowerEl.style.setProperty('--sway-duration', `${swayDuration}s`);
        flowerEl.style.setProperty('--flower-scale', scale);

        this.flowerContainer.appendChild(flowerEl);

        // Remove element after animation completes to keep memory lean
        setTimeout(() => {
            if (flowerEl && flowerEl.parentNode) {
                flowerEl.parentNode.removeChild(flowerEl);
            }
        }, parseFloat(fallDuration) * 1000 + 1000);
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