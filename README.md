# English Learning

A lightweight, browser-based English learning platform built with vanilla HTML, CSS, and JavaScript.

English Learning brings lessons, reading practice, vocabulary flashcards, and exams together in one simple interface. It is designed to make studying English more organized, accessible, and engaging.

## Features

- **Lessons** — Structured English lessons with learning materials and explanations.
- **Reading** — Read lesson texts with vocabulary highlighting and learning support.
- **Vocabulary Flashcards** — Review words, practice recall, and organize vocabulary by difficulty and favorites.
- **Audio Player** — Listen to audio materials associated with lessons.
- **Exams** — Test your understanding with interactive exercises.
- **Progress Persistence** — Keep your learning progress and preferences between visits.
- **Responsive Interface** — Use the application on desktop, tablet, and mobile devices.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- JSON for lesson and vocabulary data
- Browser storage for user progress and preferences

No frontend framework, package manager, or build process is required.

## Project Structure

```text
english-learning/
├── index.html
├── assets/
│   ├── icons/
│   └── images/
├── audio/
│   ├── lesson-001/
│   └── lesson-005/
├── data/
│   ├── books.json
│   ├── vocabulary.json
│   ├── lessons/
│   └── exams/
├── css/
│   ├── variables.css
│   ├── main.css
│   ├── layout.css
│   ├── components.css
│   ├── reading.css
│   ├── flashcards.css
│   ├── exam.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── core/
    ├── data/
    ├── components/
    ├── pages/
    └── utils/
```

## Getting Started

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Bashligh/English_app.git
   ```

2. Open the project directory:

   ```bash
   cd English_app
   ```

3. Start a local static server. For example, with Python:

   ```bash
   python3 -m http.server 8000
   ```

4. Open the application:

   ```text
   http://localhost:8000
   ```

You can also use a code editor's static server extension.

> Opening `index.html` directly with `file://` may prevent JavaScript modules or JSON files from loading correctly. Use a local HTTP server instead.

## Deployment

This project can be hosted using GitHub Pages without any build step.

1. Open the repository's **Settings**.
2. Navigate to **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save your settings.

Once deployed, GitHub Pages will provide a public URL for the application.

## Contributing

Suggestions, bug reports, and improvements are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes.
4. Open a pull request.

## License

No license has been specified yet.
