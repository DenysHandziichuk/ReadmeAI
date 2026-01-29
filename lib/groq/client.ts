const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function groqRewrite(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Groq error:", res.status, text);
    throw new Error("Groq request failed");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
