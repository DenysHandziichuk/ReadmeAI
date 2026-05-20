const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const DEFAULT_MODEL = "qwen/qwen3-coder-480b-a35b-instruct";

export async function nvidiaRewrite(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const res = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("NVIDIA NIM error:", res.status, text);
    throw new Error("NVIDIA NIM request failed");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function nvidiaStream(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL,
) {
  const res = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("NVIDIA NIM stream error:", res.status, text);
    throw new Error("NVIDIA NIM streaming failed");
  }

  return res.body;
}
