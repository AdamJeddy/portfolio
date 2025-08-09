'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import AbstractScene from '@/components/3d/AbstractScene'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <AbstractScene />
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.7, 0.4, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center"
        style={{ y }}
      >
        {/* Creative Name Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-none">
            <span className="inline-block transform hover:rotate-12 transition-transform duration-300">A</span>
            <span className="inline-block transform hover:-rotate-6 transition-transform duration-300 text-primary-400">D</span>
            <span className="inline-block transform hover:rotate-3 transition-transform duration-300">A</span>
            <span className="inline-block transform hover:-rotate-12 transition-transform duration-300 text-accent-purple">M</span>
          </h1>
        </motion.div>

        {/* Artistic Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-12 max-w-4xl"
        >
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-light text-neutral-200 mb-6 leading-relaxed">
              Creative{' '}
              <span className="relative inline-block">
                <span className="text-primary-400 font-bold">Developer</span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-accent-coral"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </span>
              {' '}& Digital{' '}
              <span className="relative inline-block">
                <span className="text-accent-coral font-bold">Artist</span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-accent-coral to-primary-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
              </span>
            </h2>
            
            <motion.p 
              className="text-lg md:text-xl text-neutral-300 font-light italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              "Where code meets creativity, magic happens"
            </motion.p>
          </div>
        </motion.div>

        {/* Creative CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          <Link href="/projects" className="group relative">
            <motion.div
              className="relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white font-semibold text-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore My Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-coral"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-accent-coral rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
              style={{ zIndex: -1 }}
            />
          </Link>

          <Link href="/content" className="group relative">
            <motion.div
              className="relative px-8 py-4 bg-transparent border-2 border-accent-coral rounded-full text-accent-coral font-semibold text-lg hover:bg-accent-coral hover:text-neutral-900 transition-all duration-300 shadow-lg hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Read My Thoughts</span>
            </motion.div>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-accent-coral to-primary-400 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
              style={{ zIndex: -1 }}
            />
          </Link>
        </motion.div>

        {/* Artistic Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-neutral-400"
          >
            <span className="text-sm mb-2 font-light">Scroll to discover</span>
            <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-neutral-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Creative About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-neutral-900/50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-8"
            style={{
              background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #EF4444, #F59E0B)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 8s ease infinite',
            }}
          >
            Crafting Digital Experiences
          </motion.h2>
          
          <motion.p 
            className="text-xl text-neutral-300 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            I blend technical expertise with artistic vision to create immersive digital experiences. 
            From interactive web applications to creative coding experiments, 
            I push the boundaries of what's possible in the digital realm.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {['React', 'Next.js', 'Three.js', 'TypeScript', 'Creative Coding', 'UI/UX'].map((skill, index) => (
              <motion.span
                key={skill}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-neutral-200 border border-white/20"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                transition={{ delay: index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Add CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}