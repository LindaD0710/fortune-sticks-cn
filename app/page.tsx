'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Moon, BookOpen, Info } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

// Parallax background component with enhanced effect
function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const springConfig = { damping: 30, stiffness: 150 }
  // Enhanced parallax ranges for more noticeable effect
  const x1 = useSpring(useTransform(mouseX, [0, 1], [-60, 60]), springConfig)
  const y1 = useSpring(useTransform(mouseY, [0, 1], [-60, 60]), springConfig)
  const x2 = useSpring(useTransform(mouseX, [0, 1], [40, -40]), springConfig)
  const y2 = useSpring(useTransform(mouseY, [0, 1], [40, -40]), springConfig)
  const x3 = useSpring(useTransform(mouseX, [0, 1], [-25, 25]), springConfig)
  const y3 = useSpring(useTransform(mouseY, [0, 1], [-25, 25]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const xPercent = (e.clientX - rect.left) / rect.width
      const yPercent = (e.clientY - rect.top) / rect.height
      mouseX.set(xPercent)
      mouseY.set(yPercent)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-mystic-purple-glow/25 rounded-full blur-3xl"
      />
      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute bottom-20 right-10 w-56 h-56 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-mystic-indigo/25 rounded-full blur-3xl"
      />
      <motion.div
        style={{ x: x3, y: y3 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-mystic-violet/20 rounded-full blur-3xl"
      />
    </div>
  )
}


export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden pb-20 sm:pb-24">
      {/* Background with parallax effect */}
      <ParallaxBackground />
      
      {/* Additional animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-mystic-purple-glow/20 rounded-full blur-3xl"
        />
        
        {/* Traditional Chinese decorative elements - very subtle */}
        <div className="absolute top-10 left-5 sm:left-10 opacity-10">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-4xl sm:text-6xl text-white/20"
          >
            卦
          </motion.div>
        </div>
        <div className="absolute top-10 right-5 sm:right-10 opacity-10">
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="text-4xl sm:text-6xl text-white/20"
          >
            道
          </motion.div>
        </div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-5">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl sm:text-8xl text-white/10"
          >
            易
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl w-full text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 relative z-10">
        {/* Main heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-2 tracking-tight leading-tight">
              <motion.span
                className="block relative whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                The Whispering Silk
              </motion.span>
              <motion.span
                className="block relative mt-2 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
                animate={{
                  filter: [
                    'brightness(1)',
                    'brightness(1.1)',
                    'brightness(1)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Oriental Oracle
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4"
          >
            {/* Flowing energy divider line */}
            <motion.div
              className="relative h-px w-12 sm:w-16 md:w-20 overflow-hidden"
              animate={{ width: ['48px', '64px', '80px', '64px', '48px'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-mystic-purple-glow to-mystic-purple-glow"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="absolute inset-0 bg-mystic-purple-glow blur-sm"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2"
              animate={{
                scale: [1, 1.2, 1],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-mystic-purple-glow text-lg sm:text-xl">☯</span>
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-purple-glow" />
              <span className="text-mystic-indigo text-lg sm:text-xl">☯</span>
            </motion.div>
            <motion.div
              className="relative h-px w-12 sm:w-16 md:w-20 overflow-hidden"
              animate={{ width: ['48px', '64px', '80px', '64px', '48px'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-mystic-purple-glow to-mystic-purple-glow"
                animate={{
                  backgroundPosition: ['100%', '0%', '100%'],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.5,
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                className="absolute inset-0 bg-mystic-purple-glow blur-sm"
                animate={{
                  x: ['100%', '-100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.5,
                }}
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-4"
          >
            <span className="text-white/90">Experience the ancient art of Chinese divination,</span>
            <br className="hidden sm:block" />
            <span className="text-mystic-purple-glow font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">with thoughtful insights for your journey</span>
            <br className="hidden sm:block" />
            <span className="text-white/90">Timeless Wisdom for Modern Crossroads.</span>
          </motion.p>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-2 sm:pt-4 flex flex-col items-center"
        >
          <Link href="/ask">
            <motion.button
              className="group relative z-10 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet text-white font-semibold text-base sm:text-lg md:text-xl shadow-lg transition-all duration-300 overflow-hidden"
              whileHover="pulse"
              variants={{
                pulse: {
                  scale: [1, 1.1, 1, 1.1, 1],
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                    '0 0 40px rgba(168, 85, 247, 0.8)',
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                    '0 0 40px rgba(168, 85, 247, 0.8)',
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                  ],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.2, 0.4, 0.6, 0.8],
                  },
                },
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Base gradient background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet" />
              
              {/* Horizontal sweep light effect - Right to left, more visible */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
              >
                {/* Main bright sweep */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255, 255, 255, 0.5) 50%, transparent 80%, transparent 100%)',
                    width: '200%',
                    height: '100%',
                  }}
                  animate={{
                    x: ['100%', '-200%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'loop',
                  }}
                />
                {/* Secondary softer glow for depth */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0.15) 55%, transparent 100%)',
                    width: '200%',
                    height: '100%',
                  }}
                  animate={{
                    x: ['100%', '-200%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'loop',
                    delay: 0.1,
                  }}
                />
              </motion.div>
              
              {/* Text overlay */}
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <span>Draw Your Lot</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-mystic-purple-glow/30 blur-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
          
          {/* Subtitle text below button */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/70 text-center"
          >
            Quiet your mind, focus on your question...
          </motion.p>
        </motion.div>

        {/* Feature cards with staggered animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-6 sm:pt-8 md:pt-12 lg:pt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-4xl mx-auto px-2 sm:px-4"
        >
          {[
            {
              icon: BookOpen,
              title: 'Ancestral Echoes',
              description: 'Traditional Chinese divination methods passed down through generations',
              delay: 0.1,
            },
            {
              icon: Sparkles,
              title: 'Deep Resonance',
              description: 'Thoughtful interpretations for reflection, tailored to your questions and life context',
              delay: 0.2,
            },
            {
              icon: Moon,
              title: 'Personal Guidance',
              description: 'Meaningful reflections to inspire your personal journey',
              delay: 0.3,
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + feature.delay }}
                whileHover={{ y: -8 }}
                className="group relative p-5 sm:p-6 md:p-7 lg:p-8 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-mystic-purple/30 hover:border-mystic-purple-glow/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden xuan-paper-texture"
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/10 via-mystic-violet/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-mystic-purple/20 to-mystic-indigo/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:from-mystic-purple-glow/30 group-hover:to-mystic-violet/30 transition-all duration-300 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-mystic-purple-glow/20 blur-md group-hover:bg-mystic-purple-glow/40 transition-all"></div>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-purple-glow relative z-10" />
                  </motion.div>
                  <h3 
                    className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6366f1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Decorative bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="pt-6 sm:pt-8 lg:pt-12 space-y-4"
        >
          <motion.p
            className="text-xs sm:text-sm font-light tracking-wider px-4"
            animate={{
              background: [
                'linear-gradient(90deg, #6b21a8, #9333ea, #4f46e5)',
                'linear-gradient(90deg, #4f46e5, #6b21a8, #9333ea)',
                'linear-gradient(90deg, #9333ea, #4f46e5, #6b21a8)',
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TRADITIONAL • MODERN • PERSONAL
          </motion.p>
          
          {/* Disclaimer for compliance - Enhanced visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-2xl mx-auto px-4"
          >
            <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-white/80 bg-white/15 backdrop-blur-sm rounded-lg p-4 sm:p-5 border-2 border-mystic-purple-glow/40 shadow-lg">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 text-mystic-purple-glow" />
              <div className="flex-1">
                <p className="font-semibold text-white/90 mb-2 text-sm sm:text-base">
                  For Entertainment Purposes Only
                </p>
                <p className="leading-relaxed text-xs sm:text-sm mb-2">
                  This is a cultural and entertainment experience. Readings are for reflection and inspiration only, 
                  <strong className="text-white"> not professional advice</strong>. 
                  <span className="text-white/70"> Interpretations are AI-generated and should not be used for important life decisions.</span>
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Privacy & Legal Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/60 mt-4"
          >
            <Link href="/privacy" className="hover:text-mystic-purple-glow transition-colors underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-mystic-purple-glow transition-colors underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-mystic-purple-glow transition-colors underline">
              Full Disclaimer
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
