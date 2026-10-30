import { loadState, saveState } from "./storage.js";

export const state = {
  user: loadState(),
  currentLesson: null,
  currentFilter: "all",
  viewMode: "card",
  filteredVocabs: [],
  currentCardIdx: 0,
  currentReviewIdx: 0,
  reviewUserAnswers: {},
  reviewQuestions: {},
  activeAudio: null,
  activePlayButton: null,
  audioInstances: {},
  currentExamQuestions: [],
  currentExamIdx: 0,
  examUserAnswers: {}
};

export function persistUserState() {
  saveState(state.user);
}
