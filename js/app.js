import { state, persistUserState } from "./core/state.js";
import { loadBooks, loadLesson } from "./data/loader.js";
import { renderHeader, setActiveTab } from "./components/header.js";
import { renderSidebar, setActiveLesson } from "./components/sidebar.js";
import { renderReading } from "./pages/reading.js";
import { renderFlashcardPage } from "./pages/flashcards.js";
import { renderExamPage } from "./pages/exam.js";

const pages = {
  reading: document.querySelector("#readingPage"),
  flashcard: document.querySelector("#flashcardPage"),
  exam: document.querySelector("#examPage"),
};

async function init() {
  try {
    const books = await loadBooks();

    renderHeader(
      document.querySelector("#appHeader"),
      switchTab,
      openSidebar
    );

    renderSidebar(
      document.querySelector("#sidebar"),
      books,
      handleLessonSelect
    );

    renderFlashcardPage(pages.flashcard);
    await renderExamPage(pages.exam);

    await handleLessonSelect(state.user.currentLessonId || 5, false);
    switchTab(state.user.currentTab || "reading");
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
      <div class="info-card">
        <div class="info-title">خطا در راه‌اندازی برنامه</div>
        <p style="color:var(--text-muted);line-height:1.8">
          فایل‌های داده بارگذاری نشدند. مطمئن شوید پروژه را از طریق یک web server اجرا می‌کنید.
        </p>
      </div>
    `;
  }
}

async function handleLessonSelect(lessonId, closeSidebar = true) {
  try {
    const lesson = await loadLesson(lessonId);
state.user.currentLessonId = lessonId;
state.currentLesson = lesson;
persistUserState();

    renderReading(pages.reading, lesson);

    // Flashcards use the currently selected lesson.
    renderFlashcardPage(pages.flashcard);

    setActiveLesson(lessonId);

    if (closeSidebar) closeSidebarMenu();
  } catch (error) {
    console.error(error);
    alert("بارگذاری درس انجام نشد.");
  }
}

function switchTab(tabName) {
  Object.entries(pages).forEach(([name, page]) => {
    page.classList.toggle("active", name === tabName);
  });

  setActiveTab(tabName);
  state.user.currentTab = tabName;

  if (typeof window !== "undefined") {
    localStorage.setItem("englishLearningAppState", JSON.stringify(state.user));
  }

  if (window.gsap) {
    const activePage = pages[tabName];
    gsap.fromTo(activePage, { opacity: 0 }, { opacity: 1, duration: .2 });
  }
}

function openSidebar() {
  document.querySelector("#sidebar").classList.add("open");
  document.querySelector("#sidebarOverlay").classList.add("active");
}

function closeSidebarMenu() {
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelector("#sidebarOverlay").classList.remove("active");
}

document.querySelector("#sidebarOverlay").addEventListener("click", closeSidebarMenu);

init();
