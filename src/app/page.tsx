'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import AbstractScene from '@/components/3d/AbstractScene'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-40">
          <AbstractScene />
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <motion.div
          style={{ y, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Hey, I'm Adam
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl text-slate-600 mb-8 font-light leading-relaxed max-w-4xl mx-auto"
          >
            Creative Developer & Digital Artist crafting beautiful, 
            <span className="text-blue-600 font-medium"> interactive experiences</span> that blend 
            code with creativity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/projects" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-blue-500/25"
              >
                View My Work
              </motion.div>
            </Link>
            
            <Link href="/content" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80"
              >
                Read My Thoughts
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats/Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-slate-600">Projects Completed</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="text-3xl font-bold text-indigo-600 mb-2">5+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">Creative Ideas</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-slate-400"
          >
            <span className="text-sm mb-3 font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [2, 14, 2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-slate-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Crafting Digital Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              I specialize in creating innovative web applications, interactive experiences, 
              and digital solutions that push the boundaries of what's possible on the web.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {[
              { name: 'React', color: 'from-cyan-500 to-blue-500' },
              { name: 'Next.js', color: 'from-slate-700 to-slate-900' },
              { name: 'TypeScript', color: 'from-blue-600 to-blue-700' },
              { name: 'Three.js', color: 'from-green-500 to-emerald-600' },
              { name: 'Tailwind', color: 'from-teal-500 to-cyan-600' },
              { name: 'Framer Motion', color: 'from-purple-500 to-pink-500' }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${skill.color} p-0.5 rounded-2xl`}>
                  <div className="bg-white rounded-2xl px-4 py-3 group-hover:bg-transparent group-hover:text-white transition-all duration-300">
                    <div className="font-semibold text-center">{skill.name}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Ready to bring your ideas to life? I'm always excited to work on new projects 
              and collaborate with creative minds.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/content"
                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get In Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}