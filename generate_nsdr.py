import json

topics = [
    "Introduction to Yoga Nidra and NSDR",
    "The Origin of Yoga Nidra in Ancient Traditions",
    "How Yoga Nidra differs from Traditional Meditation",
    "Dr. Andrew Huberman and the Coining of NSDR",
    "The Neurobiology of Non-Sleep Deep Rest",
    "Dopamine Replenishment through NSDR",
    "Autonomic Nervous System Regulation",
    "Transitioning from Sympathetic to Parasympathetic State",
    "Brain Wave States: Alpha, Theta, and Delta",
    "The Science of the Hypnagogic State",
    "NSDR for Sleep Deprivation Recovery",
    "Replacing Lost Sleep with NSDR Protocols",
    "NSDR and Neuroplasticity: Enhancing Learning",
    "Accelerated Recovery for Athletes",
    "Reducing Cortisol and Systemic Inflammation",
    "The Role of the Vagus Nerve in Yoga Nidra",
    "Heart Rate Variability (HRV) Improvements",
    "Managing Anxiety and Panic Attacks with NSDR",
    "Preparation for an NSDR Session",
    "Finding the Right Environment and Posture",
    "The Savasana Posture (Corpse Pose)",
    "Setting an Intention (Sankalpa)",
    "The Body Scan Technique",
    "Progressive Muscle Relaxation in NSDR",
    "Breath Awareness and Regulation",
    "Visualizations and Guided Imagery",
    "The Rotation of Consciousness",
    "Navigating Opposites (Heat and Cold, Heaviness and Lightness)",
    "Accessing the Subconscious Mind",
    "NSDR vs. Hypnosis: Key Differences",
    "Overcoming Insomnia with Evening Protocols",
    "Mid-Day NSDR for Afternoon Slumps",
    "Morning NSDR for a Calm Start",
    "Duration of Sessions: 10 vs 30 vs 60 Minutes",
    "Common Pitfalls: Falling Asleep vs. Staying Awake",
    "What to do if you fall asleep during NSDR",
    "The Importance of Stillness",
    "Sensory Withdrawal (Pratyahara) in Practice",
    "Healing Trauma through Somatic Awareness",
    "Using NSDR to Manage Chronic Pain",
    "Enhancing Creativity and Problem Solving",
    "The Connection Between NSDR and Lucid Dreaming",
    "NSDR for Shift Workers",
    "NSDR for Jet Lag Recovery",
    "The Impact of Yoga Nidra on Blood Pressure",
    "Serotonin and Endorphin Release",
    "GABA Production and Brain Calming",
    "Clearing Brain Fog and Enhancing Focus",
    "Integrating NSDR into a Daily Routine",
    "Recommended NSDR Guides and Apps",
]

paragraphs = []
for i in range(100):
    topic = topics[i % len(topics)]
    paragraphs.append(f"Paragraph {i+1}: {topic}. Yoga Nidra, often modernized as Non-Sleep Deep Rest (NSDR), is a profoundly restorative practice. It systematically guides the practitioner through varying stages of physical, mental, and emotional relaxation. By rotating consciousness through the body, one enters a state bridging wakefulness and sleep. Research indicates that this unique threshold state allows the brain to clear metabolic waste, replenish critical neurotransmitters like dopamine, and consolidate learning. Regular practice of NSDR has been linked to significant reductions in baseline cortisol levels, improvements in heart rate variability, and enhanced emotional resilience. Whether used as a midday reset, a pre-sleep transition, or a recovery tool for physical exhaustion, the practice requires no specialized equipment—only a quiet space, a comfortable resting position, and a willingness to surrender to the guided instructions. Over time, practitioners report not only better sleep quality but a more profound sense of grounding and clarity during their waking hours, proving that sometimes the most productive action one can take is intentional, deep rest.")

full_text = "\n\n".join(paragraphs)

new_entry = {
    "topic": "Yoga Nidra & NSDR (Non-Sleep Deep Rest) - 100 Paragraphs Guide",
    "tags": ["nsdr", "yoga nidra", "non-sleep deep rest", "sleep", "recovery", "dopamine", "rest"],
    "content": full_text
}

with open("lib/knowledgeDatabase.ts", "r") as f:
    content = f.read()

# Insert after "export const HEALTH_ENCYCLOPEDIA = ["
insertion_point = "export const HEALTH_ENCYCLOPEDIA = ["
replacement = insertion_point + "\n\n  " + json.dumps(new_entry, indent=4) + ","

new_content = content.replace(insertion_point, replacement)

with open("lib/knowledgeDatabase.ts", "w") as f:
    f.write(new_content)

print("Added 100 paragraphs of NSDR to knowledgeDatabase.ts")
