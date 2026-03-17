/**
 * cards.js — F01: 자음/모음 카드 학습
 *
 * Responsibility:
 *   Render consonant (자음) and vowel (모음) flashcards in #cards section.
 *   Clicking a card speaks the character name and shows an example word + emoji.
 *
 * Dependencies (globals loaded before this file):
 *   - HANGUL_DATA  (js/shared/data.js)
 *   - Speech       (js/shared/speech.js)
 *   - App          (js/shared/app.js)
 *
 * DOM contract (elements that must exist in index.html #cards section):
 *   #cards-tab-consonants  — button to switch to consonant view
 *   #cards-tab-vowels      — button to switch to vowel view
 *   #cards-grid            — container where cards are rendered
 *   #card-detail           — overlay/panel showing card detail (char, name, example)
 *   #card-detail-close     — button to close the detail panel
 *
 * Features:
 *   F01 — colorful flashcards with tab switching (consonants / vowels)
 *   F05 — Speech.speak() on card open and "듣기" button in detail overlay
 *   F06 — large touch targets, bright cycling colors, bounce/wiggle animations
 */

const CardsModule = (() => {
  // Currently displayed set: 'consonants' | 'vowels'
  let _activeTab = 'consonants';
  let _initialized = false;

  // Color palette for card backgrounds (cycles through all cards)
  const CARD_COLORS = [
    '#FF6B6B', // coral red
    '#4ECDC4', // turquoise
    '#FFE66D', // yellow
    '#A78BFA', // soft purple
    '#6BCB77', // leaf green
    '#FF9F43', // orange
    '#54A0FF', // sky blue
    '#FF6FA8', // pink
    '#26de81', // mint green
    '#fd9644', // warm orange
    '#45aaf2', // light blue
    '#a55eea', // violet
    '#2bcbba', // teal
    '#fc5c65', // red
  ];

  // Lighter text-contrast backgrounds for card hover state
  const CARD_COLORS_DARK = [
    '#e05555',
    '#3ab3ab',
    '#f0d550',
    '#9070e8',
    '#54b862',
    '#e88c30',
    '#3d8de8',
    '#e85090',
    '#1db06a',
    '#e07c30',
    '#3090d8',
    '#9048cc',
    '#1dada0',
    '#e04550',
  ];

  /**
   * Initialize the module.
   * Attaches event listeners and renders the default tab.
   * Only fully initializes once; re-entering just re-renders the current tab.
   */
  function init() {
    const tabConsonants = document.getElementById('cards-tab-consonants');
    const tabVowels = document.getElementById('cards-tab-vowels');
    const closeBtn = document.getElementById('card-detail-close');

    if (!_initialized) {
      if (tabConsonants) tabConsonants.addEventListener('click', () => showTab('consonants'));
      if (tabVowels)     tabVowels.addEventListener('click',     () => showTab('vowels'));
      if (closeBtn)      closeBtn.addEventListener('click',      hideDetail);

      // Close detail on backdrop click (clicking overlay but not inner card)
      const detailOverlay = document.getElementById('card-detail');
      if (detailOverlay) {
        detailOverlay.addEventListener('click', (e) => {
          if (e.target === detailOverlay) hideDetail();
        });
      }

      // Inject "듣기" (listen) button into detail overlay if not already present (F05)
      _injectListenButton();

      _initialized = true;
    }

    showTab(_activeTab);
  }

  /**
   * Inject a "듣기" listen button into the #card-detail overlay.
   * This allows the child to replay pronunciation at any time (F05).
   */
  function _injectListenButton() {
    const detail = document.getElementById('card-detail');
    if (!detail) return;
    // Avoid duplicate injection
    if (detail.querySelector('.card-detail__listen-btn')) return;

    const innerCard = detail.querySelector('.overlay__card');
    if (!innerCard) return;

    const listenBtn = document.createElement('button');
    listenBtn.className = 'card-detail__listen-btn';
    listenBtn.setAttribute('aria-label', '발음 듣기');
    listenBtn.innerHTML = '🔊 듣기';

    // Insert before the close button
    const closeBtn = detail.querySelector('.card-detail__close-btn');
    if (closeBtn) {
      innerCard.insertBefore(listenBtn, closeBtn);
    } else {
      innerCard.appendChild(listenBtn);
    }

    // Speak current detail char+word on click
    listenBtn.addEventListener('click', () => {
      const charEl = detail.querySelector('.card-detail__char');
      const wordEl = detail.querySelector('.card-detail__word');
      if (charEl && wordEl) {
        Speech.speak(charEl.textContent + ' ' + wordEl.textContent);
      }
    });
  }

  /**
   * Switch between consonant and vowel card sets.
   * @param {'consonants'|'vowels'} tab
   */
  function showTab(tab) {
    _activeTab = tab;

    // Update tab button active state
    document.getElementById('cards-tab-consonants')?.classList.toggle('tab--active', tab === 'consonants');
    document.getElementById('cards-tab-vowels')?.classList.toggle('tab--active', tab === 'vowels');

    const items = tab === 'consonants' ? HANGUL_DATA.consonants : HANGUL_DATA.vowels;
    renderCards(items);
  }

  /**
   * Render an array of consonant/vowel items as cards in #cards-grid.
   * Each card gets a distinct background color from CARD_COLORS palette.
   * @param {Array<{char, name, romanization, emoji, exampleWord, exampleMeaning}>} items
   */
  function renderCards(items) {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    grid.innerHTML = '';

    items.forEach((item, index) => {
      const colorIndex = index % CARD_COLORS.length;
      const bgColor = CARD_COLORS[colorIndex];
      const bgDark  = CARD_COLORS_DARK[colorIndex];

      const card = document.createElement('button');
      card.className = 'hangul-card';
      card.setAttribute('aria-label', `${item.char} ${item.name} ${item.exampleWord}`);
      // Set CSS custom properties for per-card color (used by hover state too)
      card.style.setProperty('--card-color', bgColor);
      card.style.setProperty('--card-color-dark', bgDark);
      card.style.background = bgColor;

      card.innerHTML = `
        <span class="hangul-card__char">${item.char}</span>
        <span class="hangul-card__name">${item.name}</span>
        <span class="hangul-card__emoji">${item.emoji}</span>
      `;

      // Play bounce animation and speak on click
      card.addEventListener('click', () => {
        card.classList.remove('hangul-card--bounce');
        // Force reflow to restart animation
        void card.offsetWidth;
        card.classList.add('hangul-card--bounce');
        onCardClick(item, card);
      });

      // Remove animation class when done so it can be replayed
      card.addEventListener('animationend', () => {
        card.classList.remove('hangul-card--bounce');
      });

      grid.appendChild(card);
    });

    // Stagger fade-in animation for cards
    _animateCardsIn(grid);
  }

  /**
   * Animate cards fading in with a staggered delay for a playful entrance.
   * @param {HTMLElement} grid
   */
  function _animateCardsIn(grid) {
    const cards = grid.querySelectorAll('.hangul-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.7) translateY(20px)';
      card.style.transition = 'none';

      // Use requestAnimationFrame to stagger entry
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        }, i * 40); // 40ms stagger per card
      });
    });
  }

  /**
   * Handle card click: speak the character name and show detail panel.
   * @param {{char, name, romanization, emoji, exampleWord, exampleMeaning}} item
   * @param {HTMLElement} cardEl — the clicked card element
   */
  function onCardClick(item, cardEl) {
    // F05: speak character name immediately
    Speech.speak(item.name);
    showDetail(item);
  }

  /**
   * Show the detail overlay for a card.
   * Populates the overlay with character info and schedules pronunciation of the example word.
   * @param {{char, name, romanization, emoji, exampleWord, exampleMeaning}} item
   */
  function showDetail(item) {
    const detail = document.getElementById('card-detail');
    if (!detail) return;

    const charEl  = detail.querySelector('.card-detail__char');
    const nameEl  = detail.querySelector('.card-detail__name');
    const emojiEl = detail.querySelector('.card-detail__emoji');
    const wordEl  = detail.querySelector('.card-detail__word');

    if (charEl)  charEl.textContent  = item.char;
    if (nameEl)  nameEl.textContent  = item.name;
    if (emojiEl) emojiEl.textContent = item.emoji;
    if (wordEl)  wordEl.textContent  = item.exampleWord;

    // Add romanization as a subtitle if element exists, else create it
    let romanEl = detail.querySelector('.card-detail__romanization');
    if (!romanEl) {
      romanEl = document.createElement('span');
      romanEl.className = 'card-detail__romanization';
      // Insert after name element
      if (nameEl && nameEl.nextSibling) {
        nameEl.parentNode.insertBefore(romanEl, nameEl.nextSibling);
      } else if (nameEl) {
        nameEl.parentNode.appendChild(romanEl);
      }
    }
    romanEl.textContent = `[${item.romanization}]`;

    // Add meaning label
    let meaningEl = detail.querySelector('.card-detail__meaning');
    if (!meaningEl) {
      meaningEl = document.createElement('span');
      meaningEl.className = 'card-detail__meaning';
      // Insert after word element
      if (wordEl && wordEl.nextSibling) {
        wordEl.parentNode.insertBefore(meaningEl, wordEl.nextSibling);
      } else if (wordEl) {
        wordEl.parentNode.appendChild(meaningEl);
      }
    }
    meaningEl.textContent = item.exampleMeaning;

    // Show overlay with animation (remove hidden, add animate class)
    detail.classList.remove('hidden');
    detail.classList.add('cards-detail--visible');

    // Animate the inner card popping in
    const innerCard = detail.querySelector('.overlay__card');
    if (innerCard) {
      innerCard.classList.remove('card-detail--pop');
      void innerCard.offsetWidth; // reflow
      innerCard.classList.add('card-detail--pop');
    }

    // F05: Speak the example word after a short delay (let name speech finish first)
    setTimeout(() => Speech.speak(item.exampleWord), 1000);
  }

  /**
   * Hide the detail overlay.
   */
  function hideDetail() {
    const detail = document.getElementById('card-detail');
    if (!detail) return;
    detail.classList.add('hidden');
    detail.classList.remove('cards-detail--visible');
    // Cancel any ongoing speech when closing
    if (typeof Speech !== 'undefined' && Speech.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  // Listen for navigation events to init when this section becomes active
  if (typeof App !== 'undefined') {
    App.onNavigate((section) => {
      if (section === 'cards') init();
    });
  }

  return { init, showTab };
})();
