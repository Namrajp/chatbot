# Chatbot Assistant

Simple TypeScript/Express app with a ChatGPT-style frontend, server-stored conversation memory, and OpenAI-powered modes for:

- Ticket summaries
- Resume bullet improvements
- Code reviews
- Nepali translation
- Text summaries

## Setup

Create `.env`:

```bash
OPENAI_API_KEY=your_api_key_here
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Check TypeScript:

```bash
npm run check
```

## API

`POST /api/chat`

```json
{
  "sessionId": "browser-session-id",
  "mode": "summary",
  "prompt": "Text to process"
}
```

Supported modes: `ticket`, `resume`, `review`, `translate`, `summary`.

Conversation history:

- `GET /api/conversations/:sessionId`
- `DELETE /api/conversations/:sessionId`

Conversation data is stored in `data/conversations.json`, which is ignored by Git.
