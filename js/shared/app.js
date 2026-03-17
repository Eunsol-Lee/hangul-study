/**
 * app.js — Navigation / routing between sections (Single Page Application)
 * DO NOT MODIFY: This is a shared file used by all modules.
 *
 * Public API:
 *   App.navigate(sectionId)      — show a section, hide all others
 *   App.currentSection()         — returns id of the currently visible section
 *   App.onNavigate(callback)     — register a listener called on every navigation
 *                                   callback signature: (newSectionId, prevSectionId) => void
 *
 * Section IDs (must match id attributes in index.html):
 *   'home'    — home / menu screen
 *   'cards'   — F01: 자음/모음 카드 학습
 *   'combine' — F02: 음절 조합 연습
 *   'words'   — F03: 단어 학습
 *   'quiz'    — F04: 퀴즈 게임
 */

const App = (() => {
  const SECTIONS = ['home', 'cards', 'combine', 'words', 'quiz'];
  let _current = 'home';
  const _listeners = [];

  /**
   * Show the requested section and hide all others.
   * @param {string} sectionId — one of the SECTIONS ids
   */
  function navigate(sectionId) {
    if (!SECTIONS.includes(sectionId)) {
      console.warn(`[App] Unknown section: "${sectionId}"`);
      return;
    }
    const prev = _current;
    _current = sectionId;

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === sectionId) {
        el.classList.remove('hidden');
        el.setAttribute('aria-hidden', 'false');
      } else {
        el.classList.add('hidden');
        el.setAttribute('aria-hidden', 'true');
      }
    });

    // Notify listeners
    _listeners.forEach(cb => {
      try { cb(sectionId, prev); } catch (e) { console.error('[App] Navigation listener error:', e); }
    });
  }

  /**
   * Returns the id of the currently visible section.
   * @returns {string}
   */
  function currentSection() {
    return _current;
  }

  /**
   * Register a callback to be called whenever navigation occurs.
   * @param {function} callback — (newSectionId: string, prevSectionId: string) => void
   */
  function onNavigate(callback) {
    if (typeof callback === 'function') {
      _listeners.push(callback);
    }
  }

  /**
   * Initialize the app: attach nav button listeners and show the home section.
   * Called automatically when the DOM is ready.
   */
  function _init() {
    // Wire up any element with data-nav="<sectionId>" attribute
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => navigate(el.dataset.nav));
    });
    // Show home section on startup
    navigate('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  return { navigate, currentSection, onNavigate };
})();
