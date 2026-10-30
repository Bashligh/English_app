import { state } from "../core/state.js";
import { createAudioPlayer, bindAudioPlayers } from "../components/audio-player.js";
import { escapeHTML, renderIcons } from "../utils/helpers.js";

function highlightVocabulary(text, vocabulary) {
  if (!text || !Array.isArray(vocabulary) || vocabulary.length === 0) {
    return escapeHTML(text || "");
  }

  const matches = [];

  vocabulary.forEach(vocab => {
    if (!vocab.word) return;

    const word = vocab.word.trim();
    if (!word) return;

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      `\\b${escapedWord}(?:s|es)?\\b`,
      "gi"
    );

    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        vocab
      });
    }
  });

  if (matches.length === 0) {
    return escapeHTML(text);
  }

  // مرتب‌سازی بر اساس محل قرارگیری در متن
  matches.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }

    return (b.end - b.start) - (a.end - a.start);
  });

  // حذف matchهای overlapping
  const filteredMatches = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start < lastEnd) {
      continue;
    }

    filteredMatches.push(match);
    lastEnd = match.end;
  }

  let result = "";
  let cursor = 0;

  filteredMatches.forEach(match => {
    // متن معمولی قبل از کلمه
    result += escapeHTML(
      text.slice(cursor, match.start)
    );

    // خود کلمه
    result += `
      <span class="vocab-highlight">
        ${escapeHTML(match.text)}
        <span class="vocab-popover">
          <span class="popover-word">
            ${escapeHTML(match.vocab.word)}
          </span>
          <span class="popover-phonetic">
            ${escapeHTML(match.vocab.pronunciation || "")}
          </span>
          <span class="popover-meaning">
            ${escapeHTML(match.vocab.meaning || "")}
          </span>
        </span>
      </span>
    `;

    cursor = match.end;
  });

  // باقی متن
  result += escapeHTML(text.slice(cursor));

  return result;
}

export function renderReading(root, lesson) {
  state.currentLesson = lesson;
  state.audioInstances = {};
  state.activeAudio = null;
  state.activePlayButton = null;

  root.innerHTML = lesson.readingSections.map((section, index) => `
    <article class="part-card" data-audio-src="${escapeHTML(section.audio)}">
      <div class="part-header">${escapeHTML(section.title)}</div>
      ${createAudioPlayer({ src: section.audio, index })}
      <div class="reading-text">${highlightVocabulary(section.english, lesson.vocabulary)}</div>
      <div class="persian-translation">${escapeHTML(section.persian)}</div>
    </article>
  `).join("");

  bindAudioPlayers(root);
  renderIcons();

  if (window.gsap) {
    gsap.from(root.querySelectorAll(".part-card"), {
      opacity: 0,
      y: 16,
      duration: .35,
      stagger: .06,
      ease: "power2.out"
    });
  }
}
