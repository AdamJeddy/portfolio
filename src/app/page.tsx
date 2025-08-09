import Link from 'next/link'
import AbstractScene from '@/components/3d/AbstractScene'

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center">
      <AbstractScene />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6">
            Innovation through
            <span className="block bg-gradient-to-r from-primary-600 via-accent-purple to-secondary-600 bg-clip-text text-transparent">
              Technology & Design
            </span>
          </h1>
          <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
            Building modern experiences with AI, data, and the web. Thoughtful design, robust engineering, and ambient 3D.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/content"
              className="px-8 py-3 border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 transition-colors"
            >
              Read Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}