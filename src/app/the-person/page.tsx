'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const skills = [
  { category: 'AI & Machine Learning', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI GPT', 'Computer Vision'] },
  { category: 'Data Science', items: ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Jupyter'] },
  { category: 'Web Development', items: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'] },
  { category: 'Cloud & Infrastructure', items: ['AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL'] },
]

const values = [
  {
    title: 'Innovation First',
    description: 'Always seeking new ways to solve problems and push the boundaries of what\'s possible.',
    icon: '🚀'
  },
  {
    title: 'Continuous Learning',
    description: 'Embracing the mindset that there\'s always something new to discover and master.',
    icon: '📚'
  },
  {
    title: 'Human-Centered Design',
    description: 'Technology should enhance human capabilities and improve lives, not replace human connection.',
    icon: '🤝'
  },
  {
    title: 'Open Collaboration',
    description: 'The best solutions emerge when diverse minds work together towards a common goal.',
    icon: '🌐'
  },
]

export default function ThePersonPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-neutral-50 to-accent-purple/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                The{' '}
                <span className="bg-gradient-to-r from-accent-purple to-primary-600 bg-clip-text text-transparent">
                  Person
                </span>
              </h1>
              
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Behind every line of code, every data model, and every innovative solution is a person driven by curiosity, 
                creativity, and the desire to make a meaningful impact on the world through technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
                
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-primary-600/20 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-accent-purple to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl text-white">👨‍💻</span>
                    </div>
                    <p className="text-neutral-600 font-medium">Innovation & Technology</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">My Journey</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From curiosity to expertise, here's how I've navigated the ever-evolving landscape of technology and innovation.
            </p>
          </motion.div>

          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-lg leading-relaxed text-neutral-700 mb-6">
                My fascination with technology began early, but it was the intersection of artificial intelligence and human potential 
                that truly captured my imagination. I believe we're living through one of the most exciting periods in human history, 
                where the tools we create can amplify our capabilities in unprecedented ways.
              </p>

              <p className="text-lg leading-relaxed text-neutral-700 mb-6">
                Throughout my career, I've had the privilege of working on projects that span from cutting-edge AI research to 
                practical web applications that serve thousands of users. Each project has taught me that the most impactful 
                technology is not just about algorithms or frameworks—it's about understanding the human problems we're trying to solve.
              </p>

              <p className="text-lg leading-relaxed text-neutral-700">
                When I'm not coding or diving deep into data, you'll find me reading about the latest breakthroughs in science, 
                exploring new ideas through writing, or connecting with fellow innovators who share the vision of using technology 
                to create a better future for everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">Core Values</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              The principles that guide my approach to technology, collaboration, and life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-soft"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">Technical Expertise</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              A diverse toolkit spanning AI, data science, and modern web development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-neutral-50 to-primary-50/20 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white text-neutral-700 rounded-full text-sm font-medium border border-neutral-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-purple to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Whether you're looking for collaboration on an innovative project or just want to connect with a fellow tech enthusiast, 
              I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-accent-purple rounded-full font-medium hover:bg-neutral-100 transition-colors"
              >
                Start a Conversation
              </a>
              <a
                href="/projects"
                className="px-8 py-4 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Explore My Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
