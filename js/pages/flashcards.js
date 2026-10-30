import { state, persistUserState } from "../core/state.js";
import { renderIcons, shuffle } from "../utils/helpers.js";


/* =========================================================
   MAIN
========================================================= */

export function renderFlashcardPage(root, onSwitchTab) {

  root.innerHTML = `
    <div class="flashcard-top-controls">

      <button class="fc-top-btn active-mode" id="modeCardBtn">
        <i data-lucide="layers-3"></i>
        نمایش کارت
      </button>

      <button class="fc-top-btn" id="modeReviewBtn">
        <i data-lucide="list-checks"></i>
        مرور با گزینه
      </button>

      <div class="word-filter-tabs" id="filterTabs">

        <button
          type="button"
          class="word-filter-tab active"
          data-filter="all"
        >
          همه
        </button>

        <button
          type="button"
          class="word-filter-tab"
          data-filter="easy"
        >
          آسان
        </button>

        <button
          type="button"
          class="word-filter-tab"
          data-filter="hard"
        >
          سخت
        </button>

        <button
          type="button"
          class="word-filter-tab"
          data-filter="liked"
        >
          مورد علاقه
        </button>

      </div>

    </div>


    <!-- FLASHCARD -->

    <div class="flashcard-wrapper" id="flashcardView">

      <div class="card-scene" id="cardScene">

        <div class="card-inner" id="cardInner">

          <div class="card-face">

            <div class="card-head">

              <div id="statusBadgeContainer"></div>

              <button
                class="like-btn"
                id="likeBtn"
                aria-label="پسندیدن"
              >
                <i data-lucide="heart"></i>
              </button>

            </div>


            <div class="card-body-front">

              <div
                class="word-title"
                id="cardFrontText"
              >
                -
              </div>

              <div
                class="phonetics-text"
                id="cardPhonetic"
              >
                -
              </div>

              <button
                class="audio-speech-btn"
                id="speakBtn"
                title="پخش تلفظ صوتی"
              >
                <i data-lucide="volume-2"></i>
              </button>

            </div>


            <div
              style="
                text-align:center;
                font-size:.75rem;
                color:var(--text-muted)
              "
            >
              کلیک برای چرخش
            </div>

          </div>


          <div class="card-face card-back">

            <div
              style="
                text-align:right;
                font-size:.8rem;
                font-weight:600;
                opacity:.8
              "
            >
              ترجمه فارسی
            </div>

            <div
              class="card-body-back"
              id="cardBackText"
            >
              -
            </div>

            <div
              style="
                text-align:center;
                font-size:.75rem;
                opacity:.8
              "
            >
              کلیک برای بازگشت
            </div>

          </div>

        </div>

      </div>


      <div
        class="word-counter-badge"
        id="wordCounterBadge"
      >
        کلمه ۰ از ۰
      </div>


      <div class="controls-bar">

        <button
          class="btn"
          id="prevCardBtn"
        >
          قبلی
        </button>

        <button
          class="btn btn-primary"
          id="nextCardBtn"
        >
          بعدی
        </button>

      </div>

    </div>


    <!-- REVIEW -->

    <div
      class="review-wrapper"
      id="reviewView"
      style="display:none"
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          font-size:.8rem;
          color:var(--text-muted)
        "
      >
        <span id="reviewProgress">
          سوال ۰ از ۰
        </span>

        <span>
          تمرین با گزینه
        </span>
      </div>


      <div
        class="review-question"
        id="reviewQuestion"
      >
        -
      </div>


      <div
        class="review-options"
        id="reviewOptions"
      ></div>


      <div
        class="controls-bar"
        style="margin-top:10px"
      >

        <button
          class="btn"
          id="prevReviewBtn"
        >
          سوال قبلی
        </button>

        <button
          class="btn btn-primary"
          id="nextReviewBtn"
        >
          سوال بعدی
        </button>

      </div>

    </div>
  `;


  /*
   * Make sure these objects exist.
   */

  if (!state.reviewQuestions) {
    state.reviewQuestions = {};
  }

  if (!state.reviewUserAnswers) {
    state.reviewUserAnswers = {};
  }


  bindEvents(root);

  renderIcons();

  applyFilter(root);
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents(root) {

  /* Filter */

  root
    .querySelectorAll(".word-filter-tab")
    .forEach(button => {

      button.addEventListener("click", () => {

        state.currentFilter =
          button.dataset.filter;

        applyFilter(root);
      });
    });


  /* Card mode */

  root
    .querySelector("#modeCardBtn")
    .addEventListener("click", () => {

      setMode(root, "card");
    });


  /* Review mode */

  root
    .querySelector("#modeReviewBtn")
    .addEventListener("click", () => {

      setMode(root, "review");
    });


  /* Flip */

  root
    .querySelector("#cardScene")
    .addEventListener("click", () => {

      root
        .querySelector("#cardInner")
        .classList.toggle("flipped");
    });


  /* Like */

  root
    .querySelector("#likeBtn")
    .addEventListener("click", event => {

      event.stopPropagation();

      if (!state.filteredVocabs.length) {
        return;
      }

      const current =
        state.filteredVocabs[
          state.currentCardIdx
        ];

      const index =
        state.user.likedWords.indexOf(
          current.word
        );

      if (index >= 0) {

        state.user.likedWords.splice(
          index,
          1
        );

      } else {

        state.user.likedWords.push(
          current.word
        );
      }

      persistUserState();

      renderCard(root);
    });


  /* Speech */

  root
    .querySelector("#speakBtn")
    .addEventListener("click", event => {

      event.stopPropagation();

      const current =
        state.filteredVocabs[
          state.currentCardIdx
        ];

      if (!current) {
        return;
      }

      if (!window.speechSynthesis) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          current.word
        );

      utterance.lang = "en-US";

      window.speechSynthesis.speak(
        utterance
      );
    });


  /* Previous card */

  root
    .querySelector("#prevCardBtn")
    .addEventListener("click", () => {

      if (state.currentCardIdx <= 0) {
        return;
      }

      state.currentCardIdx--;

      renderCard(root);
    });


  /* Next card */

  root
    .querySelector("#nextCardBtn")
    .addEventListener("click", () => {

      if (
        state.currentCardIdx >=
        state.filteredVocabs.length - 1
      ) {
        return;
      }

      state.currentCardIdx++;

      renderCard(root);
    });


  /* Previous review */

  root
    .querySelector("#prevReviewBtn")
    .addEventListener("click", () => {

      if (state.currentReviewIdx <= 0) {
        return;
      }

      state.currentReviewIdx--;

      renderReview(root);
    });


  /* Next review */

  root
    .querySelector("#nextReviewBtn")
    .addEventListener("click", () => {

      if (
        state.currentReviewIdx >=
        state.filteredVocabs.length - 1
      ) {
        return;
      }

      state.currentReviewIdx++;

      renderReview(root);
    });
}


