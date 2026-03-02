/**
 * Studio EIM — i18n Internationalization System
 * Supports: ko, en, ja, zh, de
 * Uses data-i18n attributes for text replacement
 * Uses data-i18n-placeholder for input placeholders
 * Uses data-i18n-aria for aria-label
 */

'use strict';

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('eim-lang') || 'ko';
    this.translations = {};
    this.fallbackLang = 'ko';
    this.switcher = document.getElementById('langSwitcher');
    this.currentBtn = null;
    this.langMenu = null;

    if (this.switcher) {
      this.currentBtn = this.switcher.querySelector('.lang-current');
      this.langMenu = this.switcher.querySelector('.lang-menu');
    }

    this._init();
  }

  async _init() {
    // Load fallback first
    await this._loadTranslation(this.fallbackLang);

    // Load current language if different
    if (this.currentLang !== this.fallbackLang) {
      await this._loadTranslation(this.currentLang);
    }

    this._applyTranslations();
    this._bindSwitcher();
    this._updateSwitcherUI();
    this._updateHtmlLang();
  }

  async _loadTranslation(lang) {
    if (this.translations[lang]) return;

    try {
      const resp = await fetch(`locales/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.translations[lang] = await resp.json();
    } catch (err) {
      console.warn(`[i18n] Failed to load ${lang}.json:`, err.message);
      this.translations[lang] = {};
    }
  }

  _t(key) {
    const langData = this.translations[this.currentLang] || {};
    const fallbackData = this.translations[this.fallbackLang] || {};

    // Support nested keys: "nav.about" → translations.nav.about
    const resolve = (obj, path) => {
      return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    };

    return resolve(langData, key) || resolve(fallbackData, key) || key;
  }

  _applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const text = this._t(key);
      if (text !== key) {
        el.textContent = text;
      }
    });

    // HTML content (for formatted text, converts \n to <br>)
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      const html = this._t(key);
      if (html !== key) {
        el.innerHTML = html.replace(/\n/g, '<br>');
      }
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const text = this._t(key);
      if (text !== key) {
        el.placeholder = text;
      }
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      const text = this._t(key);
      if (text !== key) {
        el.setAttribute('aria-label', text);
      }
    });

    // Page title
    const pageTitle = this._t('meta.title');
    if (pageTitle !== 'meta.title') {
      document.title = pageTitle;
    }

    // Meta description
    const pageDesc = this._t('meta.description');
    if (pageDesc !== 'meta.description') {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);
    }
  }

  _bindSwitcher() {
    if (!this.langMenu) return;

    this.langMenu.querySelectorAll('a[data-lang]').forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const lang = link.dataset.lang;
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        localStorage.setItem('eim-lang', lang);

        await this._loadTranslation(lang);
        this._applyTranslations();
        this._updateSwitcherUI();
        this._updateHtmlLang();
      });
    });
  }

  _updateSwitcherUI() {
    if (!this.currentBtn || !this.langMenu) return;

    const labels = { ko: 'KO', en: 'EN', ja: 'JA', zh: 'ZH', de: 'DE' };
    this.currentBtn.textContent = labels[this.currentLang] || 'KO';

    this.langMenu.querySelectorAll('a[data-lang]').forEach((link) => {
      link.classList.toggle('active', link.dataset.lang === this.currentLang);
    });
  }

  _updateHtmlLang() {
    document.documentElement.lang = this.currentLang;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.eimI18n = new I18n();
});
