/**
 * quiz.js — F04: 퀴즈 게임 (Quiz game)
 *           F05: 음성 발음 지원 (Speech pronunciation)
 *           F06: 아이 친화적 UI (Child-friendly UI)
 *
 * Responsibility:
 *   Show an emoji and ask the child to pick the correct Korean word from 4 choices.
 *   Celebrate correct answers with confetti/star animation and speech.
 *   Gently encourage on wrong answers with shake animation.
 *   Track score for the current session.
 *   Read the correct answer aloud after every selection (F05).
 *
 * Dependencies (globals loaded before this file):
 *   - HANGUL_DATA  (js/shared/data.js)
 *   - Speech       (js/shared/speech.js)
 *   - App          (js/shared/app.js)
 *
 * DOM contract (elements in #quiz section):
 *   #quiz-score            — displays "3 / 8" style score
 *   #quiz-question-emoji   — large emoji for the current question
 *   #quiz-choices          — container for 4 answer choice buttons
 *   #quiz-result-overlay   — overlay shown after each answer (correct/wrong feedback)
 *   #quiz-result-msg       — message inside overlay
 *   #quiz-next-btn         — button to proceed to next question
 *   #quiz-restart-btn      — button to restart the quiz
 */

const QuizModule = (() => {
  const TOTAL_QUESTIONS = 8;
  const CHOICES_COUNT = 4;

  // Celebration star emojis for confetti effect
  const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🏆', '🌈'];

  let _questions = [];     // shuffled question list for this session
  let _currentIdx = 0;    // index into _questions
  let _score = 0;
  let _listenersAdded = false;
  let _confettiTimeout = null;

  /* --------------------------------------------------------
     Initialization
     -------------------------------------------------------- */

  /**
   * Initialize the module: build a new quiz session and show the first question.
   * Called by App when navigating to 'quiz' section.
   */
  function init() {
    _buildQuestions();
    _currentIdx = 0;
    _score = 0;
    _updateScore();
    _clearConfetti();

    // Only add event listeners once; use a flag to avoid duplicating them
    if (!_listenersAdded) {
      const nextBtn = document.getElementById('quiz-next-btn');
      const restartBtn = document.getElementById('quiz-restart-btn');
      if (nextBtn) nextBtn.addEventListener('click', _nextQuestion);
      if (restartBtn) restartBtn.addEventListener('click', init);
      _listenersAdded = true;
    }

    // Ensure restart btn is hidden and next btn is visible at start
    const nextBtn = document.getElementById('quiz-next-btn');
    const restartBtn = document.getElementById('quiz-restart-btn');
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (restartBtn) restartBtn.classList.add('hidden');

    // Announce quiz start via speech (F05)
    Speech.speak('퀴즈 게임을 시작해요! 그림을 보고 맞는 단어를 골라요!');

    _showQuestion();
  }

  /* --------------------------------------------------------
     Question building
     -------------------------------------------------------- */

  /**
   * Build a shuffled list of questions from HANGUL_DATA.words.
   */
  function _buildQuestions() {
    const shuffled = [...HANGUL_DATA.words].sort(() => Math.random() - 0.5);
    _questions = shuffled.slice(0, TOTAL_QUESTIONS).map(correct => ({
      correct,
      choices: _buildChoices(correct),
    }));
  }

  /**
   * Build 4 answer choices for a question: 1 correct + 3 wrong.
   * Prefers same-category distractors to make the quiz more educational.
   * @param {{word, emoji, meaning, category}} correct
   * @returns {Array<{word, emoji, meaning, category}>}
   */
  function _buildChoices(correct) {
    const allWords = HANGUL_DATA.words;

    // Prefer distractors from the same category
    const sameCategory = allWords.filter(
      w => w.word !== correct.word && w.category === correct.category
    );
    const otherCategory = allWords.filter(
      w => w.word !== correct.word && w.category !== correct.category
    );

    // Shuffle each pool
    const shuffledSame = sameCategory.sort(() => Math.random() - 0.5);
    const shuffledOther = otherCategory.sort(() => Math.random() - 0.5);

    // Take up to 3 distractors: prefer same-category, fill with other if needed
    const needed = CHOICES_COUNT - 1;
    const fromSame = shuffledSame.slice(0, needed);
    const fromOther = shuffledOther.slice(0, needed - fromSame.length);
    const distractors = [...fromSame, ...fromOther];

    return [...distractors, correct].sort(() => Math.random() - 0.5);
  }

  /* --------------------------------------------------------
     Question display
     -------------------------------------------------------- */

  /**
   * Render the current question.
   */
  function _showQuestion() {
    // Hide overlay
    const overlay = document.getElementById('quiz-result-overlay');
    if (overlay) overlay.classList.add('hidden');

    // Remove final class from overlay if present
    if (overlay) {
      overlay.classList.remove('quiz-result--correct', 'quiz-result--wrong', 'quiz-result--final');
    }

    if (_currentIdx >= _questions.length) {
      _showFinalResult();
      return;
    }

    const q = _questions[_currentIdx];

    // Update emoji with entrance animation
    const emojiEl = document.getElementById('quiz-question-emoji');
    if (emojiEl) {
      emojiEl.textContent = q.correct.emoji;
      emojiEl.classList.remove('quiz-emoji--pop');
      // Force reflow to restart animation
      void emojiEl.offsetWidth;
      emojiEl.classList.add('quiz-emoji--pop');
    }

    // F05: Speak a friendly prompt
    Speech.speak('이게 뭐야?');

    _renderChoices(q);
    _updateScore();
  }

  /**
   * Render the 4 choice buttons for a question.
   * @param {{correct, choices}} question
   */
  function _renderChoices(question) {
    const container = document.getElementById('quiz-choices');
    if (!container) return;
    container.innerHTML = '';

    question.choices.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.textContent = item.word;
      btn.setAttribute('aria-label', item.word);
      // Staggered entrance animation
      btn.style.animationDelay = `${index * 60}ms`;
      btn.classList.add('quiz-choice--enter');
      btn.addEventListener('click', () => _onChoiceClick(item, question.correct, btn));
      container.appendChild(btn);
    });
  }

  /* --------------------------------------------------------
     Answer handling
     -------------------------------------------------------- */

  /**
   * Handle an answer choice click.
   * @param {{word}} chosen  — the item the child picked
   * @param {{word}} correct — the correct answer item
   * @param {HTMLElement} btn — the clicked button element
   */
  function _onChoiceClick(chosen, correct, btn) {
    const isCorrect = chosen.word === correct.word;

    // Disable all choice buttons immediately to prevent double-clicks
    document.querySelectorAll('#quiz-choices .quiz-choice').forEach(b => {
      b.disabled = true;
      // Highlight the correct answer always
      if (b.textContent === correct.word) {
        b.classList.add('quiz-choice--correct');
      }
    });

    if (isCorrect) {
      _score++;
      btn.classList.add('quiz-choice--correct', 'quiz-choice--bounce');
      _showResultOverlay(true, correct);
      // F05: Read the correct answer aloud; slight delay to let button animation start
      setTimeout(() => Speech.speak(`정답! ${correct.word}!`), 150);
      _launchConfetti();
    } else {
      btn.classList.add('quiz-choice--wrong', 'quiz-choice--shake');
      _showResultOverlay(false, correct);
      // F05: Read the correct answer aloud after wrong guess
      setTimeout(() => Speech.speak(`정답은 ${correct.word}야. 다시 해봐요!`), 150);
    }

    _updateScore();
  }

  /* --------------------------------------------------------
     Result overlay
     -------------------------------------------------------- */

  /**
   * Show the result overlay after an answer.
   * @param {boolean} isCorrect
   * @param {{word, emoji}} correct
   */
  function _showResultOverlay(isCorrect, correct) {
    const overlay = document.getElementById('quiz-result-overlay');
    const msg = document.getElementById('quiz-result-msg');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (!overlay) return;

    overlay.classList.remove('hidden', 'quiz-result--correct', 'quiz-result--wrong', 'quiz-result--final');
    overlay.classList.add(isCorrect ? 'quiz-result--correct' : 'quiz-result--wrong');

    if (msg) {
      if (isCorrect) {
        msg.innerHTML = `<span class="quiz-result__emoji">🎉</span><br>정답이에요!<br><strong class="quiz-result__word">${correct.emoji} ${correct.word}</strong>`;
      } else {
        msg.innerHTML = `<span class="quiz-result__emoji">💪</span><br>다시 해봐요!<br><span class="quiz-result__hint">정답은 <strong>${correct.emoji} ${correct.word}</strong></span>`;
      }
    }

    const isLast = _currentIdx >= _questions.length - 1;
    if (nextBtn) {
      nextBtn.textContent = isLast ? '결과 보기 🏆' : '다음 문제 →';
    }
  }

  /**
   * Show the final score screen at the end of the session.
   */
  function _showFinalResult() {
    const overlay = document.getElementById('quiz-result-overlay');
    const msg = document.getElementById('quiz-result-msg');
    const nextBtn = document.getElementById('quiz-next-btn');
    const restartBtn = document.getElementById('quiz-restart-btn');

    if (!overlay) return;

    overlay.classList.remove('hidden', 'quiz-result--correct', 'quiz-result--wrong');
    overlay.classList.add('quiz-result--final');

    const pct = _score / TOTAL_QUESTIONS;
    let emoji, praise;
    if (pct === 1) {
      emoji = '🏆';
      praise = '완벽해요! 최고예요!';
    } else if (pct >= 0.75) {
      emoji = '🌟';
      praise = '정말 잘했어요!';
    } else if (pct >= 0.5) {
      emoji = '😊';
      praise = '잘했어요! 조금만 더 연습해요!';
    } else {
      emoji = '💪';
      praise = '괜찮아요! 다시 해봐요!';
    }

    if (msg) {
      msg.innerHTML = `
        <span class="quiz-result__emoji quiz-result__emoji--big">${emoji}</span>
        <div class="quiz-result__final-score">${_score} <span class="quiz-result__of">/ ${TOTAL_QUESTIONS}</span></div>
        <div class="quiz-result__praise">${praise}</div>
      `;
    }

    if (nextBtn) nextBtn.classList.add('hidden');
    if (restartBtn) restartBtn.classList.remove('hidden');

    // F05: Announce final result via speech
    Speech.speak(`${_score}개 맞혔어요! ${praise}`);

    if (pct >= 0.75) _launchConfetti();
  }

  /* --------------------------------------------------------
     Navigation
     -------------------------------------------------------- */

  /**
   * Advance to the next question.
   */
  function _nextQuestion() {
    _clearConfetti();
    _currentIdx++;
    _showQuestion();
  }

  /* --------------------------------------------------------
     Score
     -------------------------------------------------------- */

  /**
   * Update the score display.
   */
  function _updateScore() {
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) scoreEl.textContent = `${_score} / ${TOTAL_QUESTIONS}`;
  }

  /* --------------------------------------------------------
     Confetti / celebration (F06)
     -------------------------------------------------------- */

  /**
   * Launch a confetti-like star burst animation over the quiz section.
   * Creates absolutely-positioned star elements that fly outward and fade.
   */
  function _launchConfetti() {
    const section = document.getElementById('quiz');
    if (!section) return;

    const STAR_COUNT = 18;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span');
      star.className = 'quiz-confetti-star';
      star.textContent = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];

      // Random start position across the screen
      const startX = 20 + Math.random() * 60; // 20–80% from left
      const startY = 30 + Math.random() * 40; // 30–70% from top

      // Random trajectory
      const dx = (Math.random() - 0.5) * 260; // px horizontal drift
      const dy = -(80 + Math.random() * 180);  // px upward drift
      const rotate = (Math.random() - 0.5) * 720;
      const scale = 0.6 + Math.random() * 1.0;
      const duration = 700 + Math.random() * 600; // ms
      const delay = Math.random() * 300; // ms stagger

      star.style.cssText = `
        left: ${startX}%;
        top: ${startY}%;
        font-size: ${1.2 + Math.random() * 1.4}rem;
        --dx: ${dx}px;
        --dy: ${dy}px;
        --rotate: ${rotate}deg;
        --scale: ${scale};
        animation: quizStarFly ${duration}ms ease-out ${delay}ms forwards;
      `;

      fragment.appendChild(star);
    }

    section.appendChild(fragment);

    // Clean up stars after animation completes
    _confettiTimeout = setTimeout(() => {
      _clearConfetti();
    }, 1600);
  }

  /**
   * Remove all confetti star elements.
   */
  function _clearConfetti() {
    if (_confettiTimeout) {
      clearTimeout(_confettiTimeout);
      _confettiTimeout = null;
    }
    const section = document.getElementById('quiz');
    if (!section) return;
    section.querySelectorAll('.quiz-confetti-star').forEach(el => el.remove());
  }

  /* --------------------------------------------------------
     Navigation registration
     -------------------------------------------------------- */

  if (typeof App !== 'undefined') {
    App.onNavigate((section) => {
      if (section === 'quiz') {
        // Small delay lets the section become visible before we run DOM queries
        setTimeout(init, 50);
      }
    });
  }

  return { init };
})();
