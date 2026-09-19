import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateWithFallbacks(prompt: string): Promise<string> {
  const errors: any[] = [];

  // 1. Primary: Google Gemini
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.8-flash',
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      return text.replace(/```json/g, "").replace(/```/g, "").trim();
    } else {
      errors.push(new Error("GOOGLE_GENERATIVE_AI_API_KEY not set"));
    }
  } catch (e) {
    console.warn("[AI Fallback] Google Gemini failed:", e);
    errors.push(e);
  }

  // 2. Backup 1: OpenRouter (OpenAI Compatible)
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free", // using a fast free/fallback model
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
      const data = await res.json();
      const text = data.choices[0].message.content;
      return text.replace(/```json/g, "").replace(/```/g, "").trim();
    } else {
      errors.push(new Error("OPENROUTER_API_KEY not set"));
    }
  } catch (e) {
    console.warn("[AI Fallback] OpenRouter failed:", e);
    errors.push(e);
  }

  // 3. Backup 2: Nvidia NIM (OpenAI Compatible)
  try {
    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    if (apiKey) {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta/llama3-8b-instruct", 
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024
        })
      });
      if (!res.ok) throw new Error(`Nvidia NIM HTTP ${res.status}`);
      const data = await res.json();
      const text = data.choices[0].message.content;
      return text.replace(/```json/g, "").replace(/```/g, "").trim();
    } else {
      errors.push(new Error("NVIDIA_NIM_API_KEY not set"));
    }
  } catch (e) {
    console.warn("[AI Fallback] Nvidia NIM failed:", e);
    errors.push(e);
  }

  // 4. Backup 3: Bytez
  try {
    const apiKey = process.env.BYTEZ_API_KEY;
    if (apiKey) {
      // Bytez typically uses an inference endpoint depending on the model
      const res = await fetch("https://api.bytez.com/models/v2/meta-llama/Meta-Llama-3-8B-Instruct", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!res.ok) throw new Error(`Bytez HTTP ${res.status}`);
      const data = await res.json();
      const text = data.output || data.choices?.[0]?.message?.content || JSON.stringify(data);
      return text.replace(/```json/g, "").replace(/```/g, "").trim();
    } else {
      errors.push(new Error("BYTEZ_API_KEY not set"));
    }
  } catch (e) {
    console.warn("[AI Fallback] Bytez failed:", e);
    errors.push(e);
  }

  // If all failed
  throw new Error("All AI providers (Google, OpenRouter, Nvidia NIM, Bytez) failed. Errors: " + errors.map(e => e.message).join(" | "));
}