/* =========================================================
   FILTER
========================================================= */

function applyFilter(root) {

  const vocabulary =
    state.currentLesson?.vocabulary || [];


  switch (state.currentFilter) {

    case "easy":

      state.filteredVocabs =
        vocabulary.filter(
          item =>
            item.difficulty === "easy"
        );

      break;


    case "hard":

      state.filteredVocabs =
        vocabulary.filter(
          item =>
            item.difficulty === "hard"
        );

      break;


    case "liked":

      state.filteredVocabs =
        vocabulary.filter(
          item =>
            state.user.likedWords.includes(
              item.word
            )
        );

      break;


    default:

      state.filteredVocabs =
        [...vocabulary];
  }


  state.currentCardIdx = 0;
  state.currentReviewIdx = 0;


  /*
   * New filter = new review session.
   */

  state.reviewQuestions = {};
  state.reviewUserAnswers = {};


  root
    .querySelectorAll(".word-filter-tab")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.filter ===
        state.currentFilter
      );
    });


  renderCard(root);

  renderReview(root);
}


/* =========================================================
   CARD
========================================================= */

function renderCard(root) {

  const inner =
    root.querySelector("#cardInner");

  inner.classList.remove("flipped");


  if (!state.filteredVocabs.length) {

    root
      .querySelector("#cardFrontText")
      .textContent =
      "کلمه‌ای یافت نشد";

    root
      .querySelector("#cardPhonetic")
      .textContent = "";

    root
      .querySelector("#cardBackText")
      .textContent =
      "هیچ کلمه‌ای در این فیلتر قرار ندارد.";

    root
      .querySelector("#statusBadgeContainer")
      .innerHTML = "";

    root
      .querySelector("#wordCounterBadge")
      .textContent =
      "۰ از ۰";

    root
      .querySelector("#prevCardBtn")
      .disabled = true;

    root
      .querySelector("#nextCardBtn")
      .disabled = true;

    return;
  }


  const current =
    state.filteredVocabs[
      state.currentCardIdx
    ];


  root
    .querySelector("#cardFrontText")
    .textContent =
    current.word;


  root
    .querySelector("#cardPhonetic")
    .textContent =
    current.pronunciation || "";


  root
    .querySelector("#cardBackText")
    .textContent =
    current.meaning;


  const isEasy =
    current.difficulty === "easy";


  root
    .querySelector("#statusBadgeContainer")
    .innerHTML = `
      <span
        class="word-status-badge ${
          isEasy
            ? "status-easy"
            : "status-hard"
        }"
      >
        ${
          isEasy
            ? "آسان"
            : "سخت"
        }
      </span>
    `;


  root
    .querySelector("#likeBtn")
    .classList.toggle(
      "liked",
      state.user.likedWords.includes(
        current.word
      )
    );


  root
    .querySelector("#wordCounterBadge")
    .textContent =
    `کلمه ${
      state.currentCardIdx + 1
    } از ${
      state.filteredVocabs.length
    }`;


  root
    .querySelector("#prevCardBtn")
    .disabled =
    state.currentCardIdx === 0;


  root
    .querySelector("#nextCardBtn")
    .disabled =
    state.currentCardIdx ===
    state.filteredVocabs.length - 1;


  renderIcons();
}


