'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Project } from '@/lib/content'
import { formatDate } from '@/lib/utils'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const resolvedParams = await params
        // For now, we'll simulate loading a project
        // In a real implementation, you'd fetch from your content system
        setProject(null)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    loadProject()
  }, [params])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Project Not Found</h1>
          <p className="text-neutral-600 mb-8">The project you're looking for doesn't exist.</p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-neutral-50 to-primary-50/30 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
                {project.data.title}
              </h1>
              {project.data.featured && (
                <span className="bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <p className="text-xl text-neutral-600 mb-8 max-w-3xl">
              {project.data.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="text-sm text-neutral-500">
                <strong>Date:</strong> {formatDate(project.data.date)}
              </div>
              
              {project.data.github && (
                <a
                  href={project.data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Source
                </a>
              )}

              {project.data.demo && (
                <a
                  href={project.data.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.data.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-white text-neutral-700 rounded-full text-sm font-medium border border-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Image */}
      {project.data.image && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-soft"
          >
            <Image
              src={project.data.image}
              alt={project.data.title}
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
          className="prose prose-lg max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <Link
            href="/projects"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Projects
          </Link>
          
          <Link
            href="/content"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            Read Content
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
