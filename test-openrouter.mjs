import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

async function testOR(model) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "hi" }]
      })
    });
    console.log(model, res.status);
    if (!res.ok) console.log(await res.text());
}

await testOR("meta-llama/llama-3-8b-instruct:free");
await testOR("meta-llama/llama-3.1-8b-instruct:free");
await testOR("mistralai/mistral-7b-instruct:free");
await testOR("google/gemma-2-9b-it:free");
