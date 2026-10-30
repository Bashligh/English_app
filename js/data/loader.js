const cache = new Map();

export async function loadJSON(path) {
  if (cache.has(path)) return cache.get(path);

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  const data = await response.json();
  cache.set(path, data);
  return data;
}

export async function loadLesson(id) {
  return loadJSON(`./data/lessons/lesson-${String(id).padStart(3, "0")}.json`);
}

export async function loadBooks() {
  return loadJSON("./data/books.json");
}

export async function loadVocabulary() {
  return loadJSON("./data/vocabulary.json");
}

export async function loadExam(id) {
  return loadJSON(`./data/exams/exam-${String(id).padStart(3, "0")}.json`);
}
