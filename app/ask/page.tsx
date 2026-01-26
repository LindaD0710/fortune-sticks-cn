'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Parallax background component
function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const springConfig = { damping: 30, stiffness: 150 }
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

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [animatingText, setAnimatingText] = useState<{ text: string; startPos: { x: number; y: number } } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})

  // Suggested questions
  const suggestedQuestions = [
    "Does he/she actually like me?",
    "Is it time for me to change my job?",
    "How can I attract the right person?",
    "Should I stay or should I go?",
    "What's holding me back from being happy?",
    "Should I go ahead with this choice?",
    "Will this plan work out in the end?",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      // Store question in sessionStorage
      sessionStorage.setItem('userQuestion', question.trim())
      // Navigate to toss page
      window.location.href = '/toss'
    }
  }

  const handleSuggestedClick = (suggested: string, index: number) => {
    const button = buttonRefs.current[index]
    const input = inputRef.current
    
    if (button && input) {
      const buttonRect = button.getBoundingClientRect()
      const inputRect = input.getBoundingClientRect()
      
      // Calculate positions relative to viewport
      const startX = buttonRect.left + buttonRect.width / 2
      const startY = buttonRect.top + buttonRect.height / 2
      const endX = inputRect.left + inputRect.width / 2
      const endY = inputRect.top + inputRect.height / 2
      
      // Start animation
      setAnimatingText({
        text: suggested,
        startPos: { x: startX, y: startY }
      })
      
      // After animation completes, set the question
      setTimeout(() => {
        setQuestion(suggested)
        setIsFocused(true)
        setAnimatingText(null)
      }, 700) // Match animation duration
    } else {
      // Fallback if refs not available
      setQuestion(suggested)
      setIsFocused(true)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
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
      </div>

      {/* Animated text flowing from button to input - sand flow effect */}
      {animatingText && inputRef.current && (
        <motion.div
          className="fixed pointer-events-none z-50"
          initial={{
            x: animatingText.startPos.x,
            y: animatingText.startPos.y,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            x: (() => {
              const input = inputRef.current
              if (input) {
                const rect = input.getBoundingClientRect()
                return rect.left + rect.width / 2
              }
              return animatingText.startPos.x
            })(),
            y: (() => {
              const input = inputRef.current
              if (input) {
                const rect = input.getBoundingClientRect()
                return rect.top + rect.height / 2
              }
              return animatingText.startPos.y
            })(),
            opacity: [1, 0.9, 0.7, 0.4, 0.1, 0],
            scale: [1, 0.95, 0.8, 0.6, 0.4, 0.2],
            rotate: [0, 5, -5, 3, -3, 0],
          }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1], // Smooth ease for sand-like flow
          }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="px-4 py-2 bg-gradient-to-r from-mystic-purple/90 via-mystic-indigo/80 to-mystic-purple/90 backdrop-blur-sm rounded-lg border border-mystic-purple-glow/60 shadow-xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 30px rgba(168, 85, 247, 0.7)',
                '0 0 15px rgba(168, 85, 247, 0.4)',
                '0 0 5px rgba(168, 85, 247, 0.2)',
              ],
            }}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
            }}
          >
            <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">
              {animatingText.text}
            </span>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-2xl w-full relative z-10 px-2 sm:px-0">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-mystic-purple-glow transition-colors text-sm sm:text-base touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </Link>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-2 sm:space-y-3 px-2">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              What weighs on your heart?
            </motion.h1>
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm text-white/60 text-center mb-4"
          >
            Readings are for reflection and inspiration only, not professional advice.
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Input and Button Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Input field */}
              <div className="relative flex-1">
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your question here..."
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md border-2 rounded-xl sm:rounded-2xl text-white placeholder-white/40 focus:outline-none text-base sm:text-base relative z-10 min-h-[44px]"
                  animate={{
                    borderColor: isFocused 
                      ? ['rgba(168, 85, 247, 0.6)', 'rgba(168, 85, 247, 0.9)', 'rgba(168, 85, 247, 0.6)']
                      : ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0.5)', 'rgba(168, 85, 247, 0.3)'],
                    boxShadow: isFocused
                      ? [
                          '0 0 0px rgba(168, 85, 247, 0.3)',
                          '0 0 20px rgba(168, 85, 247, 0.6)',
                          '0 0 0px rgba(168, 85, 247, 0.3)',
                        ]
                      : [
                          '0 0 0px rgba(168, 85, 247, 0.2)',
                          '0 0 15px rgba(168, 85, 247, 0.4)',
                          '0 0 0px rgba(168, 85, 247, 0.2)',
                        ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mystic-purple-glow/20"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mystic-purple-glow/20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mystic-purple-glow/20"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mystic-purple-glow/20"></div>
              </div>

              {/* Submit button - copied from homepage */}
              <motion.button
                type="submit"
                disabled={!question.trim()}
                className="group relative z-10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet text-white font-semibold text-base sm:text-base shadow-lg transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-h-[44px] w-full sm:w-auto"
                whileHover={question.trim() ? "pulse" : {}}
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
                whileTap={question.trim() ? { scale: 0.95 } : {}}
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
                  <span>Ask</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-mystic-purple-glow/30 blur-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: question.trim() ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            {/* Privacy assurance text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-[10px] sm:text-xs text-white/40 text-center leading-relaxed"
            >
              Your questions are sacred and private. We do not store your personal secrets.
            </motion.p>

            {/* Suggested Questions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-2 sm:space-y-3"
            >
              <p className="text-xs sm:text-sm text-white/60 mb-2">Suggested questions:</p>
              <div className="flex flex-col gap-2">
                {suggestedQuestions.map((suggested, index) => (
                  <motion.button
                    key={index}
                    ref={(el) => { buttonRefs.current[index] = el }}
                    type="button"
                    onClick={() => handleSuggestedClick(suggested, index)}
                    className="text-left px-4 py-3 sm:py-3.5 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-mystic-purple/30 hover:border-mystic-purple-glow/50 rounded-lg text-white/80 hover:text-white text-sm sm:text-base transition-all duration-300 min-h-[44px] w-full"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggested}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </main>
  )
}
