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
  Smartphone,
  ChevronDown,
} from "lucide-react";

export default function WelBuddyLandingPage() {
  const faqs = [
    {
      q: "What is WelBuddy?",
      a: "WelBuddy is an advanced AI assistant designed to optimize both mental wellness and business velocity. It pairs high-leverage business task execution with neurobiology-backed routine scheduling, NSDR resets, and habit tracking.",
    },
    {
      q: "How does WelBuddy balance mental wellness with business performance?",
      a: "WelBuddy operates on a dual-engine architecture: an Executive Driver that breaks down high-impact business deliverables into focused sprint blocks, and a Parasympathetic Regulator that protects your nervous system from burnout through guided circadian light anchors, posture resets, and dopamine detox protocols.",
    },
    {
      q: "Can WelBuddy send notifications when the app is closed or phone is locked?",
      a: "Yes, WelBuddy features Advanced Lock-Screen Notification access via Service Worker push technology, delivering scheduled morning briefings, routine alerts, and focus sprints even when the app is closed or your device is locked.",
    },
    {
      q: "How do exercises from my routines sync with WelBuddy Tasks?",
      a: "WelBuddy includes a real-time routine-to-task sync engine. Any physical exercises, calisthenics, mobility drills, or workout protocols generated in your Daily Routines or Sensei are automatically converted into categorized WelBuddy Tasks with bidirectional progress tracking.",
    },
    {
      q: "Is WelBuddy available on mobile devices?",
      a: "Yes, WelBuddy is fully responsive and optimized for every mobile device (iPhone SE, mini, standard, Pro Max, and Android). It can be installed directly to your home screen as a Progressive Web App (PWA).",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-teal-500 selection:text-black">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Image src="/logo-icon.png" alt="WelBuddy AI" width={28} height={28} className="object-contain" priority />
            <span className="font-bold tracking-tight text-white">WelBuddy AI</span>
          </Link>
          <Link
            href="/coach"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all active:scale-[0.98]"
          >
            Launch Workspace <ArrowRight size={14} />
          </Link>
        </div>

        {/* Hero Section */}
        <header className="text-center py-6 sm:py-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles size={14} className="text-teal-300" />
            The #1 AI Wellness &amp; Business Co-Pilot
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-violet-400 to-fuchsia-400">WelBuddy AI</span>.
            <br />
            Peak Velocity. Zero Burnout.
          </h1>

          <p className="text-base sm:text-xl text-gray-300 leading-relaxed mb-8">
            The premier AI assistant engineered for the wellness of your mental and business life. Harmonize high-leverage business execution with neurobiology-backed circadian routines and lock-screen accountability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/coach"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(45,212,191,0.35)] transition-all active:scale-[0.98]"
            >
              Open WelBuddy Workspace <ArrowRight size={16} />
            </Link>
            <Link
              href="/routine"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
            >
              <Calendar size={16} />
              Explore Routines
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</div>
              <div className="text-[11px] sm:text-xs text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span>1,280+ Reviews</span>
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-teal-300">90m</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">Ultradian Focus Sprints</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-violet-400">100%</div>
              <div className="text-[11px] sm:text-xs text-gray-400 mt-0.5">Device Sync &amp; Push</div>
            </div>
          </div>
        </header>

        {/* 4 Pillars Section */}
        <section className="py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Why High-Performers Choose WelBuddy
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              Traditional productivity tools cause anxiety. Meditation apps ignore your deadlines. WelBuddy merges both into a single co-pilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Feature 1 */}
            <article className="p-6 rounded-3xl bg-[#111127] border border-white/10 relative overflow-hidden group hover:border-violet-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                <CheckSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Executive Tasks &amp; 3-Step AI Breakdown
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Tackle intimidating business deliverables effortlessly. WelBuddy uses AI to break any complex project into 3 bite-sized 20% high-leverage execution steps with integrated timer launches.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span>Task Breakdown Engine</span> • <span>Detox Integration</span>
              </div>
            </article>

            {/* Feature 2 */}
            <article className="p-6 rounded-3xl bg-[#111127] border border-white/10 relative overflow-hidden group hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Circadian Ultradian Timeblocker
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Work in sync with human biology. Anchor your peak cognitive windows to morning cortisol, align afternoon resets with dopamine fasting, and prepare for deep restorative sleep.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span>.ics Calendar Export</span> • <span>One-Tap AI Optimization</span>
              </div>
            </article>

            {/* Feature 3 */}
            <article className="p-6 rounded-3xl bg-[#111127] border border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Routine Exercise &amp; Workout Auto-Sync
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Never miss a movement protocol. Physical exercises, calisthenics, and mobility drills from your Daily Routines and Sensei are automatically converted into WelBuddy Tasks with real-time bidirectional completion syncing.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span>Bidirectional Sync</span> • <span>Physical Calisthenics Engine</span>
              </div>
            </article>

            {/* Feature 4 */}
            <article className="p-6 rounded-3xl bg-[#111127] border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Advanced Lock-Screen Notifications
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Accountability that works even when your phone is locked or the app is closed. System Service Worker push alerts wake your device with morning briefings, workout calls, and posture resets.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span>PWA Background Push</span> • <span>Tactile Vibration Alerts</span>
              </div>
            </article>
          </div>
        </section>

        {/* Interactive FAQ Section (Schema Matched) */}
        <section className="py-12 border-t border-white/10 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-400">
              Everything you need to know about WelBuddy AI.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-[#111127] border border-white/10 open:border-violet-500/40 transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-white list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/60 via-indigo-950/50 to-teal-950/60 border border-white/15 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 relative z-10">
              Ready to Upgrade Your Mental &amp; Business Life?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 relative z-10">
              Join thousands of founders and professionals operating at their physiological and cognitive peak.
            </p>

            <Link
              href="/coach"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-black font-extrabold text-base shadow-xl shadow-teal-500/20 transition-all active:scale-[0.98] relative z-10"
            >
              Launch WelBuddy Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-white/10 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} WelGPT. All rights reserved. WelBuddy AI is an intelligent co-pilot designed for mental and business wellness.</p>
        </footer>
      </div>
    </div>
  );
}
