'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Project } from '@/lib/content'
import ProjectCard from '@/components/content/ProjectCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // In a client component, we'll load projects differently
    // For now, we'll use empty array until we implement client-side data loading
    setProjects([])
  }, [])

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6"
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Projects
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-neutral-600 max-w-3xl mx-auto"
          >
            A showcase of innovative projects spanning AI, data science, and modern web applications. 
            Each project represents a unique challenge and creative solution.
          </motion.p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-700 mb-2">Projects Coming Soon</h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              I'm currently working on some exciting projects. Check back soon to see what I've been building!
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-soft max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Interested in Collaboration?
            </h3>
            <p className="text-neutral-600 mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
              >
                View GitHub
              </a>
              <a
                href="/the-person"
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 transition-colors"
              >
                Learn More About Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
