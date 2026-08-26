export const FALLBACK_DATABASE = [
  {
    keywords: ["sleep", "insomnia", "tired", "rest", "melatonin", "circadian"],
    answer: "Sleep optimization begins with circadian alignment. View sunlight within 30 minutes of waking to spike cortisol and set your circadian clock. In the evening, dim artificial lights and block blue light 2 hours before bed. Keep the room cool (65°F/18°C). Supplements like Magnesium L-Threonate or Apigenin can help transition into deep sleep."
  },
  {
    keywords: ["stress", "anxiety", "panic", "overwhelmed", "calm", "vagus"],
    answer: "To immediately reduce stress, use the Physiological Sigh: take two sharp inhales through the nose followed by a long, slow exhale through the mouth. Repeat 3 times. This rapidly offloads carbon dioxide and engages the vagus nerve to downregulate your nervous system."
  },
  {
    keywords: ["focus", "adhd", "attention", "work", "distracted", "dopamine"],
    answer: "Dopamine is the molecule of motivation. To optimize focus, avoid cheap dopamine hits (social media, sugar) early in the day. Work in 90-minute ultradian cycles followed by 20 minutes of non-sleep deep rest (NSDR). Binaural beats at 40Hz can also enhance gamma brain waves linked to intense concentration."
  },
  {
    keywords: ["muscle", "hypertrophy", "strength", "workout", "protein", "gym"],
    answer: "Muscle hypertrophy requires mechanical tension and metabolic stress. Train close to failure in the 5-30 rep range. Consume 1.6-2.2 grams of protein per kilogram of body weight daily. Ensure adequate Delta-wave sleep, as that is when the vast majority of human growth hormone (HGH) is released for tissue repair."
  },
  {
    keywords: ["diet", "nutrition", "food", "eat", "fasting", "weight loss", "fat"],
    answer: "Nutritional timing can leverage insulin sensitivity. Intermittent fasting (e.g., 16:8) can increase autophagy and metabolic flexibility. Prioritize high-quality single-ingredient foods, maximize protein intake for satiety, and avoid simple carbohydrates before periods of inactivity to prevent blood sugar crashes."
  },
  {
    keywords: ["morning", "routine", "wake", "coffee", "caffeine"],
    answer: "Delay caffeine intake by 90 to 120 minutes after waking. This allows adenosine to clear naturally from your receptors, preventing the dreaded afternoon crash. Hydrate immediately with 500ml of water and sea salt to replenish nighttime fluid loss."
  },
  {
    keywords: ["hello", "hi", "hey", "who are you", "help"],
    answer: "Hello! I am WelGPT, your elite AI neuroscience and wellness coach. I'm currently running in offline backup mode, but I can still answer basic questions about sleep, focus, stress, nutrition, and exercise!"
  }
];

export function getFallbackResponse(query: string): string {
  const normalizedQuery = query.toLowerCase();
  
  // Find the best matching entry based on keyword overlap
  let bestMatch = null;
  let maxScore = 0;
  
  for (const entry of FALLBACK_DATABASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }
  
  let responseText = "I don't have specific offline data for that query, but remember that mastering the basics—sleep, hydration, sunlight, and movement—is the foundation of all human optimization.";
  if (bestMatch) {
    responseText = bestMatch.answer;
  }
  
  return responseText + "\n\n*(Disclaimer: This is a pre-programmed response from the offline Knowledge Database because the AI API quota has been reached.)*";
}
