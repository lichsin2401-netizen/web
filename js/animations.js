/**
 * Studio EIM — Scroll Animations
 * Staggered reveal, Counter animation
 */

'use strict';

/* ── Staggered Children Animation ── */
class StaggeredAnimation {
  constructor() {
    this.containers = document.querySelectorAll('.stagger-children');

    if (!this.containers.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.containers.forEach((c) =>
        c.querySelectorAll('.fade-in').forEach((el) => el.classList.add('visible'))
      );
      return;
    }

    this._observe();
  }

  _observe() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const children = entry.target.querySelectorAll('.fade-in:not(.visible)');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    this.containers.forEach((c) => observer.observe(c));
  }
}

/* ── Counter Animation ── */
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count-to]');

    if (!this.counters.length) return;
    this._observe();
  }

  _observe() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          this._animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach((el) => observer.observe(el));
  }

  _animate(el) {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;

    /* 자식 요소(예: <span>년</span>) 보존 */
    const hasChildren = el.children.length > 0;
    const childrenHTML = hasChildren
      ? [...el.children].map((c) => c.outerHTML).join('')
      : '';

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (hasChildren) {
        el.innerHTML = Math.floor(current).toLocaleString() + childrenHTML;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, stepTime);
  }
}

/* ── Marquee Pause on Hover ── */
class MarqueePause {
  constructor() {
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach((track) => {
      const parent = track.closest('.marquee-container') || track.parentElement;
      parent.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      parent.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    });
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  new StaggeredAnimation();
  new CounterAnimation();
  new MarqueePause();
});
