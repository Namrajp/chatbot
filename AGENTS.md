# Repository Guidelines

## Project Structure & Module Organization

This is a small ESM Node.js chatbot app. `app.js` is the Express server entrypoint; it serves static frontend files from `public/` and exposes `POST /api/chat`. Task-specific OpenAI prompt modules live at the repository root: `code_reviewer.js`, `helpdesk_ticket_summarizer.js`, `resume_improver.js`, `summarizer.js`, and `translator.js`. Frontend assets are in `public/index.html`, `public/styles.css`, and `public/app.js`. There is currently no dedicated `tests/` directory.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Express server with `nodemon`.
- `npm start`: start the server with plain Node.
- `npm test`: placeholder command only; it currently exits with an error.
- `node --check app.js`: syntax-check the server. Also run this on changed task modules and `public/app.js`.

The server reads `PORT` if set; otherwise it starts at `3000` and falls back up to `3010` when ports are busy.

## Coding Style & Naming Conventions

Use JavaScript ESM syntax (`import`/`export`). Keep two-space indentation, semicolons, and double quotes for imports/strings unless editing nearby code that clearly differs. Name task modules by behavior, for example `summarizer.js`, and export action-oriented functions such as `summarizeText(prompt, client)`. Keep OpenAI prompt wording inside the task module that owns it.

## Testing Guidelines

No test framework is configured yet. For now, verify changes with syntax checks and a few HTTP probes:

- `node --check app.js public/app.js`
- `node --check code_reviewer.js helpdesk_ticket_summarizer.js resume_improver.js summarizer.js translator.js`
- Start `npm run dev`, open `http://localhost:3000`, and test each select option.
- Confirm `/api/chat` returns JSON `400` for empty prompts and unsupported modes.

## Commit & Pull Request Guidelines

Recent commit messages are short, title-case summaries such as `First Chatbot Assistant` and `Add OpenAI example scripts`. Keep future commits concise and focused on one logical change. Pull requests should include a short description, validation steps run, screenshots for frontend changes, and notes about any API or environment variable changes.

## Security & Configuration Tips

Store secrets only in `.env`; it is ignored by Git. Required variable: `OPENAI_API_KEY`. Do not commit API keys, generated credentials, or local `node_modules/`. Keep API errors generic in responses and use server logs for detailed OpenAI failures.
