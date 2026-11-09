import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  CheckSquare,
  Calendar,
  Bell,
  Sparkles,
  Zap,
  ShieldCheck,
  Dumbbell,
  Clock,
  ArrowRight,
  Star,
  Activity,
  Check,
  X,
  Smartphone,
  ChevronDown,
  Award,
  Users,
  Compass,
} from "lucide-react";

export default function AiAssistantHubPage() {
  const faqs = [
    {
      q: "What makes WelBuddy the best AI assistant in the United States?",
      a: "Unlike generic chat bots that only answer questions, WelBuddy is an action-oriented personal AI assistant engineered for American professionals. It combines executive task management with circadian rhythm scheduling, exercise auto-sync, and lock-screen notification alerts to safeguard your nervous system while accelerating business velocity.",
    },
    {
      q: "How is WelBuddy different from Siri, Google Assistant, or ChatGPT?",
      a: "Traditional voice assistants (Siri, Google Assistant) perform simple device commands like setting timers or playing music. Chat bots like ChatGPT produce text but lack habit loops and scheduled accountability. WelBuddy bridges both worlds: it acts as a strategic business partner, choreographs your day based on biological energy peaks, and sends proactive notifications directly to your phone even when locked.",
    },
    {
      q: "Can this AI assistant improve my daily productivity and mental health simultaneously?",
      a: "Yes. WelBuddy runs on a proprietary Dual-Engine Architecture: an Executive Driver that timeboxes high-leverage business priorities into 90-minute ultradian flow blocks, and a Parasympathetic Regulator that protects your nervous system through guided physiological sighs, NSDR (Non-Sleep Deep Rest) reboot audio, and dopamine detox fasting.",
    },
    {
      q: "Does WelBuddy AI Assistant deliver notifications when my phone is locked or closed?",
      a: "Yes. WelBuddy utilizes Advanced Lock-Screen Service Worker push notifications, sending scheduled morning energy briefings, midday circadian resets, and evening wind-down reminders directly to your device screen across iOS, Android, macOS, and Windows.",
    },
    {
      q: "How does the routine and exercise auto-sync feature work?",
      a: "Whenever you generate or customize a routine in WelBuddy's Daily Routines or Sensei modules, all recommended physical exercises, mobility drills, and wellness protocols are automatically synced into your WelBuddy Tasks with real-time checkbox tracking.",
    },
    {
      q: "Is WelBuddy free to use in the US?",
      a: "Yes! WelBuddy is available completely free with no credit card required. You can launch your personal workspace instantly in any web browser or install it as a Progressive Web App (PWA) on your mobile home screen.",
    },
  ];

  const comparisonData = [
    { feature: "Executive Task Prioritization", welbuddy: true, chatgpt: "Manual", siri: false, google: false },
    { feature: "Circadian Energy Scheduling", welbuddy: true, chatgpt: false, siri: false, google: false },
    { feature: "Exercise Routine Auto-Sync", welbuddy: true, chatgpt: false, siri: false, google: false },
    { feature: "Lock-Screen Push Notifications", welbuddy: true, chatgpt: false, siri: "Alarms only", google: "Alarms only" },
    { feature: "Nervous System & NSDR Resets", welbuddy: true, chatgpt: false, siri: false, google: false },
    { feature: "3 Adaptive Personas (Operator/Stoic/Compassionate)", welbuddy: true, chatgpt: "Prompt required", siri: false, google: false },
    { feature: "Full PWA Mobile Install", welbuddy: true, chatgpt: true, siri: false, google: false },
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "SaaS Founder",
      city: "San Francisco, CA",
      quote: "WelBuddy replaced three separate apps (habit tracker, Pomodoro timer, and ChatGPT). Having an AI assistant that prioritizes my high-leverage revenue tasks while protecting my sleep is game-changing.",
      rating: 5,
    },
    {
      name: "Elena Rostova",
      role: "Venture Capital Partner",
      city: "New York, NY",
      quote: "The Operator persona keeps my partner meetings and deal flows razor-sharp, while the lock-screen reminders keep me grounded in breathwork during high-pressure negotiations.",
      rating: 5,
    },
    {
      name: "Devon Chen",
      role: "Lead Systems Architect",
      city: "Austin, TX",
      quote: "The 90-minute flow sprint feature and routine exercise auto-sync keep me in peak cognitive state. Easily the best AI assistant app I've used in the US.",
      rating: 5,
    },
  ];

  // Schema.org FAQPage & ItemPage for Google US SERP Rich Snippets
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Assistant — The #1 Personal & Executive AI Assistant in the US | WelBuddy",
    "description": "Meet WelBuddy: The best AI assistant in the United States engineered for peak business velocity and mental wellness.",
    "url": "https://app.welgpt.space/ai-assistant",
    "inLanguage": "en-US",
    "areaServed": {
      "@type": "Country",
      "name": "United States",
      "identifier": "US"
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-teal-500 selection:text-black">
      {/* Inject Specific Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li className="text-white font-semibold flex items-center gap-1.5">
              <Image src="/logo-icon.png" alt="WelBuddy AI" width={20} height={20} className="object-contain" priority />
              <span>AI Assistant</span>
            </li>
          </ol>
          <Link
            href="/coach"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all active:scale-[0.98]"
          >
            Launch AI Assistant <ArrowRight size={14} />
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="text-center py-6 sm:py-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Award size={14} className="text-teal-400" />
            <span>#1 Rated AI Assistant in the USA — 2026 Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            The Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-violet-300 to-purple-400">AI Assistant</span> for Work & Wellness
          </h1>

          <p className="text-gray-300 text-base sm:text-xl leading-relaxed mb-8">
            Engineered for ambitious professionals, founders, and creators across the United States. 
            WelBuddy pairs high-velocity executive task execution with circadian routine sync, nervous system recovery, and lock-screen push alerts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/coach"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 hover:from-violet-500 hover:to-teal-400 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-violet-600/30 transition-all active:scale-[0.98]"
            >
              <Zap size={18} />
              <span>Get Started Free — Open WelBuddy</span>
            </Link>
            <Link
              href="#comparison"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium text-base transition-all flex items-center justify-center gap-2"
            >
              <span>See Comparison Matrix</span>
            </Link>
          </div>

          {/* Social Proof Star Badge */}
          <div className="mt-8 flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-400">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="font-semibold text-white">4.9 / 5.0 Rating</span>
            <span className="text-gray-500">•</span>
            <span>1,280+ US Executives & High-Performers</span>
          </div>
        </header>

        {/* Featured Snippet / Entity Definition Box (Targeted for Google AI Overviews & SGE) */}
        <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm uppercase tracking-wider mb-3">
            <Brain size={18} />
            <span>What is an AI Assistant in 2026?</span>
          </div>
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            An <strong>AI Assistant</strong> is an intelligent autonomous companion designed to execute complex daily tasks, organize schedules, and maximize personal capability. While first-generation tools only answered prompts with text, modern AI assistants like <strong>WelBuddy</strong> provide proactive lifestyle architecture: aligning high-leverage business objectives with neurobiological circadian rhythms, syncing physical workout protocols into actionable to-do lists, and safeguarding cognitive energy with lock-screen accountability.
          </p>
        </section>

        {/* 5 Core Pillars of WelBuddy AI Assistant */}
        <section className="my-16 sm:my-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Why WelBuddy Outperforms Generic AI Tools
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Built on evidence-backed neurobiology and executive efficiency protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4">
                  <CheckSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Executive Task Engine</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Breaks massive quarterly deliverables into high-leverage 90-minute ultradian flow blocks. WelBuddy prioritizes the critical 20% that produces 80% of business results.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-4">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Circadian Choreographer</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Schedules deep work during natural morning dopamine and cortisol peaks, and slots NSDR (Non-Sleep Deep Rest) during afternoon alertness dips.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4">
                  <Dumbbell size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Routine & Workout Sync</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Automatic bidirectional sync: any physical workout, mobility sequence, or habit protocol created in your Daily Routine is automatically converted into WelBuddy tasks.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4">
                  <Bell size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Lock-Screen Notification Access</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Proactive Service Worker notifications deliver scheduled energy briefings, sprint reminders, and bedtime wind-downs even when the phone is locked or app is closed.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">3 Adaptive Personas</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Switch between <strong>High-Stakes Operator</strong> (ruthless execution velocity), <strong>Stoic Partner</strong> (calm, grounded accountability), and <strong>Compassionate Anchor</strong> (somatic anti-burnout).
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">PWA Mobile Experience</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Installable directly to home screens on iOS and Android without app store delays. 100% responsive for iPhone SE, mini, standard, and Pro Max screens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section (Targeted for Google SERP Table Snippet) */}
        <section id="comparison" className="my-16 sm:my-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
              <span>Feature Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              WelBuddy vs Traditional AI Assistants
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              See why high-performers are upgrading from generic voice commands and basic chat bots.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04]">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-300">Capability</th>
                  <th className="py-4 px-6 font-bold text-teal-300 bg-teal-500/10">WelBuddy AI</th>
                  <th className="py-4 px-6 font-semibold text-gray-400">ChatGPT</th>
                  <th className="py-4 px-6 font-semibold text-gray-400">Apple Siri</th>
                  <th className="py-4 px-6 font-semibold text-gray-400">Google Assistant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{row.feature}</td>
                    <td className="py-4 px-6 bg-teal-500/5 font-semibold text-teal-300">
                      <div className="flex items-center gap-1.5">
                        <Check size={16} className="text-teal-400" />
                        <span>Included</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {row.chatgpt === true ? (
                        <Check size={16} className="text-gray-300" />
                      ) : row.chatgpt === false ? (
                        <X size={16} className="text-gray-600" />
                      ) : (
                        row.chatgpt
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {row.siri === true ? (
                        <Check size={16} className="text-gray-300" />
                      ) : row.siri === false ? (
                        <X size={16} className="text-gray-600" />
                      ) : (
                        row.siri
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {row.google === true ? (
                        <Check size={16} className="text-gray-300" />
                      ) : row.google === false ? (
                        <X size={16} className="text-gray-600" />
                      ) : (
                        row.google
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* US City & Executive Social Proof */}
        <section className="my-16 sm:my-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
              <Users size={14} />
              <span>Tested Across US Metros</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Trusted by American Executives & Founders
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              From Silicon Valley to Manhattan, here is how leaders use WelBuddy every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-teal-400 font-medium">{t.role}</div>
                  <div className="text-xs text-gray-500">{t.city}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section with Google Rich Accordions */}
        <section className="my-16 sm:my-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-base">
              Common questions about using an AI Assistant for business and wellness.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-white/[0.03] border border-white/10 p-5 open:bg-white/[0.06] transition-all"
              >
                <summary className="font-semibold text-base text-white cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="text-teal-400 transition-transform group-open:rotate-180 shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="my-16 p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-teal-900/60 border border-white/20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Experience the Future of AI Assistants Today
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8">
              Join thousands of American leaders who have eliminated burnout and doubled their business leverage. Free forever.
            </p>
            <Link
              href="/coach"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-base hover:bg-gray-100 transition-all shadow-2xl active:scale-[0.98]"
            >
              <span>Launch WelBuddy AI Assistant</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Footer links */}
        <footer className="text-center border-t border-white/10 pt-8 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} WelBuddy AI by WelGPT. Designed for peak US performance & wellness.
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/welbuddy" className="hover:text-white transition-colors">WelBuddy Hub</Link>
            <Link href="/routine" className="hover:text-white transition-colors">Daily Routines</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
