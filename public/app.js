const sessionKey = "chatbot-session-id";
const form = document.querySelector("#chat-form");
const modeSelect = document.querySelector("#mode");
const promptInput = document.querySelector("#prompt");
const messagesList = document.querySelector("#messages");
const emptyState = document.querySelector("#empty-state");
const statusPill = document.querySelector("#status-pill");
const submitButton = document.querySelector("#submit-button");
const clearButton = document.querySelector("#clear-button");

const sessionId = getSessionId();
let messages = [];

function getSessionId() {
  const existing = localStorage.getItem(sessionKey);

  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  localStorage.setItem(sessionKey, created);
  return created;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function setStatus(label, state = "ready") {
  statusPill.textContent = label;
  statusPill.classList.remove("loading", "error", "copied");

  if (state !== "ready") {
    statusPill.classList.add(state);
  }
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function scrollToBottom() {
  messagesList.scrollTop = messagesList.scrollHeight;
}

function renderMessages() {
  messagesList.querySelectorAll(".message").forEach((node) => node.remove());
  emptyState.hidden = messages.length > 0;

  for (const message of messages) {
    messagesList.appendChild(createMessageElement(message));
  }

  scrollToBottom();
}

function createMessageElement(message) {
  const article = document.createElement("article");
  article.className = `message ${message.role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const label = document.createElement("span");
  label.textContent =
    message.role === "assistant" ? `${titleCase(message.mode)} response` : `${titleCase(message.mode)} prompt`;

  const time = document.createElement("time");
  time.dateTime = message.createdAt;
  time.textContent = formatTime(message.createdAt);

  meta.append(label, time);

  const content = document.createElement("p");
  content.className = "message-content";
  content.textContent = message.content;

  article.append(meta, content);

  if (message.role === "assistant") {
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(message.content);
      copyButton.textContent = "Copied";
      setStatus("Copied", "copied");
      setTimeout(() => {
        copyButton.textContent = "Copy";
        setStatus("Ready");
      }, 1400);
    });
    article.append(copyButton);
  }

  return article;
}

function addOptimisticUserMessage(mode, content) {
  messages.push({
    id: `local-${Date.now()}`,
    role: "user",
    mode,
    content,
    createdAt: new Date().toISOString(),
  });
  renderMessages();
}

async function loadConversation() {
  setStatus("Loading", "loading");

  try {
    const response = await fetch(`/api/conversations/${encodeURIComponent(sessionId)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not load conversation.");
    }

    messages = Array.isArray(data.messages) ? data.messages : [];
    renderMessages();
    setStatus("Ready");
  } catch (error) {
    setStatus("Error", "error");
    showSystemMessage(error.message);
  }
}

function showSystemMessage(content) {
  messagesList.querySelectorAll(".system-message").forEach((node) => node.remove());
  const message = document.createElement("div");
  message.className = "system-message";
  message.textContent = content;
  messagesList.appendChild(message);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mode = modeSelect.value;
  const prompt = promptInput.value.trim();

  if (!prompt) {
    showSystemMessage("Enter a prompt before sending.");
    setStatus("Error", "error");
    promptInput.focus();
    return;
  }

  submitButton.disabled = true;
  promptInput.value = "";
  addOptimisticUserMessage(mode, prompt);
  setStatus("Sending", "loading");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, mode, prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    messages.push(data.message);
    renderMessages();
    setStatus("Ready");
  } catch (error) {
    showSystemMessage(error.message);
    setStatus("Error", "error");
  } finally {
    submitButton.disabled = false;
    promptInput.focus();
  }
});

clearButton.addEventListener("click", async () => {
  setStatus("Clearing", "loading");

  try {
    const response = await fetch(`/api/conversations/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Could not clear conversation.");
    }

    messages = [];
    renderMessages();
    setStatus("Ready");
  } catch (error) {
    showSystemMessage(error.message);
    setStatus("Error", "error");
  }
});

promptInput.addEventListener("input", () => {
  promptInput.style.height = "auto";
  promptInput.style.height = `${Math.min(promptInput.scrollHeight, 160)}px`;
});

loadConversation();
