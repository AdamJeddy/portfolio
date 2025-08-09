'use client'

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { Post, PostMatter } from '@/lib/content'
import PostCard from '@/components/content/PostCard'

const categories = [
  { id: 'all', label: 'All Content', icon: '📚' },
  { id: 'book', label: 'Books', icon: '📖' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'others', label: 'Others', icon: '🌟' },
] as const

interface Props {
  posts: Post[]
}

export default function ContentList({ posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<'all' | PostMatter['category']>('all')

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts
    return posts.filter((p) => p.data.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-neutral-50 to-secondary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6"
          >
            Content{' '}
            <span className="bg-gradient-to-r from-secondary-600 to-accent-teal bg-clip-text text-transparent">
              Center
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-neutral-600 max-w-3xl mx-auto"
          >
            Insights, reviews, and thoughts on technology, books, and the intersection of innovation with everyday life.
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-secondary-600 text-white shadow-glow'
                  : 'bg-white text-neutral-700 hover:bg-secondary-50 border border-neutral-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-700 mb-2">
              {activeCategory === 'all' ? 'Content Coming Soon' : `No ${categories.find(c => c.id === activeCategory)?.label} Posts Yet`}
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              I'm working on creating valuable content. Check back soon for insights, reviews, and technical posts!
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-secondary-600 to-accent-teal rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-semibold mb-4">
              Stay Updated
            </h3>
            <p className="text-secondary-100 mb-6 max-w-2xl mx-auto">
              Get notified when I publish new content about technology, innovation, and insights from the world of AI and data science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-full text-neutral-900 placeholder-neutral-500 flex-1"
              />
              <button className="px-6 py-3 bg-white text-secondary-600 rounded-full font-medium hover:bg-neutral-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-secondary-200 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