/* =========================================================
   REVIEW QUESTION CREATION
========================================================= */

function createReviewQuestion(word) {

  /*
   * Get all lesson meanings.
   */

  const meanings =
    (state.currentLesson?.vocabulary || [])
      .map(item => item.meaning)
      .filter(Boolean);


  /*
   * Remove duplicates.
   */

  const uniqueMeanings =
    [...new Set(meanings)];


  /*
   * Wrong answers.
   */

  let wrongAnswers =
    uniqueMeanings.filter(
      meaning =>
        meaning !== word.meaning
    );


  /*
   * Shuffle ONLY HERE.
   *
   * This function is called only once for a word.
   */

  wrongAnswers =
    shuffle(wrongAnswers)
      .slice(0, 3);


  /*
   * Fallbacks if the lesson doesn't have
   * enough different meanings.
   */

  const fallback =
    [
      "سلامت",
      "رشد",
      "جامعه",
      "خانواده",
      "آموزش",
      "زندگی"
    ];


  for (
    const value of fallback
  ) {

    if (
      wrongAnswers.length >= 3
    ) {
      break;
    }

    if (
      value !== word.meaning &&
      !wrongAnswers.includes(value)
    ) {

      wrongAnswers.push(value);
    }
  }


  /*
   * Build final options.
   *
   * Again: ONLY ONCE.
   */

  const options =
    shuffle([
      word.meaning,
      ...wrongAnswers.slice(0, 3)
    ]);


  return {

    word:
      word.word,

    correct:
      word.meaning,

    options,

    selected:
      null,

    answered:
      false
  };
}


/* =========================================================
   REVIEW
========================================================= */

