import { renderIcons } from "../utils/helpers.js";

export function renderSidebar(root, books, onLessonSelect) {
  root.innerHTML = `
    <h3 style="margin-bottom:14px;font-size:1rem;">کتاب‌ها و درس‌ها</h3>
    ${books.map((book, index) => `
      <div class="book-item ${index > 0 ? "collapsed" : ""}" data-book="${book.id}">
        <div class="book-header">
          <span style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="book-open" class="icon"></i>
            ${book.title}
          </span>
          <i data-lucide="chevron-down" class="icon arrow-icon"></i>
        </div>

        <ul class="lesson-list">
          ${book.lessons.map(lesson => `
            <li class="lesson-item"
                data-lesson-id="${lesson.id}">
              ${lesson.title}
            </li>
          `).join("")}
        </ul>
      </div>
    `).join("")}
  `;

  root.querySelectorAll(".book-header").forEach(header => {
    header.addEventListener("click", () => {
      header.closest(".book-item").classList.toggle("collapsed");
    });
  });

  root.querySelectorAll(".lesson-item").forEach(item => {
    item.addEventListener("click", () => {
      onLessonSelect(Number(item.dataset.lessonId));
    });
  });

  renderIcons();
}

export function setActiveLesson(id) {
  document.querySelectorAll(".lesson-item").forEach(item => {
    item.classList.toggle(
      "active",
      Number(item.dataset.lessonId) === id
    );
  });
}
