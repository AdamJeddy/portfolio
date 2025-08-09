'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Post } from '@/lib/content'
import { formatDate } from '@/lib/utils'

interface ContentPageProps {
  params: Promise<{ slug: string }>
}

const categoryColors = {
  book: 'bg-amber-100 text-amber-800',
  tech: 'bg-blue-100 text-blue-800',
  others: 'bg-purple-100 text-purple-800',
}

const categoryIcons = {
  book: '📖',
  tech: '💻',
  others: '🌟',
}

export default function ContentPage({ params }: ContentPageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const resolvedParams = await params
        // For now, we'll simulate loading a post
        // In a real implementation, you'd fetch from your content system
        setPost(null)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    loadPost()
  }, [params])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Content Not Found</h1>
          <p className="text-neutral-600 mb-8">The content you're looking for doesn't exist.</p>
          <Link
            href="/content"
            className="px-6 py-3 bg-secondary-600 text-white rounded-full font-medium hover:bg-secondary-700 transition-colors"
          >
            Back to Content
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-neutral-50 to-secondary-50/30 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/content"
              className="inline-flex items-center text-secondary-600 hover:text-secondary-700 mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Content
            </Link>

            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${categoryColors[post.data.category]}`}>
                <span className="mr-1">{categoryIcons[post.data.category]}</span>
                {post.data.category.charAt(0).toUpperCase() + post.data.category.slice(1)}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
              {post.data.title}
            </h1>

            <p className="text-xl text-neutral-600 mb-8 max-w-3xl">
              {post.data.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-neutral-500">
              <div>
                <strong>Published:</strong> {formatDate(post.data.date)}
              </div>
              
              {post.data.readTime && (
                <div>
                  <strong>Read Time:</strong> {post.data.readTime}
                </div>
              )}
              
              {post.data.external && (
                <a
                  href={post.data.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-600 text-white rounded-full font-medium hover:bg-secondary-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Read Original
                </a>
              )}
            </div>

            {/* Tags */}
            {post.data.tags && post.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white text-neutral-700 rounded-full text-sm font-medium border border-neutral-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content Image */}
      {post.data.image && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-soft"
          >
            <Image
              src={post.data.image}
              alt={post.data.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-a:text-secondary-600 prose-a:no-underline hover:prose-a:underline"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>
      </div>

      {/* Share Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            Enjoyed this content?
          </h3>
          <p className="text-neutral-600 mb-6">
            Share it with others who might find it interesting.
          </p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <Link
            href="/content"
            className="flex items-center text-secondary-600 hover:text-secondary-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Content
          </Link>
          
          <Link
            href="/projects"
            className="flex items-center text-secondary-600 hover:text-secondary-700"
          >
            View Projects
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
