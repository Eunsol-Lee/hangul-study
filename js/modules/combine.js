/**
 * combine.js — F02: 음절 조합 연습 (Syllable combination practice)
 *
 * Responsibility:
 *   Let children pick a consonant and a vowel to see the combined syllable.
 *   Example: ㄱ + ㅏ = 가
 *   Speaks the resulting syllable on each combination (F05).
 *   Large buttons, bright colors, fun animations for kids (F06).
 *
 * Dependencies (globals loaded before this file):
 *   - HANGUL_DATA  (js/shared/data.js)
 *   - Speech       (js/shared/speech.js)
 *   - App          (js/shared/app.js)
 *
 * DOM contract (elements in #combine section):
 *   #combine-consonants    — container for consonant selector buttons
 *   #combine-vowels        — container for vowel selector buttons
 *   #combine-result-char   — <span> showing the combined syllable
 *   #combine-result-label  — <span> showing "ㄱ + ㅏ = 가" formula
 *   #combine-speak-btn     — button to re-speak the current result
 */

const CombineModule = (() => {
  let _selectedConsonantIdx = null; // index into HANGUL_DATA.consonants
  let _selectedVowelIdx = null;     // index into HANGUL_DATA.vowels
  let _initialized = false;

  /**
   * Initialize the module: render selectors and reset state.
   * Called by App when navigating to 'combine' section.
   */
  function init() {
    // Mark selector wrappers with modifier classes for color-coded labels
    _markSelectorGroups();
    renderConsonants();
    renderVowels();
    resetResult();

    // Attach speak button listener only once
    if (!_initialized) {
      const speakBtn = document.getElementById('combine-speak-btn');
      if (speakBtn) speakBtn.addEventListener('click', speakCurrent);
      _initialized = true;
    }
  }

  /**
   * Add modifier classes to the two .combine-selector wrappers so CSS can
   * apply distinct colors without modifying index.html.
   */
  function _markSelectorGroups() {
    const cContainer = document.getElementById('combine-consonants');
    const vContainer = document.getElementById('combine-vowels');
    if (cContainer) {
      const wrapper = cContainer.closest('.combine-selector');
      if (wrapper) wrapper.classList.add('combine-selector--consonant');
    }
    if (vContainer) {
      const wrapper = vContainer.closest('.combine-selector');
      if (wrapper) wrapper.classList.add('combine-selector--vowel');
    }
  }

  /**
   * Render consonant selector buttons.
   * Uses coral/red color group (--color-primary family) via CSS class.
   */
  function renderConsonants() {
    const container = document.getElementById('combine-consonants');
    if (!container) return;
    container.innerHTML = '';
    HANGUL_DATA.consonants.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = 'combine-selector__btn combine-selector__btn--consonant';
      btn.textContent = item.char;
      btn.setAttribute('aria-label', item.name + ' ' + item.romanization);
      btn.dataset.idx = idx;
      btn.addEventListener('click', () => selectConsonant(idx));
      container.appendChild(btn);
    });
  }

  /**
   * Render vowel selector buttons.
   * Uses turquoise/teal color group (--color-secondary family) via CSS class.
   */
  function renderVowels() {
    const container = document.getElementById('combine-vowels');
    if (!container) return;
    container.innerHTML = '';
    HANGUL_DATA.vowels.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = 'combine-selector__btn combine-selector__btn--vowel';
      btn.textContent = item.char;
      btn.setAttribute('aria-label', item.name + ' ' + item.romanization);
      btn.dataset.idx = idx;
      btn.addEventListener('click', () => selectVowel(idx));
      container.appendChild(btn);
    });
  }

  /**
   * Handle consonant selection.
   * @param {number} idx
   */
  function selectConsonant(idx) {
    _selectedConsonantIdx = idx;
    // Update active state — only consonant buttons
    document.querySelectorAll('#combine-consonants .combine-selector__btn').forEach((btn, i) => {
      btn.classList.toggle('combine-selector__btn--active', i === idx);
    });
    tryUpdateResult();
  }

  /**
   * Handle vowel selection.
   * @param {number} idx
   */
  function selectVowel(idx) {
    _selectedVowelIdx = idx;
    document.querySelectorAll('#combine-vowels .combine-selector__btn').forEach((btn, i) => {
      btn.classList.toggle('combine-selector__btn--active', i === idx);
    });
    tryUpdateResult();
  }

  /**
   * If both consonant and vowel are selected, combine and display the syllable.
   * Triggers animation and speech (F05, F06).
   */
  function tryUpdateResult() {
    if (_selectedConsonantIdx === null || _selectedVowelIdx === null) return;

    const consonant = HANGUL_DATA.consonants[_selectedConsonantIdx];
    const vowel = HANGUL_DATA.vowels[_selectedVowelIdx];
    const syllable = HANGUL_DATA.combineSyllable(_selectedConsonantIdx, _selectedVowelIdx);

    const resultChar  = document.getElementById('combine-result-char');
    const resultLabel = document.getElementById('combine-result-label');

    if (resultChar) {
      resultChar.textContent = syllable;
      // Remove then re-add animation class to retrigger it
      resultChar.classList.remove('combine-result__char--pop');
      // Force reflow so the animation restarts
      void resultChar.offsetWidth;
      resultChar.classList.add('combine-result__char--pop');
    }

    if (resultLabel) {
      resultLabel.textContent = `${consonant.char} + ${vowel.char} = ${syllable}`;
    }

    // F05: pronounce the combined syllable
    Speech.speak(syllable);

    // Show speak button active state briefly
    const speakBtn = document.getElementById('combine-speak-btn');
    if (speakBtn) {
      speakBtn.classList.add('combine-speak-btn--active');
      setTimeout(() => speakBtn.classList.remove('combine-speak-btn--active'), 600);
    }

    // Animate the result area
    const resultBox = document.querySelector('.combine-result');
    if (resultBox) {
      resultBox.classList.remove('combine-result--glow');
      void resultBox.offsetWidth;
      resultBox.classList.add('combine-result--glow');
    }
  }

  /**
   * Reset the result display before any selection is made.
   */
  function resetResult() {
    _selectedConsonantIdx = null;
    _selectedVowelIdx = null;

    // Clear active states
    document.querySelectorAll('#combine-consonants .combine-selector__btn').forEach(btn => {
      btn.classList.remove('combine-selector__btn--active');
    });
    document.querySelectorAll('#combine-vowels .combine-selector__btn').forEach(btn => {
      btn.classList.remove('combine-selector__btn--active');
    });

    const resultChar  = document.getElementById('combine-result-char');
    const resultLabel = document.getElementById('combine-result-label');
    if (resultChar) {
      resultChar.textContent = '?';
      resultChar.classList.remove('combine-result__char--pop');
    }
    if (resultLabel) resultLabel.textContent = '자음과 모음을 골라보세요!';
  }

  /**
   * Speak the currently displayed syllable. (F05)
   */
  function speakCurrent() {
    const resultChar = document.getElementById('combine-result-char');
    if (resultChar && resultChar.textContent !== '?') {
      Speech.speak(resultChar.textContent);

      // Visual feedback on the speak button
      const speakBtn = document.getElementById('combine-speak-btn');
      if (speakBtn) {
        speakBtn.classList.add('combine-speak-btn--active');
        setTimeout(() => speakBtn.classList.remove('combine-speak-btn--active'), 600);
      }
    }
  }

  if (typeof App !== 'undefined') {
    App.onNavigate((section) => {
      if (section === 'combine') init();
    });
  }

  return { init };
})();
