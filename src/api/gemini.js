import { BASE_URL } from "./axios";

/**
 * Gemini API helper.
 *
 * 1) Recommended (production): call your own backend proxy endpoint (keeps key off client).
 * 2) Development only: call Google Gemini API directly from the browser with an API key.
 */

export const DEFAULT_GEMINI_MODEL =
  process.env.REACT_APP_GEMINI_MODEL || "gemini-2.0-flash";

function toGeminiContents(messages) {
  // Gemini REST expects roles: user | model.
  return (messages || []).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
}

function extractText(json) {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!parts || !Array.isArray(parts)) return "";
  return parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .filter(Boolean)
    .join("\n");
}

export async function geminiGenerate({
  apiKey,
  model = DEFAULT_GEMINI_MODEL,
  messages,
  systemInstruction,
  useProxy = false,
  proxyPath = "/api/ai/gemini",
}) {
  const contents = toGeminiContents(messages);

  if (useProxy) {
    const res = await fetch(`${BASE_URL}${proxyPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, contents, systemInstruction }),
      credentials: "include",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.error || json?.message || `Proxy error (${res.status})`;
      throw new Error(msg);
    }

    // Proxy can either return the raw Gemini response or a simplified shape.
    return json?.text || extractText(json) || json?.reply || "";
  }

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set REACT_APP_GEMINI_API_KEY in .env (dev) or use a backend proxy in production."
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents,
  };

  if (systemInstruction?.trim()) {
    body.system_instruction = {
      parts: [{ text: systemInstruction.trim() }],
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.error?.message || json?.message || `Gemini error (${res.status})`;
    throw new Error(msg);
  }

  return extractText(json);
}
