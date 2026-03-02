/**
 * Studio EIM — Mouse Interactions
 * 3D Tilt, Parallax, Hover Zoom, Magnetic Buttons, Text Proximity
 */

'use strict';

/* ── Mouse Tracker (singleton) ── */
class MouseTracker {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.listeners = [];

    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.listeners.forEach((fn) => fn(this.x, this.y));
    }, { passive: true });
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
}

/* ── 3D Tilt Effect ── */
class TiltEffect {
  constructor(mouse) {
    this.mouse = mouse;
    this.cards = document.querySelectorAll('[data-mouse-track]');
    this.MAX_ROTATE = 8; // degrees

    if (!this.cards.length || document.body.classList.contains('touch-device')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this._bind();
  }

  _bind() {
    this.cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);

        const rotateY = percentX * this.MAX_ROTATE;
        const rotateX = -percentY * this.MAX_ROTATE;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1))';
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }
}

/* ── Parallax Scroll ── */
class ParallaxScroll {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.ticking = false;

    if (!this.elements.length || document.body.classList.contains('touch-device')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => this._onScroll(), { passive: true });
    this._onScroll();
  }

  _onScroll() {
    if (this.ticking) return;
    this.ticking = true;

    requestAnimationFrame(() => {
      this.elements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;

        if (rect.top < viewH && rect.bottom > 0) {
          const center = rect.top + rect.height / 2 - viewH / 2;
          const offset = center * speed * -1;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
      this.ticking = false;
    });
  }
}

/* ── Magnetic Buttons ── */
class MagneticButtons {
  constructor(mouse) {
    this.mouse = mouse;
    this.buttons = document.querySelectorAll('.btn-magnetic');
    this.RANGE = 80; // px activation radius

    if (!this.buttons.length || document.body.classList.contains('touch-device')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this._bind();
  }

  _bind() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.RANGE) {
          const pull = 1 - dist / this.RANGE;
          const moveX = dx * pull * 0.3;
          const moveY = dy * pull * 0.3;
          btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.4s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1))';
        btn.style.transform = 'translate(0, 0)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }
}

/* ── Text Proximity Highlight ── */
class TextProximity {
  constructor(mouse) {
    this.mouse = mouse;
    this.elements = document.querySelectorAll('.text-proximity');
    this.RADIUS = 200;

    if (!this.elements.length || document.body.classList.contains('touch-device')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.mouse.subscribe((mx, my) => this._update(mx, my));
  }

  _update(mx, my) {
    this.elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);

      if (dist < this.RADIUS) {
        const intensity = 1 - dist / this.RADIUS;
        el.style.opacity = 0.4 + intensity * 0.6;
        el.style.transform = `scale(${1 + intensity * 0.05})`;
      } else {
        el.style.opacity = '';
        el.style.transform = '';
      }
    });
  }
}

/* ── Initialize All Interactions ── */
document.addEventListener('DOMContentLoaded', () => {
  const mouse = new MouseTracker();

  new TiltEffect(mouse);
  new ParallaxScroll();
  new MagneticButtons(mouse);
  new TextProximity(mouse);
});
