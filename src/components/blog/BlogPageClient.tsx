'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured: boolean
}

interface BlogPageClientProps {
  posts: Post[]
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Industry News', 'Printing Guides', 'Company Updates']

  // Find the featured post
  const featuredPost = posts.find(p => p.featured) ?? posts[0]

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // If "All", we list all non-featured posts in the grid, or if a category is selected, we filter by category
    if (activeCategory === 'All') {
      return !post.featured
    }
    return post.category === activeCategory
  })

  // Format dates nicely
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-body)] min-h-screen">
      {/* PAGE HEADER */}
      <section className="py-16 bg-[var(--color-canvas)] border-b border-[var(--color-border-light)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase block mb-3">
            / INSIGHTS & UPDATES
          </span>
          <h1 className="font-[var(--font-display)] text-[34px] md:text-[52px] font-extrabold text-[var(--color-ink)] leading-none tracking-tight mb-4">
            The Fortune India Blog.
          </h1>
          <p className="font-[var(--font-body)] text-[15px] md:text-[17px] text-[var(--color-muted)] max-w-2xl leading-relaxed">
            Industry news, printing guides, and company updates from Bangalore.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      {activeCategory === 'All' && featuredPost && (
        <section className="py-12 bg-[var(--color-surface-alt)] border-b border-[var(--color-border-light)]">
          <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
            <div className="bg-white border border-[var(--color-border)] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image Zone (55%) */}
              <div className="lg:col-span-7 bg-[var(--color-signal-tint)] aspect-video relative flex flex-col items-center justify-center p-8 overflow-hidden group">
                {/* Background decorative pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:20px_20px] group-hover:scale-105 transition-transform duration-500"></div>
                <span className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📖</span>
                <span className="font-[var(--font-mono)] text-[12px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
                  FEATURED ARTICLE
                </span>
                
                {/* Overlay Badge Top-Left */}
                <div className="absolute top-4 left-4 z-10 bg-[var(--color-signal)] text-white text-[10px] font-bold font-[var(--font-mono)] tracking-wider px-3 py-1.5 rounded-full uppercase">
                  {featuredPost.category}
                </div>
              </div>

              {/* Text Zone (45%) */}
              <div className="lg:col-span-5 p-8 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3 font-[var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {formatDate(featuredPost.date)}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="font-[var(--font-display)] text-[24px] md:text-[28px] font-extrabold text-[var(--color-ink)] leading-snug tracking-tight">
                  {featuredPost.title}
                </h2>

                <p className="font-[var(--font-body)] text-[14.5px] leading-relaxed text-[var(--color-body)] opacity-95">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-2">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white text-[13px] font-bold text-[var(--color-ink)] transition-all cursor-pointer"
                  >
                    Read Article
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* FILTER TABS */}
      <section className="py-8 bg-[var(--color-canvas)] border-b border-[var(--color-border-light)] sticky top-[64px] z-30">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-[var(--font-body)] text-[13px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-signal-tint)] border-[var(--color-signal)] text-[var(--color-signal)]'
                      : 'bg-white border-[var(--color-border)] text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="py-16 max-w-[var(--container)] mx-auto px-4 md:px-8">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">📭</span>
            <h3 className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-ink)] mb-2">
              No articles found
            </h3>
            <p className="font-[var(--font-body)] text-[14px] text-[var(--color-muted)]">
              Try selecting a different category tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article
                key={post.id}
                className="bg-white border border-[var(--color-border)] rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1 group"
              >
                {/* Image Placeholder */}
                <div className="aspect-[16/10] bg-[var(--color-surface-alt)] relative flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:16px_16px] group-hover:scale-105 transition-transform duration-500"></div>
                  <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">📄</span>
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-signal)] text-[9px] font-bold font-[var(--font-mono)] tracking-wider px-2.5 py-1 rounded-full uppercase">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-3 font-[var(--font-mono)] text-[10px] text-[var(--color-muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(post.date)}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-signal)] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="font-[var(--font-body)] text-[13px] text-[var(--color-muted)] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 mt-auto border-t border-[var(--color-border-light)] flex justify-between items-center">
                    <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                      TODO: CMS Integration
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-[var(--font-mono)] text-[12px] font-bold text-[var(--color-signal)] hover:underline flex items-center gap-1 transition-all"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
