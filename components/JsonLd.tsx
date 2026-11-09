// ==============================================================================
// JSON-LD Structured Data Schema for Google Rich Snippets & Knowledge Graph
// ==============================================================================

export default function JsonLd() {
  const structuredData = [
    // 1. SoftwareApplication Schema (Powers Google App Cards & Star Ratings)
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "WelBuddy AI",
      "alternateName": [
        "WelBuddy",
        "WelBuddy AI Assistant",
        "WelGPT WelBuddy",
        "WelBuddy Wellness Co-Pilot",
        "WelBuddy App"
      ],
      "applicationCategory": "HealthApplication, BusinessApplication",
      "operatingSystem": "All (Web, iOS, Android, macOS, Windows)",
      "url": "https://app.welgpt.space",
      "image": "https://app.welgpt.space/logo-icon.png",
      "screenshot": "https://app.welgpt.space/logo-full.png",
      "description": "WelBuddy is the premier AI assistant for the wellness of your mental and business life. It blends high-leverage business task management with neurobiology-backed routine scheduling, NSDR resets, and lock-screen notification accountability.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Freemium"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1280",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Organization",
        "name": "WelGPT",
        "url": "https://app.welgpt.space"
      }
    },

    // 2. Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WelGPT",
      "alternateName": "WelBuddy AI",
      "url": "https://app.welgpt.space",
      "logo": "https://app.welgpt.space/logo-full.png",
      "description": "Creator of WelBuddy, the premier AI assistant for mental and business wellness."
    },

    // 3. WebSite with Sitelinks SearchBox Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WelBuddy AI",
      "url": "https://app.welgpt.space",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://app.welgpt.space/explore?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },

    // 4. FAQPage Schema (Powers expandable Google Search rich snippet accordions)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is WelBuddy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WelBuddy is an advanced AI assistant designed to optimize both mental wellness and business velocity. It pairs high-leverage business task execution with neurobiology-backed routine scheduling, NSDR resets, and habit tracking."
          }
        },
        {
          "@type": "Question",
          "name": "How does WelBuddy balance mental wellness with business performance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WelBuddy operates on a dual-engine architecture: an Executive Driver that breaks down high-impact business deliverables into focused sprint blocks, and a Parasympathetic Regulator that protects your nervous system from burnout through guided circadian light anchors, posture resets, and dopamine detox protocols."
          }
        },
        {
          "@type": "Question",
          "name": "Can WelBuddy send notifications when the app is closed or phone is locked?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, WelBuddy features Advanced Lock-Screen Notification access via Service Worker push technology, delivering scheduled morning briefings, routine alerts, and focus sprints even when the app is closed or your device is locked."
          }
        },
        {
          "@type": "Question",
          "name": "How do exercises from my routines sync with WelBuddy Tasks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WelBuddy includes a real-time routine-to-task sync engine. Any physical exercises, calisthenics, mobility drills, or workout protocols generated in your Daily Routines or Sensei are automatically converted into categorized WelBuddy Tasks with bidirectional progress tracking."
          }
        },
        {
          "@type": "Question",
          "name": "Is WelBuddy available on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, WelBuddy is fully responsive and optimized for every mobile device (iPhone SE, mini, standard, Pro Max, and Android). It can be installed directly to your home screen as a Progressive Web App (PWA)."
          }
        }
      ]
    }
  ];

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
