/**
 * Studio EIM — Main Application Controller
 * Navigation, scroll effects, smooth scrolling, mobile menu, touch detection
 */

'use strict';

class EIMApp {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.sections = document.querySelectorAll('section[id]');
    this.fadeEls = document.querySelectorAll('.fade-in');

    this.scrollY = 0;
    this.ticking = false;
    this.isMenuOpen = false;
    this.SCROLL_THRESHOLD = 60;

    this._init();
  }

  _init() {
    this._detectTouch();
    this._bindNavScroll();
    this._bindSmoothScroll();
    this._bindMobileMenu();
    this._bindDropdown();
    this._bindLangSwitcher();
    this._initFadeObserver();
    this._bindActiveSection();

    document.documentElement.classList.add('js-loaded');
  }

  /* ── Touch Detection ── */
  _detectTouch() {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      document.body.classList.add('touch-device');
    }
  }

  /* ── Navigation Scroll Effect ── */
  _bindNavScroll() {
    const onScroll = () => {
      this.scrollY = window.scrollY;
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this._updateNav();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this._updateNav(); // initial state
  }

  _updateNav() {
    if (!this.nav) return;

    if (this.scrollY > this.SCROLL_THRESHOLD) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  /* ── Smooth Scroll for Anchor Links ── */
  _bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        if (this.isMenuOpen) {
          this._closeMenu();
        }

        const navHeight = this.nav ? this.nav.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });

        // Update URL without triggering scroll
        history.pushState(null, '', targetId);
      });
    });
  }

  /* ── Mobile Hamburger Menu ── */
  _bindMobileMenu() {
    if (!this.navToggle || !this.navMenu) return;

    this.navToggle.addEventListener('click', () => {
      this.isMenuOpen ? this._closeMenu() : this._openMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this._closeMenu();
        this.navToggle.focus();
      }
    });

    // Close when clicking outside
    this.navMenu.addEventListener('click', (e) => {
      if (e.target === this.navMenu) {
        this._closeMenu();
      }
    });
  }

  _openMenu() {
    this.isMenuOpen = true;
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.navMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  _closeMenu() {
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Dropdown (touch/click fallback for mobile) ── */
  _bindDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    // On touch devices, toggle dropdown on click
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return; // desktop uses CSS hover
      e.preventDefault();
      menu.classList.toggle('show');
    });

    // Close dropdown when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }

  /* ── Language Switcher ── */
  _bindLangSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const btn = switcher.querySelector('.lang-current');
    const menu = switcher.querySelector('.lang-menu');
    const links = menu.querySelectorAll('a[data-lang]');

    // Toggle menu on click (touch-friendly)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.dataset.lang;

        // Update active state
        links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        // Update button text
        btn.textContent = lang.toUpperCase();

        // Close menu
        menu.classList.remove('show');

        // Dispatch custom event for i18n system
        document.dispatchEvent(
          new CustomEvent('langChange', { detail: { lang } })
        );
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }

  /* ── Fade-In on Scroll (IntersectionObserver) ── */
  _initFadeObserver() {
    if (!this.fadeEls.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      this.fadeEls.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    this.fadeEls.forEach((el) => observer.observe(el));
  }

  /* ── Active Section Highlight in Nav ── */
  _bindActiveSection() {
    if (!this.sections.length || !this.navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px',
      }
    );

    this.sections.forEach((section) => observer.observe(section));
  }
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  window.eimApp = new EIMApp();
});
