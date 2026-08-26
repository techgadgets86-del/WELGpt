// Intelligent Offline Health Encyclopedia
export const HEALTH_ENCYCLOPEDIA = [
  // SLEEP
  {
    topic: "Circadian Rhythm & Sleep",
    tags: ["sleep", "insomnia", "tired", "rest", "melatonin", "circadian", "wake", "bed", "night"],
    content: "Sleep optimization begins with circadian alignment. View sunlight within 30 minutes of waking to spike cortisol and set your circadian clock. In the evening, dim artificial lights and block blue light 2 hours before bed. Keep the room cool (65°F/18°C). Supplements like Magnesium L-Threonate or Apigenin can help transition into deep sleep."
  },
  {
    topic: "Deep Sleep & REM",
    tags: ["rem", "deep sleep", "dreams", "memory", "recovery", "slow wave"],
    content: "Sleep is divided into REM (Rapid Eye Movement) and Slow-Wave (Deep) sleep. Deep sleep dominates the first half of the night and is critical for physical recovery and hormone release (like HGH). REM sleep dominates the second half and is essential for emotional processing and memory consolidation. Alcohol severely disrupts REM sleep."
  },
  
  // NEUROSCIENCE & BRAIN
  {
    topic: "Dopamine & Motivation",
    tags: ["focus", "adhd", "attention", "work", "distracted", "dopamine", "motivation", "procrastination"],
    content: "Dopamine is the molecule of motivation. To optimize focus, avoid cheap dopamine hits (social media, sugar) early in the day. Work in 90-minute ultradian cycles followed by 20 minutes of non-sleep deep rest (NSDR). Layering habits (dopamine stacking) can lead to dopamine crashes; attach dopamine to the effort itself, not the reward."
  },
  {
    topic: "Stress & The Vagus Nerve",
    tags: ["stress", "anxiety", "panic", "overwhelmed", "calm", "vagus", "nervous system", "breathe", "breathing"],
    content: "To immediately reduce stress, use the Physiological Sigh: take two sharp inhales through the nose followed by a long, slow exhale through the mouth. Repeat 3 times. This rapidly offloads carbon dioxide and engages the parasympathetic nervous system via the vagus nerve."
  },
  {
    topic: "Neuroplasticity",
    tags: ["learn", "plasticity", "brain", "neuroplasticity", "habit", "change", "study"],
    content: "Neuroplasticity is the brain's ability to change in response to experience. It requires two phases: intense focus (which triggers acetylcholine and epinephrine to mark synapses for change) followed by deep rest or sleep (when the actual neural rewiring occurs). You cannot learn effectively without sleep."
  },

  // NUTRITION & METABOLISM
  {
    topic: "Metabolism & Fasting",
    tags: ["diet", "nutrition", "food", "eat", "fasting", "weight loss", "fat", "metabolism", "insulin"],
    content: "Nutritional timing leverages insulin sensitivity. Intermittent fasting (e.g., 16:8) increases autophagy (cellular cleanup) and metabolic flexibility. Prioritize high-quality single-ingredient foods. Minimize simple carbohydrates unless consumed immediately around a workout, to prevent glucose spikes and crashes."
  },
  {
    topic: "Protein Synthesis",
    tags: ["protein", "muscle", "hypertrophy", "meat", "vegan", "amino", "bcaa"],
    content: "Muscle protein synthesis (MPS) is triggered by mechanical tension and the amino acid Leucine (approx 2.5-3g per meal). Aim for 1.6-2.2 grams of protein per kilogram of body weight daily, distributed across 3-4 meals to maximize MPS pulses."
  },
  {
    topic: "Hydration & Electrolytes",
    tags: ["water", "hydrate", "hydration", "salt", "electrolytes", "sodium", "potassium", "magnesium", "thirsty"],
    content: "Proper hydration requires more than just water; it requires electrolytes (sodium, potassium, magnesium). Drink 500ml of water with a pinch of high-quality sea salt immediately upon waking. For intense exercise, ensure sodium replenishment to maintain nerve signaling and muscle contraction."
  },
  {
    topic: "Caffeine Protocol",
    tags: ["morning", "routine", "wake", "coffee", "caffeine", "energy", "crash"],
    content: "Delay caffeine intake by 90 to 120 minutes after waking. This allows adenosine (the sleepiness molecule) to clear naturally from your receptors. Drinking coffee too early traps adenosine, which then floods your receptors in the afternoon, causing a severe energy crash."
  },

  // PHYSICAL FITNESS & BIOMECHANICS
  {
    topic: "Hypertrophy & Strength",
    tags: ["muscle", "strength", "workout", "gym", "lift", "weights", "big", "strong"],
    content: "Muscle hypertrophy requires mechanical tension and metabolic stress. Train close to failure (1-3 RIR) in the 5-30 rep range. Progressive overload—gradually increasing weight or reps over time—is non-negotiable. Ensure adequate Delta-wave sleep, as that is when HGH is released for tissue repair."
  },
  {
    topic: "Cardiovascular Health (Zone 2 & VO2 Max)",
    tags: ["cardio", "run", "heart", "vo2", "zone 2", "aerobic", "stamina", "endurance"],
    content: "Optimal cardiovascular health requires two protocols: Zone 2 training (150-180 minutes/week) where you can barely hold a conversation, which builds mitochondrial density. And VO2 Max training (e.g., 4x4 intervals once a week) to increase the maximum oxygen your body can utilize."
  },
  {
    topic: "Flexibility & Mobility",
    tags: ["stretch", "flexibility", "mobility", "stiff", "pain", "yoga"],
    content: "Mobility is active control through a range of motion, whereas flexibility is passive. Static stretching is best done AFTER workouts or in the evening to relax the nervous system. Dynamic stretching should be done BEFORE workouts to warm up the synovial fluid in joints."
  },

  // SUPPLEMENTS
  {
    topic: "Foundational Supplements",
    tags: ["supplements", "vitamins", "creatine", "omega 3", "fish oil", "vitamin d", "zinc", "magnesium"],
    content: "While food is primary, science supports a few foundational supplements: Creatine Monohydrate (5g/day for brain and muscle energy), Omega-3 Fish Oil (minimum 1g EPA/day for mood and inflammation), Vitamin D3+K2 (if sun exposure is low), and Magnesium (Bisglycinate or Threonate) for nervous system recovery."
  },

  // GREETINGS
  {
    topic: "Greetings",
    tags: ["hello", "hi", "hey", "who are you", "help", "what can you do"],
    content: "Hello! I am WelGPT, your elite AI neuroscience and wellness coach. I'm currently running in offline backup mode using the local Health Encyclopedia. Ask me about sleep, neuroplasticity, dopamine, fitness, nutrition, or stress!"
  }
];

