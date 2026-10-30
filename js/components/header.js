import { state, persistUserState } from "../core/state.js";
import { renderIcons } from "../utils/helpers.js";

export function renderHeader(root, onTabChange, onMenuToggle) {
  root.innerHTML = `
    <div class="header-right">
      <button class="icon-btn" id="menuToggle" aria-label="منو">
        <i data-lucide="menu"></i>
      </button>

      <nav class="top-nav">
        <button class="nav-tab active" data-tab="reading">
          <i data-lucide="book-open"></i> Reading
        </button>
        <button class="nav-tab" data-tab="flashcard">
          <i data-lucide="layers-3"></i> فلش‌کارت
        </button>
        <button class="nav-tab" data-tab="exam">
          <i data-lucide="file-check-2"></i> آزمون
        </button>
        <button class="nav-tab" data-tab="info">
        </button>
      </nav>
    </div>

    <button class="icon-btn theme-toggle-btn" id="themeToggle" aria-label="تم">
      <i data-lucide="sun" class="theme-icon sun-icon"></i>
      <i data-lucide="moon" class="theme-icon moon-icon"></i>
    </button>
  `;

  root.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => onTabChange(button.dataset.tab));
  });

  root.querySelector("#menuToggle").addEventListener("click", onMenuToggle);

  root.querySelector("#themeToggle").addEventListener("click", () => {
    const dark = document.body.dataset.theme === "dark";
    if (dark) {
      delete document.body.dataset.theme;
      state.user.theme = "light";
    } else {
      document.body.dataset.theme = "dark";
      state.user.theme = "dark";
    }
    persistUserState();
  });

  if (state.user.theme === "dark") document.body.dataset.theme = "dark";

  renderIcons();
}

export function setActiveTab(tabName) {
  document.querySelectorAll(".nav-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}
