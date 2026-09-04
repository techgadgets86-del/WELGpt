"use client";

import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogData";

export default function BlogPage() {
  const posts = Object.values(BLOG_POSTS);

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 min-h-full flex pb-[160px] md:pb-12 flex-col">
      <header className="mb-12">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white font-serif"
        >
          The WelGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Blog.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Explore the science of your brain.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full block"
            >
              <MagicCard gradientColor="#c084fc" gradientTo="#d946ef" gradientOpacity={0.15} className="cursor-pointer h-full p-8 border border-white/5 bg-[#111127]/50 hover:bg-[#111127]/80 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl drop-shadow-md bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10">{post.icon}</div>
                  <span className="text-xs font-mono text-fuchsia-400 bg-fuchsia-400/10 px-3 py-1 rounded-full border border-fuchsia-400/20">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{post.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{post.desc}</p>
              </MagicCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