// NLP Bot Analyzer
export function getFallbackResponse(query: string, errorMessage?: string): string {
  // 1. Sanitize and tokenize the query
  const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/g, '');
  const words = normalizedQuery.split(/\s+/);
  
  // Stop words to ignore
  const stopWords = new Set(["how", "to", "do", "i", "what", "is", "the", "a", "an", "and", "or", "but", "in", "on", "with", "for", "of", "can", "you", "tell", "me", "about", "my", "why"]);
  const meaningfulWords = words.filter(w => !stopWords.has(w) && w.length > 2);

  // 2. Scoring System
  let bestMatch = null;
  let maxScore = 0;
  
  for (const entry of HEALTH_ENCYCLOPEDIA) {
    let score = 0;
    
    // Exact tag match (High weight)
    for (const tag of entry.tags) {
      if (meaningfulWords.includes(tag)) {
        score += 3;
      } else if (normalizedQuery.includes(tag)) {
        // Partial phrase match
        score += 1;
      }
    }

    // Content match (Low weight)
    const lowerContent = entry.content.toLowerCase();
    for (const word of meaningfulWords) {
      if (lowerContent.includes(word)) {
        score += 0.5;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }
  
  // 3. Construct Intelligent Answer
  let responseText = "I don't have specific offline data for that query in my Encyclopedia. However, remember that mastering the biological basics—sleep, hydration, sunlight, and movement—is the foundation of all human optimization.";
  
  if (bestMatch && maxScore > 1) {
    responseText = `**${bestMatch.topic}**\n\n${bestMatch.content}`;
  }
  
  
  let disclaimer = "*(Disclaimer: This is a pre-programmed response from the WelGPT Offline Health Encyclopedia because the cloud AI API quota has been reached.)*";
  if (errorMessage && errorMessage.includes("API Key is missing")) {
    disclaimer = "*(Disclaimer: I am operating in offline mode because the GOOGLE_GENERATIVE_AI_API_KEY environment variable is missing in your Vercel project settings!)*";
  }
  
  return responseText + "\n\n" + disclaimer;

}
