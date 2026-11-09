import { BLOG_POSTS } from "@/lib/blogData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import DetoxTimer from "@/components/DetoxTimer";
import "./blog-content.css";
import type { Metadata } from "next";

// Required for dynamic routes
export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.id];
  if (!post) {
    return {
      title: "Research Article Not Found | WelBuddy AI",
    };
  }

  const title = `${post.title} — Neuroscience Protocol | WelBuddy AI`;
  const description = post.desc || `Comprehensive behavioral neuroscience research on ${post.title}. Learn how WelBuddy optimizes neural sensitivity.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://app.welgpt.space/blog/${resolvedParams.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://app.welgpt.space/blog/${resolvedParams.id}`,
      type: "article",
      siteName: "WelBuddy AI",
      images: [
        {
          url: "/logo-full.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo-full.png"],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.id];

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.desc,
    "author": {
      "@type": "Organization",
      "name": "WelBuddy AI Research Team",
      "url": "https://app.welgpt.space"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WelGPT",
      "logo": {
        "@type": "ImageObject",
        "url": "https://app.welgpt.space/logo-full.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://app.welgpt.space/blog/${resolvedParams.id}`
    },
    "image": "https://app.welgpt.space/logo-full.png",
    "datePublished": "2026-09-01T00:00:00Z",
    "dateModified": new Date().toISOString()
  };

  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-4 min-h-full flex pb-[160px] md:pb-12 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group w-fit">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono text-sm tracking-widest uppercase">Back to Library</span>
      </Link>

      <header className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-[100px] -z-10 rounded-full" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(192,132,252,0.15)]">
            {post.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-fuchsia-400 tracking-widest uppercase mb-1">Behavioral Research</span>
            <div className="flex items-center gap-3 text-sm text-gray-400 font-mono">
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white font-serif leading-[1.1]">
          {post.title}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed border-l-4 border-fuchsia-500/50 pl-6">
          {post.desc}
        </p>
      </header>

      {/* Action Bar */}
      <div className="flex items-center gap-4 py-6 border-y border-white/10 mb-12">
        <ShareButton 
          title={post.title} 
          text={post.desc} 
          url={`/blog/${post.id}`} 
        />
      </div>

      {/* Article Content */}
      <article 
        className="blog-content prose prose-invert prose-violet max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {resolvedParams.id === "focus" && (
        <DetoxTimer />
      )}
    </div>
  );
}
