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

        // DOM Elements
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.celebrationEl = document.getElementById('celebration-message');

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
    new CountdownApp();
});