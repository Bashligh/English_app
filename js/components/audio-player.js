import { state } from "../core/state.js";
import { formatTime, renderIcons } from "../utils/helpers.js";

function iconMarkup(name) {
  return `<i data-lucide="${name}" class="icon"></i>`;
}

export function createAudioPlayer({ src, index }) {
  return `
    <div class="audio-player-bar">
      <div class="audio-controls-group">
        <button class="play-btn" data-audio-play="${index}" aria-label="پخش">
          ${iconMarkup("play")}
        </button>
        <button class="skip-btn" data-audio-skip="${index}" data-seconds="-5">-5s</button>
        <button class="skip-btn" data-audio-skip="${index}" data-seconds="5">+5s</button>
        <select class="speed-select" data-audio-speed="${index}">
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
      </div>
      <div class="audio-progress-container">
        <span class="time-stamp" data-audio-current="${index}">0:00</span>
        <input type="range" class="audio-slider" data-audio-slider="${index}" value="0" min="0" max="100">
        <span class="time-stamp" data-audio-duration="${index}">0:00</span>
      </div>
    </div>
  `;
}

export function bindAudioPlayers(container) {
  container.querySelectorAll("[data-audio-play]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.audioPlay);
      const src = button.closest(".part-card").dataset.audioSrc;
      toggleAudio(src, index, button);
    });
  });

  container.querySelectorAll("[data-audio-skip]").forEach(button => {
    button.addEventListener("click", () => {
      const audio = state.audioInstances[Number(button.dataset.audioSkip)];
      if (audio) {
        const seconds = Number(button.dataset.seconds);
        audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration || 0);
      }
    });
  });

  container.querySelectorAll("[data-audio-speed]").forEach(select => {
    select.addEventListener("change", () => {
      const audio = state.audioInstances[Number(select.dataset.audioSpeed)];
      if (audio) audio.playbackRate = Number(select.value);
    });
  });

  container.querySelectorAll("[data-audio-slider]").forEach(slider => {
    slider.addEventListener("input", () => {
      const audio = state.audioInstances[Number(slider.dataset.audioSlider)];
      if (audio?.duration) audio.currentTime = Number(slider.value) / 100 * audio.duration;
    });
  });

  renderIcons();
}

function toggleAudio(src, index, playButton) {
  if (!state.audioInstances[index]) {
    const audio = new Audio(src);
    state.audioInstances[index] = audio;

    audio.addEventListener("loadedmetadata", () => {
      const el = document.querySelector(`[data-audio-duration="${index}"]`);
      if (el) el.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      const current = document.querySelector(`[data-audio-current="${index}"]`);
      const slider = document.querySelector(`[data-audio-slider="${index}"]`);
      if (current) current.textContent = formatTime(audio.currentTime);
      if (slider && audio.duration) slider.value = (audio.currentTime / audio.duration) * 100;
    });

    audio.addEventListener("ended", () => {
      playButton.innerHTML = iconMarkup("play");
      renderIcons();
      if (state.activeAudio === audio) {
        state.activeAudio = null;
        state.activePlayButton = null;
      }
    });
  }

  const audio = state.audioInstances[index];

  if (state.activeAudio && state.activeAudio !== audio) {
    state.activeAudio.pause();
    if (state.activePlayButton) {
      state.activePlayButton.innerHTML = iconMarkup("play");
      renderIcons();
    }
  }

  if (audio.paused) {
    const speed = document.querySelector(`[data-audio-speed="${index}"]`);
    audio.playbackRate = Number(speed?.value || 1);
    audio.play();
    playButton.innerHTML = iconMarkup("pause");
    state.activeAudio = audio;
    state.activePlayButton = playButton;
  } else {
    audio.pause();
    playButton.innerHTML = iconMarkup("play");
    state.activeAudio = null;
    state.activePlayButton = null;
  }

  renderIcons();
}
