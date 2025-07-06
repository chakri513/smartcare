// src/utils/logging.ts

// 1. Log Button Clicks
export async function logButtonClick(
  buttonName: string,
  userId: string | null = null,
  extraData: Record<string, any> = {}
) {
  await fetch("http://localhost:8000/entries/log_button_click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      button_name: buttonName,
      timestamp: new Date().toISOString(),
      user_id: userId,
      extra_data: extraData,
    }),
  });
}

// 2. Log AI/LLM Q&A
export async function logAIQuery(
  question: string,
  answer: string,
  userId: string | null = null
) {
  await fetch("http://localhost:8000/entries/log_ai_query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      answer,
      timestamp: new Date().toISOString(),
      user_id: userId,
    }),
  });
}

// 3. Log Care Navigation Tip Access
export async function logCareTipAccess(
  tip: string,
  userId: string | null = null
) {
  await fetch("http://localhost:8000/entries/log_care_tip_access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tip,
      timestamp: new Date().toISOString(),
      user_id: userId,
    }),
  });
}

// 4. Log Errors
export async function logError(
  errorMessage: string,
  context: Record<string, any> = {},
  userId: string | null = null
) {
  await fetch("http://localhost:8000/entries/log_error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error_message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      user_id: userId,
    }),
  });
}
