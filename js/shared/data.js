/**
 * data.js — Shared Korean alphabet data and word lists
 * DO NOT MODIFY: This is a shared file used by all modules.
 *
 * Exports (globals):
 *   HANGUL_DATA.consonants  — array of consonant objects
 *   HANGUL_DATA.vowels      — array of vowel objects
 *   HANGUL_DATA.words       — array of word objects
 */

const HANGUL_DATA = {
  /**
   * 자음 (Consonants) — 14 basic consonants
   * Each: { char, name, romanization, emoji, exampleWord, exampleMeaning }
   */
  consonants: [
    { char: 'ㄱ', name: '기역', romanization: 'g/k', emoji: '🦒', exampleWord: '기린', exampleMeaning: 'giraffe' },
    { char: 'ㄴ', name: '니은', romanization: 'n',   emoji: '🦋', exampleWord: '나비', exampleMeaning: 'butterfly' },
    { char: 'ㄷ', name: '디귿', romanization: 'd/t', emoji: '🐰', exampleWord: '달', exampleMeaning: 'moon' },
    { char: 'ㄹ', name: '리을', romanization: 'r/l', emoji: '🦁', exampleWord: '라면', exampleMeaning: 'ramen' },
    { char: 'ㅁ', name: '미음', romanization: 'm',   emoji: '🐎', exampleWord: '말', exampleMeaning: 'horse' },
    { char: 'ㅂ', name: '비읍', romanization: 'b/p', emoji: '⭐', exampleWord: '별', exampleMeaning: 'star' },
    { char: 'ㅅ', name: '시옷', romanization: 's',   emoji: '🍎', exampleWord: '사과', exampleMeaning: 'apple' },
    { char: 'ㅇ', name: '이응', romanization: 'ng',  emoji: '🦆', exampleWord: '오리', exampleMeaning: 'duck' },
    { char: 'ㅈ', name: '지읒', romanization: 'j',   emoji: '🚗', exampleWord: '자동차', exampleMeaning: 'car' },
    { char: 'ㅊ', name: '치읓', romanization: 'ch',  emoji: '⚽', exampleWord: '축구', exampleMeaning: 'soccer' },
    { char: 'ㅋ', name: '키읔', romanization: 'k',   emoji: '🐘', exampleWord: '코끼리', exampleMeaning: 'elephant' },
    { char: 'ㅌ', name: '티읕', romanization: 't',   emoji: '🐯', exampleWord: '토끼', exampleMeaning: 'rabbit' },
    { char: 'ㅍ', name: '피읖', romanization: 'p',   emoji: '🎸', exampleWord: '피아노', exampleMeaning: 'piano' },
    { char: 'ㅎ', name: '히읗', romanization: 'h',   emoji: '☀️', exampleWord: '해', exampleMeaning: 'sun' },
  ],

  /**
   * 모음 (Vowels) — 10 basic vowels
   * Each: { char, name, romanization, emoji, exampleWord, exampleMeaning }
   */
  vowels: [
    { char: 'ㅏ', name: '아', romanization: 'a',  emoji: '👶', exampleWord: '아기', exampleMeaning: 'baby' },
    { char: 'ㅑ', name: '야', romanization: 'ya', emoji: '🐑', exampleWord: '야구', exampleMeaning: 'baseball' },
    { char: 'ㅓ', name: '어', romanization: 'eo', emoji: '🐟', exampleWord: '어항', exampleMeaning: 'fish tank' },
    { char: 'ㅕ', name: '여', romanization: 'yeo',emoji: '🦊', exampleWord: '여우', exampleMeaning: 'fox' },
    { char: 'ㅗ', name: '오', romanization: 'o',  emoji: '🦆', exampleWord: '오리', exampleMeaning: 'duck' },
    { char: 'ㅛ', name: '요', romanization: 'yo', emoji: '🐉', exampleWord: '용', exampleMeaning: 'dragon' },
    { char: 'ㅜ', name: '우', romanization: 'u',  emoji: '🐄', exampleWord: '우유', exampleMeaning: 'milk' },
    { char: 'ㅠ', name: '유', romanization: 'yu', emoji: '👻', exampleWord: '유령', exampleMeaning: 'ghost' },
    { char: 'ㅡ', name: '으', romanization: 'eu', emoji: '🎵', exampleWord: '음악', exampleMeaning: 'music' },
    { char: 'ㅣ', name: '이', romanization: 'i',  emoji: '🦷', exampleWord: '이빨', exampleMeaning: 'tooth' },
  ],

  /**
   * 기초 단어 (Basic Words) — for F03 word learning and F04 quiz
   * Each: { word, emoji, meaning, category }
   */
  words: [
    // Animals
    { word: '개', emoji: '🐶', meaning: 'dog',        category: 'animal' },
    { word: '고양이', emoji: '🐱', meaning: 'cat',    category: 'animal' },
    { word: '토끼', emoji: '🐰', meaning: 'rabbit',   category: 'animal' },
    { word: '곰', emoji: '🐻', meaning: 'bear',       category: 'animal' },
    { word: '사자', emoji: '🦁', meaning: 'lion',     category: 'animal' },
    { word: '코끼리', emoji: '🐘', meaning: 'elephant', category: 'animal' },
    { word: '기린', emoji: '🦒', meaning: 'giraffe',  category: 'animal' },
    { word: '오리', emoji: '🦆', meaning: 'duck',     category: 'animal' },
    { word: '나비', emoji: '🦋', meaning: 'butterfly', category: 'animal' },
    { word: '물고기', emoji: '🐟', meaning: 'fish',   category: 'animal' },
    // Food
    { word: '사과', emoji: '🍎', meaning: 'apple',    category: 'food' },
    { word: '바나나', emoji: '🍌', meaning: 'banana', category: 'food' },
    { word: '포도', emoji: '🍇', meaning: 'grapes',   category: 'food' },
    { word: '딸기', emoji: '🍓', meaning: 'strawberry', category: 'food' },
    { word: '수박', emoji: '🍉', meaning: 'watermelon', category: 'food' },
    { word: '우유', emoji: '🥛', meaning: 'milk',     category: 'food' },
    // Nature
    { word: '해', emoji: '☀️', meaning: 'sun',        category: 'nature' },
    { word: '달', emoji: '🌙', meaning: 'moon',       category: 'nature' },
    { word: '별', emoji: '⭐', meaning: 'star',       category: 'nature' },
    { word: '구름', emoji: '☁️', meaning: 'cloud',    category: 'nature' },
    { word: '꽃', emoji: '🌸', meaning: 'flower',     category: 'nature' },
    { word: '나무', emoji: '🌳', meaning: 'tree',     category: 'nature' },
    // Objects
    { word: '공', emoji: '⚽', meaning: 'ball',       category: 'object' },
    { word: '책', emoji: '📚', meaning: 'book',       category: 'object' },
    { word: '자동차', emoji: '🚗', meaning: 'car',    category: 'object' },
    { word: '집', emoji: '🏠', meaning: 'house',      category: 'object' },
  ],

  /**
   * 음절 조합 (Syllable combinations) — consonant + vowel pairs for F02
   * Generates combined syllable from consonant index + vowel index.
   *
   * Unicode formula:
   *   syllable = 가 (0xAC00) + (consonantIndex * 21 + vowelIndex) * 28
   */
  combineSyllable(consonantIndex, vowelIndex) {
    const base = 0xAC00;
    const code = base + (consonantIndex * 21 + vowelIndex) * 28;
    return String.fromCharCode(code);
  },
};
