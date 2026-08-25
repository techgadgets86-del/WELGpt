export interface BlogPost {
  id: string;
  title: string;
  desc: string;
  icon: string;
  content: string;
  readTime: string;
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  "dopamine": {
    id: "dopamine",
    title: "The Ultimate Dopamine Detox",
    desc: "Reset your brain's reward system",
    icon: "🧠",
    readTime: "6 min read",
    content: `
      <h2>Part 1: The Dopamine Misconception</h2>
      <p>There is a widespread misconception that dopamine is the "pleasure" molecule. When people talk about getting a "hit of dopamine" from eating a donut or scrolling through social media, they often equate the chemical with the feeling of reward. However, neuroscientists have long known that dopamine is actually the molecule of <strong>motivation, drive, and craving</strong>.</p>
      <p>Dopamine is what makes you <em>want</em> the donut. It is what makes you <em>want</em> to keep scrolling. It narrows your focus and compels you to take action toward a perceived reward. In our evolutionary past, this mechanism was essential for survival. It drove our ancestors to hunt for food, seek shelter, and reproduce. Today, however, our environment is hijacked by supernormal stimuli.</p>

      <h2>Part 2: The Baseline Dilemma</h2>
      <p>Every individual has a baseline level of dopamine in their brain. When you engage in a highly stimulating activity—such as playing a fast-paced video game, scrolling through short-form video apps, or eating highly palatable processed foods—your dopamine levels spike drastically.</p>
      <p>But the brain is a homeostatic machine. It always seeks balance. When dopamine spikes too high, the brain compensates by down-regulating dopamine receptors. After the activity is over, your dopamine doesn't just return to its baseline; it drops <em>below</em> baseline. This is known as the dopamine trough.</p>
      <p>When you are in a dopamine trough, you feel lethargic, unmotivated, and mildly depressed. The only thing that seems appealing is returning to the highly stimulating activity that caused the spike in the first place. Over time, chronic engagement with high-dopamine activities permanently lowers your baseline. Normal, everyday activities like reading a book, going for a walk, or working on a long-term project simply do not release enough dopamine to overcome the deficit.</p>

      <h2>Part 3: The Protocol for Resetting</h2>
      <p>A Dopamine Detox (or Dopamine Fasting) is a behavioral cognitive therapy technique designed to reset this baseline. It is not about eliminating dopamine completely—that is biologically impossible and would be fatal. Instead, it is about eliminating <strong>cheap, effortless dopamine</strong> so that your brain can recalibrate and find joy in difficult, meaningful tasks.</p>
      <p>Here is the ultimate protocol for a 24-hour dopamine detox:</p>
      <ul>
          <li><strong>No Digital Screens:</strong> Turn off your phone, computer, and television. If you must use a device for an emergency, set it to grayscale mode.</li>
          <li><strong>No Processed Foods:</strong> Consume only whole, single-ingredient foods. No sugar, no artificial sweeteners, no highly palatable junk food.</li>
          <li><strong>No Artificial Entertainment:</strong> No music, no podcasts, no video games. Your brain needs silence to recover its sensitivity to subtle stimuli.</li>
      </ul>
      <p>By depriving yourself of supernormal stimuli, your dopamine receptors will begin to up-regulate. The next day, you will find that reading, studying, or working on your goals feels inherently more rewarding.</p>
    `
  },
  "melatonin": {
    id: "melatonin",
    title: "Mastering Melatonin",
    desc: "Optimize your sleep cycle",
    icon: "💤",
    readTime: "8 min read",
    content: `
      <h2>Part 1: The Hormone of Darkness</h2>
      <p>Melatonin is perhaps the most misunderstood hormone in the public consciousness. Walk into any pharmacy, and you will see it sold as a natural sleeping pill, often in massive doses of 5mg to 10mg. However, melatonin is not a sedative. It does not put you to sleep. Rather, it is the hormone of <em>darkness</em>. It signals to your brain and body that it is time to transition into a state conducive to sleep.</p>

      <h2>Part 2: The Circadian Rhythm and the SCN</h2>
      <p>Your body operates on a roughly 24-hour cycle known as the circadian rhythm. The master clock controlling this rhythm is a cluster of neurons in the hypothalamus called the Suprachiasmatic Nucleus (SCN). The SCN relies almost entirely on light input from your eyes to determine what time it is.</p>
      <p>When sunlight enters your eyes in the morning, it hits intrinsically photosensitive retinal ganglion cells (ipRGCs). These cells send a signal directly to the SCN, which then suppresses the pineal gland's production of melatonin. This light exposure sets a timer: approximately 14 to 16 hours later, assuming it is dark, the pineal gland will begin releasing melatonin to prepare your body for sleep.</p>

      <h2>Part 3: The Blue Light Catastrophe</h2>
      <p>For most of human history, the setting of the sun meant absolute darkness, perhaps interrupted only by the warm glow of a fire. Today, our eyes are bombarded by bright, artificial light long after sunset. LED screens, overhead lighting, and street lamps emit a high concentration of blue-spectrum light.</p>
      <p>When this blue light hits your eyes at 10:00 PM, your SCN registers it as midday sunlight. It forcefully suppresses melatonin production, throwing your circadian rhythm into chaos. You may still fall asleep due to exhaustion, but your sleep architecture—the crucial balance of Deep Sleep and REM sleep—will be severely compromised.</p>

      <h2>Part 4: The Problem with Supplementation</h2>
      <p>If you lack natural melatonin because of screen use, taking a pill seems like the logical solution. However, over-the-counter melatonin is highly problematic for several reasons:</p>
      <ul>
          <li><strong>Dosage Discrepancies:</strong> Studies have shown that the actual amount of melatonin in supplements can vary from -83% to +478% of the labeled dose.</li>
          <li><strong>Supraphysiological Doses:</strong> The body naturally produces less than 0.5mg of melatonin per night. Taking a 5mg or 10mg pill floods your system with 10 to 20 times the natural amount, leading to morning grogginess and down-regulation of your natural production.</li>
          <li><strong>Timing Issues:</strong> Melatonin must be timed perfectly with your circadian rhythm. Taking it at the wrong time can phase-shift your clock, making your sleep issues worse.</li>
      </ul>

      <h2>Part 5: The Ultimate Sleep Protocol</h2>
      <p>To master melatonin, you must master your light environment. Follow this protocol for perfect natural melatonin release:</p>
      <ul>
          <li><strong>Morning Light:</strong> View sunlight outside, without sunglasses, within 30-60 minutes of waking. Do this for 10-30 minutes depending on cloud cover.</li>
          <li><strong>Sunset Light:</strong> Viewing the sunset provides a specific wavelength of light that signals to your SCN that the day is ending, protecting your brain against the negative effects of artificial light later in the evening.</li>
          <li><strong>The Evening Cave:</strong> After 8:00 PM, dim all lights in your house. Switch to warm, red or orange hues. Turn off bright overhead lights and use low-placed lamps.</li>
          <li><strong>Screen Curfews:</strong> Stop looking at screens 60 to 90 minutes before bed. If you must use a screen, use blue-light blocking glasses or software like f.lux to heavily filter the blue spectrum.</li>
      </ul>
      <p>By protecting your natural melatonin, you will fall asleep faster, achieve higher percentages of Deep and REM sleep, and wake up feeling truly restored.</p>
    `
  },
  "adenosine": {
    id: "adenosine",
    title: "Adenosine & Caffeine",
    desc: "The truth about your daily coffee",
    icon: "☕",
    readTime: "7 min read",
    content: `
      <h2>Part 2: The Caffeine Illusion</h2>
      <p>Billions of people rely on caffeine to wake up and stay alert. But caffeine does not actually provide energy in the form of calories or ATP. Instead, caffeine is an incredibly effective adenosine antagonist.</p>
      <p>The molecular structure of caffeine is remarkably similar to adenosine. When you drink a cup of coffee, the caffeine molecules rush to your brain and slot perfectly into your adenosine receptors. However, unlike adenosine, caffeine does not activate the receptor to induce sleepiness. It simply blocks it. It acts like a piece of tape over a sensory dial.</p>
      <p>While the caffeine is blocking the receptors, you feel alert and energetic. But here is the critical catch: your body is still burning ATP, and adenosine is still building up. It just has nowhere to bind.</p>

      <h2>Part 3: The Afternoon Crash</h2>
      <p>Caffeine has a half-life of about 5 to 7 hours. As your liver enzymes metabolize the caffeine, it begins to unbind from the adenosine receptors. When this happens, all of the adenosine that has been building up in the background suddenly rushes in and binds to the newly freed receptors all at once.</p>
      <p>This massive influx of sleep pressure is the biological cause of the dreaded afternoon crash. You go from feeling completely alert to overwhelmingly exhausted in a matter of minutes.</p>

      <h2>Part 4: The 90-Minute Rule</h2>
      <p>If you want to enjoy caffeine without suffering the afternoon crash, you must change <em>when</em> you drink it. Most people reach for coffee immediately upon waking. This is a critical mistake.</p>
      <p>When you wake up, you still have some residual adenosine in your system from the night before. Your body naturally produces a spike in cortisol upon waking, which helps clear this residual adenosine. If you immediately drink coffee, you block the receptors before the cortisol can clear the existing adenosine.</p>
      <p><strong>The Protocol:</strong> Delay your first cup of caffeine for 90 to 120 minutes after waking. This gives your natural cortisol spike time to clear out the residual sleep pressure. When you finally drink your coffee, the caffeine will block the receptors, but there won't be a massive backlog of adenosine waiting to ambush you when it wears off. The result is sustained, smooth energy all day, and no 2:00 PM crash.</p>

      <h2>Part 5: Caffeine Half-Life and Sleep Architecture</h2>
      <p>Even if you avoid the crash, caffeine can still destroy your sleep. Because of its 5-to-7-hour half-life, a cup of coffee consumed at 3:00 PM means that by 10:00 PM, 50% of the caffeine is still active in your brain. A quarter of it is still active at 3:00 AM.</p>
      <p>Even if you manage to fall asleep with caffeine in your system, it severely reduces the amount of Deep Sleep (Slow Wave Sleep) you obtain. Deep sleep is when your body repairs tissue and your brain clears out amyloid-beta plaques. To protect your brain architecture, impose a strict caffeine curfew of 2:00 PM, or at least 10 hours before your target bedtime.</p>
    `
  },
  "neuroplasticity": {
    id: "neuroplasticity",
    title: "Neuroplasticity 101",
    desc: "How to actually rewire your habits",
    icon: "🌱",
    readTime: "9 min read",
    content: `
      <h2>Part 1: The Mutable Brain</h2>
      <p>For decades, the scientific consensus was that the adult human brain was a static, fixed organ. It was believed that once you reached your mid-twenties, your neural circuitry was set in stone, and the only change possible was a slow decline as neurons died off. We now know this is fundamentally false.</p>
      <p>Through a process called neuroplasticity, your brain is constantly changing its physical structure in response to your environment, your actions, and even your thoughts. As the famous Hebbian axiom goes, <em>"Neurons that fire together, wire together."</em> When you repeat a behavior, the neural circuits associated with that behavior strengthen, becoming faster and more efficient.</p>

      <h2>Part 2: The Two Phases of Plasticity</h2>
      <p>Children possess passive neuroplasticity; their brains soak up information effortlessly. Adults, however, must actively trigger plasticity. Adult neuroplasticity is a two-step process: the trigger, and the rewiring.</p>
      <p><strong>Phase 1: The Trigger (Focus and Alertness)</strong><br>
      To signal to your brain that it needs to change, you must enter a state of extreme focus and alertness. This state is chemically mediated by two neuromodulators: epinephrine (adrenaline) for alertness, and acetylcholine for focus. When you try to learn something difficult, you will feel a sense of agitation, frustration, and friction. This friction is not a sign that you should quit; it is the chemical signature of epinephrine and acetylcholine marking the neural circuits for change.</p>
      <p><strong>Phase 2: The Rewiring (Deep Rest)</strong><br>
      The actual rewiring of the neural circuits does <em>not</em> happen while you are learning. It happens while you are resting. Specifically, neuroplasticity solidifies during Deep Sleep (Slow Wave Sleep) and Non-Sleep Deep Rest (NSDR). If you intensely focus on a new skill but fail to get high-quality sleep that night, the rewiring process will be aborted.</p>

      <h2>Part 3: The Protocol for Rapid Learning</h2>
      <p>If you want to learn a new skill, break a bad habit, or build a new one, you must leverage this two-step biological process. Here is the protocol:</p>
      <ul>
          <li><strong>The Ultradian Rhythm:</strong> Focus intensely for no more than 90 minutes. This matches the brain's natural ultradian cycles. Turn off all distractions.</li>
          <li><strong>Embrace the Friction:</strong> Expect the first 10-15 minutes of the learning session to feel terrible. Your brain is resisting the effort. Push through the agitation.</li>
          <li><strong>Micro-Rests:</strong> During the 90-minute bout, randomly pause for 10 seconds and do nothing. Close your eyes. Studies show that these micro-rests allow the hippocampus to replay the sequence of learning at 20x speed, accelerating plasticity.</li>
          <li><strong>Post-Learning NSDR:</strong> Immediately after the 90-minute focus bout, engage in 10-20 minutes of Non-Sleep Deep Rest (NSDR). This can be a Yoga Nidra meditation or simply lying flat with your eyes closed. This shifts your nervous system from sympathetic (alert) to parasympathetic (rest), beginning the consolidation process.</li>
      </ul>

      <h2>Part 4: Unlearning Bad Habits</h2>
      <p>Neuroplasticity is completely agnostic. It doesn't care if you are wiring in a good habit (like studying) or a bad habit (like smoking or doomscrolling). To unlearn a bad habit, you cannot simply "try not to do it." You must actively wire in a replacement behavior.</p>
      <p>When the urge to engage in a bad habit arises, recognize the craving (this is dopamine acting). Instead of engaging in the bad habit, immediately execute a replacement behavior—even something as simple as doing 10 pushups or drinking a glass of water. By repeatedly firing the new circuit in the presence of the trigger, the old circuit will undergo Long-Term Depression (LTD), weakening over time.</p>
      <p>Your brain is entirely under your control. By mastering the chemical levers of focus and rest, you can architect the mind you want.</p>
    `
  }
};
