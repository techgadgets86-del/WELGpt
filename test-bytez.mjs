import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    process.env[key.trim()] = val.join('=').trim();
  }
});

async function testBZ(model) {
  const res = await fetch(`https://api.bytez.com/models/v2/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BYTEZ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "say hi" }]
      })
    });
    console.log(model, res.status);
    if (!res.ok) console.log(await res.text());
}

await testBZ("meta-llama/Meta-Llama-3.1-8B-Instruct");
await testBZ("meta-llama/Llama-3-8b-chat-hf");
await testBZ("Qwen/Qwen2.5-7B-Instruct");
