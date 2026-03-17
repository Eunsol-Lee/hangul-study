/**
 * speech.js — Web Speech API wrapper for Korean pronunciation
 * DO NOT MODIFY: This is a shared file used by all modules.
 *
 * Public API:
 *   Speech.speak(text)           — speak Korean text aloud
 *   Speech.isSupported()         — returns true if SpeechSynthesis is available
 *   Speech.setRate(rate)         — set speech rate (0.1–2.0, default 0.8 for children)
 *   Speech.setPitch(pitch)       — set pitch (0–2, default 1.2 for friendly tone)
 */

const Speech = (() => {
  let _rate = 0.8;    // slower pace for children
  let _pitch = 1.2;   // slightly higher pitch, more friendly
  let _voice = null;  // cached Korean voice

  /**
   * Find and cache the best available Korean voice.
   * Called lazily on first speak() call.
   */
  function _findKoreanVoice() {
    if (_voice) return _voice;
    const voices = window.speechSynthesis.getVoices();
    // Prefer Korean voice (ko-KR or ko)
    _voice = voices.find(v => v.lang === 'ko-KR')
          || voices.find(v => v.lang.startsWith('ko'))
          || null;
    return _voice;
  }

  /**
   * Speak the given text using Korean voice.
   * @param {string} text — Korean text to pronounce
   * @returns {void}
   */
  function speak(text) {
    if (!isSupported()) {
      console.warn('[Speech] SpeechSynthesis not supported in this browser.');
      return;
    }
    // Cancel any in-progress speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = _rate;
    utterance.pitch = _pitch;

    const voice = _findKoreanVoice();
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Check if SpeechSynthesis is available.
   * @returns {boolean}
   */
  function isSupported() {
    return 'speechSynthesis' in window;
  }

  /**
   * Set speech rate.
   * @param {number} rate — 0.1 to 2.0
   */
  function setRate(rate) {
    _rate = Math.max(0.1, Math.min(2.0, rate));
  }

  /**
   * Set speech pitch.
   * @param {number} pitch — 0 to 2
   */
  function setPitch(pitch) {
    _pitch = Math.max(0, Math.min(2, pitch));
  }

  // Re-detect voice when voices list loads (async on some browsers)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      _voice = null; // reset cache so next speak() re-detects
    };
  }

  return { speak, isSupported, setRate, setPitch };
})();
