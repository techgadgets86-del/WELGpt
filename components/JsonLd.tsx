// ==============================================================================
// JSON-LD Structured Data Schema for Google Rich Snippets, Knowledge Graph & US Geo-Targeting
// ==============================================================================

export default function JsonLd() {
  const structuredData = [
    // 1. SoftwareApplication Schema (Powers Google App Cards, Star Ratings & SERP Badges)
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "WelBuddy AI Assistant",
      "alternateName": [
        "WelBuddy",
        "AI Assistant",
        "WelBuddy AI",
        "Best AI Assistant",
        "Personal AI Assistant",
        "WelGPT WelBuddy",
        "WelBuddy Wellness Co-Pilot",
        "Executive AI Assistant"
      ],
      "applicationCategory": "ProductivityApplication, HealthApplication, BusinessApplication",
      "operatingSystem": "All (Web, iOS, Android, macOS, Windows)",
      "url": "https://app.welgpt.space",
      "image": "https://app.welgpt.space/logo-icon.png",
      "screenshot": "https://app.welgpt.space/logo-full.png",
      "description": "WelBuddy is the #1 rated AI assistant in the United States engineered for peak business performance and mental wellness. Blends executive task management with circadian rhythm scheduling, NSDR resets, and lock-screen notification accountability.",
      "inLanguage": "en-US",
      "areaServed": {
        "@type": "Country",
        "name": "United States",
        "identifier": "US"
      },
      "countriesSupported": ["US", "CA", "GB", "AU"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Freemium",
        "availability": "https://schema.org/InStock",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        }
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

    // 2. Organization Schema with US Geographic Target
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WelGPT",
      "alternateName": ["WelBuddy AI", "WelBuddy AI Assistant"],
      "url": "https://app.welgpt.space",
      "logo": "https://app.welgpt.space/logo-full.png",
      "description": "Creator of WelBuddy, the leading personal and executive AI assistant for mental and business wellness in the United States.",
      "areaServed": {
        "@type": "Country",
        "name": "United States",
        "identifier": "US"
      },
      "sameAs": [
        "https://twitter.com/welgpt",
        "https://github.com/techgadgets86-del/WELGpt"
      ]
    },

    // 3. WebSite with Sitelinks SearchBox Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WelBuddy AI Assistant",
      "alternateName": "WelBuddy",
      "url": "https://app.welgpt.space",
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://app.welgpt.space/explore?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },

    // 4. Product / Service Schema Specifically Targeting "AI Assistant"
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Personal AI Assistant & Executive Wellness Co-Pilot",
      "name": "WelBuddy AI Assistant",
      "provider": {
        "@type": "Organization",
        "name": "WelGPT",
        "url": "https://app.welgpt.space"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Assistant Subscriptions",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "WelBuddy Free AI Assistant"
            },
            "price": "0",
            "priceCurrency": "USD"
          }
        ]
      }
    },

    // 5. FAQPage Schema (Powers expandable Google Search rich snippet accordions in US results)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best AI assistant in the United States?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WelBuddy is the top-rated AI assistant in the United States for 2026. Unlike generic chat bots, WelBuddy pairs executive business task execution with circadian rhythm scheduling, exercise routine auto-sync, and lock-screen push notifications to prevent burnout while maximizing daily leverage."
          }
        },
        {
          "@type": "Question",
          "name": "What is WelBuddy AI Assistant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WelBuddy is an advanced personal AI assistant engineered to optimize both mental wellness and business velocity. It pairs high-leverage business task management with neurobiology-backed routine scheduling, NSDR resets, and habit tracking."
          }
        },
        {
          "@type": "Question",
          "name": "How is WelBuddy different from Siri, Google Assistant, or ChatGPT?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While Siri and Google Assistant handle basic device commands, and ChatGPT generates static text responses, WelBuddy is an active lifestyle co-pilot: it breaks down quarterly business deliverables into 90-minute ultradian flow blocks, syncs workout exercises from daily routines, and delivers proactive notifications to your phone's lock screen even when closed."
          }
        },
        {
          "@type": "Question",
          "name": "Can WelBuddy send notifications when the app is closed or phone is locked?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, WelBuddy features Advanced Lock-Screen Notification access via Service Worker push technology, delivering scheduled morning energy briefings, routine alerts, and focus sprints even when the app is closed or your device is locked."
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
          "name": "Is WelBuddy AI Assistant free to use in the US?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, WelBuddy is completely free to use with no credit card required. Users in the US can launch it instantly on web or install it directly as a Progressive Web App (PWA) on iOS and Android."
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
