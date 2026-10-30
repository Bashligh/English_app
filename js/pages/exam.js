import { state } from "../core/state.js";
import { loadExam } from "../data/loader.js";
import { renderIcons } from "../utils/helpers.js";

export async function renderExamPage(root) {
  root.innerHTML = `
    <div class="exam-container" id="examSelectionView">
      <h2 style="font-size:1.1rem;color:var(--primary)">انتخاب آزمون</h2>
      <p style="font-size:.85rem;color:var(--text-muted)">لطفاً یکی از آزمون‌های زیر را برای شرکت انتخاب کنید:</p>
      <div class="exam-card-selection" id="examList"></div>
      <button class="btn btn-primary" id="startExamBtn" style="align-self:flex-start">شروع آزمون</button>
    </div>

    <div class="review-wrapper" id="activeExamView" style="display:none;margin:0 auto">
      <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--text-muted)">
        <span id="examProgress">سوال ۱ از ۱</span>
        <span>آزمون</span>
      </div>
      <div class="review-question" id="examQuestion">-</div>
      <div class="review-options" id="examOptions"></div>
      <div class="controls-bar" style="margin-top:10px">
        <button class="btn" id="prevExamBtn">سوال قبلی</button>
        <button class="btn btn-primary" id="nextExamBtn">سوال بعدی</button>
      </div>
    </div>

    <div class="review-wrapper" id="examResultView" style="display:none;margin:0 auto">
      <div class="exam-result-card">
        <h2 style="font-size:1.2rem;color:var(--primary)">نتیجه آزمون</h2>
        <div class="exam-score-badge" id="examScoreDisplay">۰ / ۰</div>
        <div class="exam-note-box" id="examNoteDisplay"></div>
        <div class="controls-bar" style="margin-top:10px;flex-wrap:wrap">
          <button class="btn btn-primary" id="restartExamBtn">تکرار آزمون</button>
        </div>
      </div>
    </div>
  `;

  const examList = root.querySelector("#examList");
  const examMetadata = [
    { id: 1, title: "آزمون شماره ۱: واژگان کلیدی سلامت و تغذیه" },
    { id: 2, title: "آزمون شماره ۲: لغات تخصصی رشد و روانشناسی" },
    { id: 3, title: "آزمون شماره ۳: گرامر و ساختار جملات" }
  ];

  examList.innerHTML = examMetadata.map((exam, index) => `
    <label class="exam-radio-item">
      <input type="radio" name="selectedExam" value="${exam.id}" ${index === 0 ? "checked" : ""}>
      ${exam.title}
    </label>
  `).join("");

  root.querySelector("#startExamBtn").addEventListener("click", () => startExam(root));
  root.querySelector("#prevExamBtn").addEventListener("click", () => {
    if (state.currentExamIdx > 0) {
      state.currentExamIdx--;
      renderExamQuestion(root);
    }
  });
  root.querySelector("#nextExamBtn").addEventListener("click", () => nextExamQuestion(root));
  root.querySelector("#restartExamBtn").addEventListener("click", () => {
    root.querySelector("#examResultView").style.display = "none";
    root.querySelector("#examSelectionView").style.display = "flex";
  });

  renderIcons();
}

async function startExam(root) {
  const selected = root.querySelector('input[name="selectedExam"]:checked');
  if (!selected) return;

  try {
    const exam = await loadExam(Number(selected.value));
    state.currentExamQuestions = exam.questions;
    state.currentExamIdx = 0;
    state.examUserAnswers = {};

    root.querySelector("#examSelectionView").style.display = "none";
    root.querySelector("#examResultView").style.display = "none";
    root.querySelector("#activeExamView").style.display = "flex";

    renderExamQuestion(root);
  } catch (error) {
    console.error(error);
    alert("بارگذاری آزمون انجام نشد.");
  }
}

function renderExamQuestion(root) {
  const questions = state.currentExamQuestions;
  const q = questions[state.currentExamIdx];
  if (!q) return;

  root.querySelector("#examProgress").textContent =
    `سوال ${state.currentExamIdx + 1} از ${questions.length}`;
  root.querySelector("#examQuestion").textContent = q.question;

  const answered = state.examUserAnswers[state.currentExamIdx];
  const container = root.querySelector("#examOptions");
  container.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "review-option-btn";
    button.textContent = option;

    if (answered) {
      button.disabled = true;
      if (option === q.correct) button.classList.add("correct");
      if (answered.selected === option && option !== q.correct) button.classList.add("wrong");
    } else {
      button.addEventListener("click", () => {
        state.examUserAnswers[state.currentExamIdx] = { selected: option };
        renderExamQuestion(root);
      });
    }

    container.appendChild(button);
  });

  root.querySelector("#prevExamBtn").disabled = state.currentExamIdx === 0;

  const nextButton = root.querySelector("#nextExamBtn");
  nextButton.disabled = !answered;
  nextButton.textContent =
    state.currentExamIdx === questions.length - 1 ? "ثبت و مشاهده نتیجه" : "سوال بعدی";
}

function nextExamQuestion(root) {
  if (!state.examUserAnswers[state.currentExamIdx]) return;

  if (state.currentExamIdx < state.currentExamQuestions.length - 1) {
    state.currentExamIdx++;
    renderExamQuestion(root);
  } else {
    finishExam(root);
  }
}

function finishExam(root) {
  const questions = state.currentExamQuestions;
  let score = 0;

  questions.forEach((question, index) => {
    if (state.examUserAnswers[index]?.selected === question.correct) score++;
  });

  const percentage = questions.length ? score / questions.length * 100 : 0;

  let note;
  if (percentage === 100) {
    note = "عالی بود! شما به تمامی سوالات پاسخ صحیح دادید و تسلط کامل دارید.";
  } else if (percentage >= 70) {
    note = "عملکرد بسیار خوبی داشتید! با کمی مرور کلمات اشتباه می‌توانید به نمره کامل برسید.";
  } else if (percentage >= 50) {
    note = "عملکرد متوسطی داشتید. پیشنهاد می‌شود فلش‌کارت‌های مرتبط را دوباره مرور کنید.";
  } else {
    note = "نیاز به تمرین بیشتری دارید. حتماً بخش مرور و فلش‌کارت‌ها را مطالعه کنید.";
  }

  root.querySelector("#activeExamView").style.display = "none";
  root.querySelector("#examResultView").style.display = "flex";
  root.querySelector("#examScoreDisplay").textContent = `${score} / ${questions.length}`;
  root.querySelector("#examNoteDisplay").textContent = note;
}
