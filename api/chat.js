// Vercel Serverless Function: /api/chat
// Proxies chat requests to the Gemini API with Google Search grounding,
// keeping the API key server-side. Set GEMINI_API_KEY in the Vercel project
// (Settings → Environment Variables).
//
// The response is normalized to an Anthropic-style shape
// ({ content: [{ type: "text", text }] }) so the React client can stay
// provider-agnostic.

const MODEL = "gemini-2.5-flash"
const MAX_TOKENS = 1024
const API_BASE = "https://generativelanguage.googleapis.com/v1beta"

function toGeminiContents(messages) {
  return messages
    .filter(m => m && m.content)
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }]
    }))
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." })

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Server is not configured. GEMINI_API_KEY missing." })
  }

  // Vercel parses JSON bodies automatically, but guard for raw/string payloads.
  let payload = req.body
  if (typeof payload === "string") {
    try { payload = JSON.parse(payload) } catch { return res.status(400).json({ error: "Invalid JSON body." }) }
  }

  const { messages, system } = payload || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "'messages' must be a non-empty array." })
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
      "x-goog-api-key": process.env.GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  })

  const data = await upstream.json().catch(() => null)
  if (!upstream.ok || !data) {
    return res.status(upstream.status || 502).json({
      error: data?.error?.message || "Upstream error from Gemini."
    })
  }

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || "")
    .join("")

  return res.status(200).json({ content: [{ type: "text", text }] })
}
