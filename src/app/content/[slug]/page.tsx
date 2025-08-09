import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { renderMarkdown } from '@/lib/markdown'

interface ContentPageProps {
  params: { slug: string }
}

const categoryColors = {
  book: 'bg-amber-100 text-amber-800',
  tech: 'bg-blue-100 text-blue-800',
  others: 'bg-purple-100 text-purple-800',
} as const

const categoryIcons = {
  book: '📖',
  tech: '💻',
  others: '🌟',
} as const

export function generateStaticParams() {
  const posts = getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default function ContentPage({ params }: ContentPageProps) {
  const post = getPostBySlug(params.slug)
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

  const html = renderMarkdown(post.content)

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
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </motion.div>
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
