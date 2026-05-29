# Chatbot Assistant

Simple Express app with a frontend chat area and OpenAI-powered modes for:

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

## API

`POST /api/chat`

```json
{
  "mode": "summary",
  "prompt": "Text to process"
}
```

Supported modes: `ticket`, `resume`, `review`, `translate`, `summary`.
