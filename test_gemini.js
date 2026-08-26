const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.log("NO API KEY");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Testing gemini-1.5-flash...");
    const model1 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const res1 = await model1.generateContent("hello");
    console.log("1.5 SUCCESS:", res1.response.text());
  } catch(e) {
    console.log("1.5 FAILED:", e.message);
  }

  try {
    console.log("\nTesting gemini-3.6-flash...");
    const model2 = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const res2 = await model2.generateContent("hello");
    console.log("3.6 SUCCESS:", res2.response.text());
  } catch(e) {
    console.log("3.6 FAILED:", e.message);
  }
}

run();
