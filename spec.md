# Spec: hangul-study

## Overview
- **Description**: 미취학 아이를 위한 한글 공부 앱
- **Stack**: HTML/CSS/JS (vanilla, no frameworks)
- **Complexity**: Medium

## Features
- [x] F01: 자음/모음 카드 학습 — DONE
- [x] F02: 음절 조합 연습 — DONE
- [x] F03: 단어 학습 — DONE
- [x] F04: 퀴즈 게임 — DONE
- [x] F05: 음성 발음 지원 — DONE
- [x] F06: 아이 친화적 UI — DONE

## Non-Functional
- [x] NF01: Project structure and file organization — DONE
- [x] NF02: README with setup/run instructions — DONE
- [x] NF03: No hardcoded secrets or credentials — DONE
- [x] NF04: App runs without errors — DONE

## Architecture

### Module Map
```
hangul-study/
├── index.html                  # Entry point; SPA shell with all <section> elements
├── css/
│   ├── main.css                # [SHARED] Design tokens, reset, layout, animations
│   ├── cards.css               # [F01] cards.js builder owns this
│   ├── combine.css             # [F02] combine.js builder owns this
│   ├── words.css               # [F03] words.js builder owns this
│   └── quiz.css                # [F04] quiz.js builder owns this
└── js/
    ├── shared/
    │   ├── data.js             # [SHARED] HANGUL_DATA: consonants, vowels, words, combineSyllable()
    │   ├── speech.js           # [SHARED] Speech: speak(), isSupported(), setRate(), setPitch()
    │   └── app.js              # [SHARED] App: navigate(), currentSection(), onNavigate()
    └── modules/
        ├── cards.js            # [F01] CardsModule — 자음/모음 flashcard learning
        ├── combine.js          # [F02] CombineModule — syllable combination practice
        ├── words.js            # [F03] WordsModule — word learning with emoji
        └── quiz.js             # [F04] QuizModule — picture quiz game
```

### Shared Files (builders MUST NOT modify)
The following files are shared infrastructure. Feature module builders must not modify them.
If a change to shared files is needed, coordinate across all modules.

| File | Why shared |
|------|-----------|
| `index.html` | Defines all `<section id="...">` DOM contracts relied upon by every module |
| `css/main.css` | CSS custom properties (design tokens) used by all module stylesheets |
| `js/shared/data.js` | Single source of truth for all Korean data |
| `js/shared/speech.js` | Single Web Speech API wrapper; avoids multiple simultaneous utterances |
| `js/shared/app.js` | SPA navigation; all modules register via `App.onNavigate()` |

### Interfaces

#### Navigation (app.js)
```js
// Navigate to a section by id. Valid ids: 'home' | 'cards' | 'combine' | 'words' | 'quiz'
App.navigate(sectionId: string): void

// Get the currently visible section id
App.currentSection(): string

// Register a callback fired on every navigation event
App.onNavigate(callback: (newSectionId: string, prevSectionId: string) => void): void
```
Modules must use `App.onNavigate` to detect when their section becomes active:
```js
App.onNavigate((section) => { if (section === 'mySection') MyModule.init(); });
```

#### Speech (speech.js)
```js
Speech.speak(text: string): void      // Speak Korean text; cancels any in-progress speech
Speech.isSupported(): boolean         // Check browser support before calling speak()
Speech.setRate(rate: number): void    // 0.1–2.0, default 0.8
Speech.setPitch(pitch: number): void  // 0–2, default 1.2
```

#### Data (data.js)
```js
// Consonant / vowel item shape
{
  char: string,           // e.g. 'ㄱ'
  name: string,           // e.g. '기역'
  romanization: string,   // e.g. 'g/k'
  emoji: string,          // e.g. '🦒'
  exampleWord: string,    // e.g. '기린'
  exampleMeaning: string, // e.g. 'giraffe'
}

// Word item shape
{
  word: string,      // e.g. '사과'
  emoji: string,     // e.g. '🍎'
  meaning: string,   // e.g. 'apple'
  category: string,  // 'animal' | 'food' | 'nature' | 'object'
}

HANGUL_DATA.consonants: ConsonantItem[]      // 14 items
HANGUL_DATA.vowels: VowelItem[]              // 10 items
HANGUL_DATA.words: WordItem[]                // 26+ items
HANGUL_DATA.combineSyllable(cIdx: number, vIdx: number): string  // returns e.g. '가'
```

#### DOM Contracts (index.html section ids)
Each module owns the elements inside its `<section>` and must not touch other sections.

| Module | Section id | Key element ids |
|--------|-----------|----------------|
| cards.js   | `#cards`   | `#cards-tab-consonants`, `#cards-tab-vowels`, `#cards-grid`, `#card-detail`, `#card-detail-close` |
| combine.js | `#combine` | `#combine-consonants`, `#combine-vowels`, `#combine-result-char`, `#combine-result-label`, `#combine-speak-btn` |
| words.js   | `#words`   | `#words-filter`, `#words-grid` |
| quiz.js    | `#quiz`    | `#quiz-score`, `#quiz-question-emoji`, `#quiz-choices`, `#quiz-result-overlay`, `#quiz-result-msg`, `#quiz-next-btn`, `#quiz-restart-btn` |

## Progress
Total: 10 items | Done: 10 | Pending: 0

## Lessons Learned
(iteration 진행하며 축적)

## Recent Changes
### Iteration 2 — 2026-03-17
- F01 cards.js/cards.css: 자음/모음 카드, 탭 전환, 디테일 오버레이, 발음 재생
- F02 combine.js/combine.css: 자음+모음 조합, 실시간 결과, 발음 자동재생
- F03 words.js/words.css: 단어 카드 그리드, 카테고리 필터, 탭하면 발음
- F04 quiz.js/quiz.css: 8문제 퀴즈, 4지선다, 축하 애니메이션, 점수 추적
