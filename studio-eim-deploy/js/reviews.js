/**
 * Studio EIM — Reviews Page Controller
 * Category filter for review cards
 */

'use strict';

class ReviewFilter {
  constructor() {
    this.buttons = document.querySelectorAll('.review-filter-btn');
    this.cards = document.querySelectorAll('.review-card[data-category]');

    if (!this.buttons.length || !this.cards.length) return;

    this._bind();
  }

  _bind() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        this.buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards with animation
        this._filterCards(filter);
      });
    });
  }

  _filterCards(filter) {
    let delay = 0;

    this.cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';

        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay);

        delay += 60;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';

        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ReviewFilter();
});