function renderReview(root) {

  const questionEl =
    root.querySelector(
      "#reviewQuestion"
    );

  const progressEl =
    root.querySelector(
      "#reviewProgress"
    );

  const optionsEl =
    root.querySelector(
      "#reviewOptions"
    );


  if (!state.filteredVocabs.length) {

    questionEl.textContent =
      "کلمه‌ای برای مرور وجود ندارد.";

    progressEl.textContent =
      "۰ از ۰";

    optionsEl.innerHTML = "";

    root
      .querySelector("#prevReviewBtn")
      .disabled = true;

    root
      .querySelector("#nextReviewBtn")
      .disabled = true;

    return;
  }


  const current =
    state.filteredVocabs[
      state.currentReviewIdx
    ];


  const key =
    current.word;


  progressEl.textContent =
    `سوال ${
      state.currentReviewIdx + 1
    } از ${
      state.filteredVocabs.length
    }`;


  questionEl.textContent =
    `معنی کلمه "${current.word}" چیست؟`;


  /*
   * Get existing question.
   *
   * NEVER regenerate it if it already exists.
   */

  let question =
    state.reviewQuestions[key];


  if (!question) {

    question =
      createReviewQuestion(
        current
      );

    state.reviewQuestions[key] =
      question;
  }


  /*
   * IMPORTANT:
   *
   * From this point onward, the options array
   * is never changed.
   */


  optionsEl.innerHTML = "";


  question.options.forEach(
    option => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "review-option-btn";


      button.textContent =
        option;


      /*
       * Already answered.
       */

      if (question.answered) {

        button.disabled = true;


        if (
          option === question.correct
        ) {

          button.classList.add(
            "correct"
          );
        }


        if (
          option === question.selected &&
          option !== question.correct
        ) {

          button.classList.add(
            "wrong"
          );
        }


      } else {

        /*
         * Not answered yet.
         */

        button.addEventListener(
          "click",
          () => {

            answerReviewQuestion(
              root,
              question,
              key,
              option
            );
          }
        );
      }


      optionsEl.appendChild(
        button
      );
    }
  );


  root
    .querySelector("#prevReviewBtn")
    .disabled =
    state.currentReviewIdx === 0;


  root
    .querySelector("#nextReviewBtn")
    .disabled =
    state.currentReviewIdx ===
    state.filteredVocabs.length - 1;
}


/* =========================================================
   ANSWER REVIEW QUESTION
========================================================= */

function answerReviewQuestion(
  root,
  question,
  key,
  selectedOption
) {

  /*
   * Safety:
   * Never answer twice.
   */

  if (question.answered) {
    return;
  }


  /*
   * Save answer.
   */

  question.selected =
    selectedOption;

  question.answered =
    true;


  state.reviewQuestions[key] =
    question;


  /*
   * IMPORTANT:
   *
   * We DO NOT call renderReview().
   *
   * We DO NOT recreate the buttons.
   *
   * We DO NOT shuffle anything.
   *
   * We only modify the existing DOM.
   */


  const optionsEl =
    root.querySelector(
      "#reviewOptions"
    );


  const buttons =
    optionsEl.querySelectorAll(
      ".review-option-btn"
    );


  buttons.forEach(button => {

    button.disabled = true;


    const value =
      button.textContent;


    /*
     * Correct answer.
     */

    if (
      value === question.correct
    ) {

      button.classList.add(
        "correct"
      );
    }


    /*
     * Selected wrong answer.
     */

    if (
      value === question.selected &&
      value !== question.correct
    ) {

      button.classList.add(
        "wrong"
      );
    }
  });
}


/* =========================================================
   MODE
========================================================= */

function setMode(root, mode) {

  const cardView =
    root.querySelector(
      "#flashcardView"
    );

  const reviewView =
    root.querySelector(
      "#reviewView"
    );

  const cardButton =
    root.querySelector(
      "#modeCardBtn"
    );

  const reviewButton =
    root.querySelector(
      "#modeReviewBtn"
    );


  if (mode === "card") {

    cardView.style.display =
      "block";

    reviewView.style.display =
      "none";

    cardButton.classList.add(
      "active-mode"
    );

    reviewButton.classList.remove(
      "active-mode"
    );

  } else {

    cardView.style.display =
      "none";

    reviewView.style.display =
      "block";

    cardButton.classList.remove(
      "active-mode"
    );

    reviewButton.classList.add(
      "active-mode"
    );


    /*
     * Only render when switching into review.
     */

    renderReview(root);
  }


  renderIcons();
}
