/**
 * Studio EIM — Portfolio Module
 * Category filter, horizontal scroll keyboard nav, lazy load images
 */

'use strict';

/* ── Portfolio Category Filter ── */
class PortfolioFilter {
  constructor() {
    this.tabs = document.querySelectorAll('[data-filter]');
    this.cards = document.querySelectorAll('[data-category]');

    if (!this.tabs.length || !this.cards.length) return;
    this._bind();
  }

  _bind() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        // Update active tab
        this.tabs.forEach((t) => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });

        // Filter cards
        this.cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';

          if (match) {
            card.classList.remove('visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => card.classList.add('visible'));
            });
          }
        });
      });
    });
  }
}

/* ── Horizontal Scroll Keyboard Navigation ── */
class ScrollSnap {
  constructor() {
    this.container = document.querySelector('.portfolio-scroll');
    if (!this.container) return;

    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', '포트폴리오 가로 스크롤');

    this._bindKeys();
    this._bindDrag();
  }

  _bindKeys() {
    this.container.addEventListener('keydown', (e) => {
      const scrollAmount = 340; // card width + gap
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });
  }

  _bindDrag() {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    this.container.addEventListener('mousedown', (e) => {
      isDown = true;
      this.container.classList.add('dragging');
      startX = e.pageX - this.container.offsetLeft;
      scrollLeft = this.container.scrollLeft;
    });

    this.container.addEventListener('mouseleave', () => {
      isDown = false;
      this.container.classList.remove('dragging');
    });

    this.container.addEventListener('mouseup', () => {
      isDown = false;
      this.container.classList.remove('dragging');
    });

    this.container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.container.offsetLeft;
      const walk = (x - startX) * 1.5;
      this.container.scrollLeft = scrollLeft - walk;
    });
  }
}

/* ── Lazy Load Images ── */
class LazyLoadImages {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    if (!this.images.length) return;

    // Native lazy loading is sufficient for modern browsers
    // Add fade-in effect when images load
    this.images.forEach((img) => {
      if (img.complete) {
        img.classList.add('loaded');
        return;
      }
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.classList.add('loaded');
      }, { once: true });

      img.addEventListener('error', () => {
        img.style.opacity = '1';
        img.alt = img.alt || '이미지를 불러올 수 없습니다';
      }, { once: true });
    });
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioFilter();
  new ScrollSnap();
  new LazyLoadImages();
});
