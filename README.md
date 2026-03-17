# hangul-study

미취학 아이를 위한 한글 공부 앱

## Tech Stack

- HTML / CSS / JS (vanilla, no frameworks, no build tools)
- Web Speech API (한글 발음 지원)

## How to Run

1. `index.html` 파일을 브라우저에서 엽니다.
   ```bash
   open ~/projects/hangul-study/index.html
   ```
2. 또는 간단한 로컬 서버로 실행:
   ```bash
   cd ~/projects/hangul-study
   python3 -m http.server 8080
   # http://localhost:8080 접속
   ```

> **참고**: 음성 발음 기능은 한국어 TTS를 지원하는 브라우저가 필요합니다 (Chrome, Edge, Safari 권장).

## Features

- **자음/모음 카드 학습** — ㄱ~ㅎ 14개 자음, ㅏ~ㅣ 10개 모음을 큰 카드로 학습. 클릭하면 발음과 예시 단어 표시
- **음절 조합 연습** — 자음+모음을 선택해서 글자를 조합 (예: ㄱ+ㅏ=가)
- **단어 학습** — 이모지와 함께 기초 단어 26개를 카테고리별로 학습
- **퀴즈 게임** — 그림을 보고 맞는 단어 고르기, 정답 시 축하 애니메이션
- **음성 발음** — Web Speech API로 한글 발음 읽어주기
- **아이 친화적 UI** — 큰 버튼, 밝은 색상, 터치/클릭 지원

## Project Structure

```
hangul-study/
├── index.html          # SPA 진입점
├── css/
│   ├── main.css        # 공유 스타일, 디자인 토큰
│   ├── cards.css       # 카드 학습 스타일
│   ├── combine.css     # 음절 조합 스타일
│   ├── words.css       # 단어 학습 스타일
│   └── quiz.css        # 퀴즈 게임 스타일
└── js/
    ├── shared/
    │   ├── data.js     # 한글 데이터 (자음, 모음, 단어)
    │   ├── speech.js   # Web Speech API 래퍼
    │   └── app.js      # SPA 네비게이션
    └── modules/
        ├── cards.js    # 자음/모음 카드 학습
        ├── combine.js  # 음절 조합 연습
        ├── words.js    # 단어 학습
        └── quiz.js     # 퀴즈 게임
```
