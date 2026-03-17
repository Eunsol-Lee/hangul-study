/**
 * words.js — F03: 단어 학습 (Word learning)
 *
 * Responsibility:
 *   Display basic Korean words with emoji illustrations.
 *   Clicking a word card speaks the word aloud (F05).
 *   Supports category filtering (all, animal, food, nature, object).
 *   Child-friendly large emoji, colorful buttons, bounce animation (F06).
 *
 * Dependencies (globals loaded before this file):
 *   - HANGUL_DATA  (js/shared/data.js)
 *   - Speech       (js/shared/speech.js)
 *   - App          (js/shared/app.js)
 *
 * DOM contract (elements in #words section):
 *   #words-filter          — container for category filter buttons
 *   #words-grid            — container where word cards are rendered
 */

const WordsModule = (() => {
  const CATEGORIES = ['all', 'animal', 'food', 'nature', 'object'];

  // Labels with leading emoji for child-friendly recognition (F06)
  const CATEGORY_LABELS = {
    all:    '🌈 전체',
    animal: '🐾 동물',
    food:   '🍎 음식',
    nature: '🌿 자연',
    object: '📦 사물',
  };

  // Accent color class per category for colorful filter buttons (F06)
  const CATEGORY_COLOR = {
    all:    'filter-btn--all',
    animal: 'filter-btn--animal',
    food:   'filter-btn--food',
    nature: 'filter-btn--nature',
    object: 'filter-btn--object',
  };

  let _activeCategory = 'all';
  let _fadeTimer = null;

  /**
   * Initialize the module: render filter and word cards.
   * Called by App when navigating to 'words' section.
   */
  function init() {
    renderFilter();
    renderWords(_activeCategory, /* animate */ false);
  }

  /**
   * Render category filter buttons.
   */
  function renderFilter() {
    const container = document.getElementById('words-filter');
    if (!container) return;
    container.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn ' + CATEGORY_COLOR[cat];
      btn.setAttribute('data-category', cat);
      btn.setAttribute('aria-pressed', cat === _activeCategory ? 'true' : 'false');
      btn.textContent = CATEGORY_LABELS[cat];

      if (cat === _activeCategory) {
        btn.classList.add('filter-btn--active');
      }

      btn.addEventListener('click', () => {
        if (_activeCategory === cat) return; // no-op if already active
        _activeCategory = cat;

        // Update button states
        container.querySelectorAll('.filter-btn').forEach(b => {
          const isActive = b.getAttribute('data-category') === cat;
          b.classList.toggle('filter-btn--active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Animate transition: fade out → update → fade in
        filterWithFade(cat);
      });

      container.appendChild(btn);
    });
  }

  /**
   * Fade the grid out, swap content, fade back in.
   * @param {string} category
   */
  function filterWithFade(category) {
    const grid = document.getElementById('words-grid');
    if (!grid) return;

    // Cancel any pending fade
    if (_fadeTimer) {
      clearTimeout(_fadeTimer);
      _fadeTimer = null;
    }

    grid.classList.add('words-grid--fading');

    _fadeTimer = setTimeout(() => {
      renderWords(category, /* animate */ true);
      grid.classList.remove('words-grid--fading');
      _fadeTimer = null;
    }, 200); // matches CSS transition duration
  }

  /**
   * Render word cards filtered by category.
   * @param {string} category — 'all' or a specific category key
   * @param {boolean} animate — whether to stagger-animate new cards in
   */
  function renderWords(category, animate) {
    const grid = document.getElementById('words-grid');
    if (!grid) return;

    const items = category === 'all'
      ? HANGUL_DATA.words
      : HANGUL_DATA.words.filter(w => w.category === category);

    grid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('button');
      card.className = 'word-card word-card--' + item.category;
      card.setAttribute('aria-label', item.word + ': ' + item.meaning);
      card.setAttribute('type', 'button');

      card.innerHTML =
        '<span class="word-card__emoji" aria-hidden="true">' + item.emoji + '</span>' +
        '<span class="word-card__word">' + item.word + '</span>' +
        '<span class="word-card__meaning">' + item.meaning + '</span>';

      // F05: Speak word on tap
      card.addEventListener('click', () => {
        Speech.speak(item.word);
        animateCard(card);
      });

      // F06: Staggered fade-in for a playful entrance
      if (animate) {
        card.style.animationDelay = (index * 40) + 'ms';
        card.classList.add('word-card--enter');
        card.addEventListener('animationend', () => {
          card.classList.remove('word-card--enter');
          card.style.animationDelay = '';
        }, { once: true });
      }

      grid.appendChild(card);
    });
  }

  /**
   * Play a brief bounce animation on a card to give visual tap feedback (F06).
   * @param {HTMLElement} card
   */
  function animateCard(card) {
    // Remove first in case the user taps rapidly
    card.classList.remove('word-card--bounce');
    // Force reflow so removing + re-adding triggers the animation
    void card.offsetWidth;
    card.classList.add('word-card--bounce');
    card.addEventListener('animationend', () => {
      card.classList.remove('word-card--bounce');
    }, { once: true });
  }

  // Register navigation listener — init when words section becomes active
  if (typeof App !== 'undefined') {
    App.onNavigate((section) => {
      if (section === 'words') init();
    });
  }

  return { init };
})();
