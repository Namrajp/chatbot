const form = document.querySelector("#chat-form");
const modeSelect = document.querySelector("#mode");
const promptInput = document.querySelector("#prompt");
const responseOutput = document.querySelector("#response-output");
const selectedMode = document.querySelector("#selected-mode");
const statusPill = document.querySelector("#status-pill");
const submitButton = document.querySelector("#submit-button");

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function setStatus(label, state = "ready") {
  statusPill.textContent = label;
  statusPill.classList.remove("loading", "error");

  if (state !== "ready") {
    statusPill.classList.add(state);
  }
}

modeSelect.addEventListener("change", () => {
  selectedMode.textContent = titleCase(modeSelect.value);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mode = modeSelect.value;
  const prompt = promptInput.value.trim();

  if (!prompt) {
    responseOutput.textContent = "Enter a prompt before sending.";
    setStatus("Error", "error");
    promptInput.focus();
    return;
  }

  submitButton.disabled = true;
  responseOutput.textContent = "Working...";
  setStatus("Working", "loading");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode, prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    selectedMode.textContent = titleCase(data.mode);
    responseOutput.textContent = data.output || "No response returned.";
    setStatus("Ready");
  } catch (error) {
    responseOutput.textContent = error.message;
    setStatus("Error", "error");
  } finally {
    submitButton.disabled = false;
  }
});
