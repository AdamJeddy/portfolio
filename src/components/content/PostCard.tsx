'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/lib/content'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post
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

export default function PostCard({ post }: PostCardProps) {
  const { data, slug } = post

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-glow-lg transition-all duration-300"
    >
      {/* Post Image */}
      <div className="relative h-48 bg-gradient-to-br from-secondary-100 to-accent-teal/20 overflow-hidden">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">
              {categoryIcons[data.category]}
            </span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[data.category]}`}>
            <span className="mr-1">{categoryIcons[data.category]}</span>
            {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
          </span>
        </div>

        {/* External Link Indicator */}
        {data.external && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
          <time>{formatDate(data.date)}</time>
          {data.readTime && (
            <>
              <span>•</span>
              <span>{data.readTime}</span>
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-secondary-600 transition-colors line-clamp-2">
          {data.title}
        </h3>

        <p className="text-neutral-600 mb-4 line-clamp-3">
          {data.description}
        </p>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-500 rounded-full">
                +{data.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div>
          {data.external ? (
            <a
              href={data.external}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition-colors"
            >
              Read Article
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <Link
              href={`/content/${slug}`}
              className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition-colors"
            >
              Read More
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
