/**
 * Call OpenRouter Chat API to generate a short weekly summary.
 * Requires VITE_OPENROUTER_API_KEY in .env.
 * @see https://openrouter.ai/docs
 */
export async function generateWeeklySummaryFromActivity(
  activityPayload: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey?.trim()) {
    throw new Error(
      'OpenRouter API key not set. Add VITE_OPENROUTER_API_KEY to .env'
    )
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a concise productivity coach. Given a user's weekly activity from DevFlow (projects, notes, code snippets), write a brief, encouraging weekly summary in 2-4 short paragraphs. Highlight progress, completed work, and one gentle suggestion. Keep tone positive and under 150 words. Use plain text, no markdown headers.`,
        },
        {
          role: 'user',
          content: activityPayload,
        },
      ],
      max_tokens: 300,
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg =
      err?.error?.message ??
      (typeof err?.message === 'string' ? err.message : null) ??
      `${res.status} ${res.statusText}`
    throw new Error(`OpenRouter: ${msg}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty response from OpenRouter')
  return text
}
