// Cloudflare Pages Function: /api/chat
// Proxies chat requests to the Gemini API with Google Search grounding,
// keeping the API key server-side. Set GEMINI_API_KEY in the Cloudflare
// Pages project (Settings → Environment variables).
//
// The response is normalized to an Anthropic-style shape
// ({ content: [{ type: "text", text }] }) so the React client can stay
// provider-agnostic.

const MODEL = "gemini-2.5-flash"
const MAX_TOKENS = 1024
const API_BASE = "https://generativelanguage.googleapis.com/v1beta"

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })

function toGeminiContents(messages) {
  return messages
    .filter(m => m && m.content)
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }]
    }))
}

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return json(500, { error: "Server is not configured. GEMINI_API_KEY missing." })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return json(400, { error: "Invalid JSON body." })
  }

  const { messages, system } = payload || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: "'messages' must be a non-empty array." })
  }

  const body = {
    contents: toGeminiContents(messages),
    tools: [{ googleSearch: {} }],
    generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.7 }
  }
  if (typeof system === "string" && system.trim()) {
    body.systemInstruction = { parts: [{ text: system }] }
  }

  const upstream = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  })

  const data = await upstream.json().catch(() => null)
  if (!upstream.ok || !data) {
    return json(upstream.status || 502, {
      error: data?.error?.message || "Upstream error from Gemini."
    })
  }

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || "")
    .join("")

  return json(200, { content: [{ type: "text", text }] })
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 })
  return json(405, { error: "Method not allowed." })
}
