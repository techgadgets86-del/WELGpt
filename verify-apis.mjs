import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

async function testAPIs() {
  const prompt = "Say the exact phrase 'API OK' and nothing else.";
  console.log("Starting API Verification...");

  // 1. Google
  try {
    console.log("\n[1] Testing Google Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
    const result = await model.generateContent(prompt);
    console.log("✅ Google Gemini SUCCESS. Response:", result.response.text().trim());
  } catch (e) {
    console.log("❌ Google Gemini FAILED:", e.message);
  }

  // 2. OpenRouter
  try {
    console.log("\n[2] Testing OpenRouter...");
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("✅ OpenRouter SUCCESS. Response:", data.choices[0].message.content.trim());
  } catch (e) {
    console.log("❌ OpenRouter FAILED:", e.message);
  }

  // 3. Bytez
  try {
    console.log("\n[3] Testing Bytez...");
    const res = await fetch("https://api.bytez.com/models/v2/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BYTEZ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
    }
    const data = await res.json();
    const output = data.output || data.choices?.[0]?.message?.content || JSON.stringify(data);
    console.log("✅ Bytez SUCCESS. Response:", output.trim());
  } catch (e) {
    console.log("❌ Bytez FAILED:", e.message);
  }
}

testAPIs();
