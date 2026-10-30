const STORAGE_KEY = "englishLearningAppState";

const DEFAULT_STATE = {
  theme: "light",
  likedWords: [],
  currentLessonId: 5,
  currentTab: "reading"
};

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...DEFAULT_STATE, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
