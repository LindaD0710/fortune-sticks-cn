'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import { getFortuneStick } from '@/lib/fortune-sticks'

// Moon Blocks (筊杯) component for opening animation
function MoonBlocks({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const [blocksVisible, setBlocksVisible] = useState(false)
  const [blocksLanded, setBlocksLanded] = useState(false)
  const [goldenLight, setGoldenLight] = useState(false)

  useEffect(() => {
    if (show) {
      setBlocksVisible(true)
      // Blocks land after rotation
      setTimeout(() => {
        setBlocksLanded(true)
        setGoldenLight(true)
        // Complete animation after golden light
        setTimeout(() => {
          setGoldenLight(false)
          setTimeout(() => {
            onComplete()
          }, 500)
        }, 800)
      }, 1000)
    } else {
      setBlocksVisible(false)
      setBlocksLanded(false)
      setGoldenLight(false)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {blocksVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Golden light flash */}
          {goldenLight && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.6) 30%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {/* Moon Blocks */}
          <div className="relative flex items-center gap-4">
            {[0, 1].map((index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{
                  rotate: 0,
                  y: -200,
                  opacity: 0,
                }}
                animate={blocksLanded ? {
                  rotate: [1080, 0],
                  y: 0,
                  opacity: 1,
                } : {
                  rotate: [0, 1080],
                  y: -200,
                  opacity: 1,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  delay: index * 0.1,
                }}
              >
                {/* Moon Block SVG */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Block body - curved shape */}
                  <path
                    d="M 40 10 Q 50 20 50 40 Q 50 60 40 70 Q 30 60 30 40 Q 30 20 40 10 Z"
                    fill="url(#moonBlockGradient)"
                    stroke="#DAA520"
                    strokeWidth="2"
                  />
                  {/* Inner curve */}
                  <path
                    d="M 40 20 Q 45 25 45 40 Q 45 55 40 60 Q 35 55 35 40 Q 35 25 40 20 Z"
                    fill="rgba(255, 215, 0, 0.2)"
                  />
                  <defs>
                    <linearGradient id="moonBlockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5DEB3" />
                      <stop offset="50%" stopColor="#DAA520" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Silk scroll component for revealing the fortune
function SilkScroll({ stickNumber, fortuneText }: { stickNumber: number; fortuneText: string }) {
  const [isUnrolling, setIsUnrolling] = useState(false)

  useEffect(() => {
    setIsUnrolling(true)
  }, [])

  return (
    <motion.div
      className="relative max-w-2xl mx-auto mt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Scroll container */}
      <motion.div
        className="relative bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 rounded-lg p-8 sm:p-12 shadow-2xl border-4 border-amber-200"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.1) 2px, rgba(139, 69, 19, 0.1) 4px)',
        }}
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        animate={isUnrolling ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Scroll top and bottom edges */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-300 to-amber-200 rounded-t-lg" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-lg" />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <p className="text-amber-900 text-sm sm:text-base mb-2 font-medium">Lot #{stickNumber}</p>
            <div className="w-24 h-0.5 bg-amber-600 mx-auto mb-4" />
          </motion.div>

          <motion.div
            className="text-amber-900 text-lg sm:text-xl md:text-2xl leading-relaxed font-serif italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            {fortuneText}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Payment card with mist effect
function PaymentCard({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div
      className="relative max-w-2xl mx-auto mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
    >
      {/* Mist effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 rounded-xl blur-xl pointer-events-none" />
      
      {/* Card */}
      <div className="relative bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-indigo-900/90 backdrop-blur-md rounded-xl p-6 sm:p-8 border-2 border-purple-500/50 shadow-2xl">
        {/* Mist particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-sm"
            style={{
              width: `${20 + i * 5}px`,
              height: `${20 + i * 5}px`,
              left: `${10 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, (i % 2 === 0 ? 1 : -1) * 10, 0],
              y: [0, (i % 2 === 0 ? -1 : 1) * 5, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="relative z-10 text-center">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-purple-300" />
          <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
            Unlock the Deep Interpretation
          </h3>
          <p className="text-purple-200 text-sm sm:text-base mb-6">
            Receive personalized AI insights tailored to your question
          </p>
          <motion.button
            onClick={onUnlock}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Unlock for $1.99
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultPage() {
  const [showMoonBlocks, setShowMoonBlocks] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [stickNumber, setStickNumber] = useState<number | null>(null)
  const [userQuestion, setUserQuestion] = useState<string | null>(null)

  useEffect(() => {
    // Get stick number and question from sessionStorage
    const stick = sessionStorage.getItem('drawnStick')
    const question = sessionStorage.getItem('userQuestion')
    
    if (!stick) {
      window.location.href = '/toss'
      return
    }

    setStickNumber(parseInt(stick))
    setUserQuestion(question)
  }, [])

  const handleMoonBlocksComplete = () => {
    setShowMoonBlocks(false)
    setShowContent(true)
  }

  const handleUnlock = () => {
    // Navigate to interpretation page
    window.location.href = '/interpret'
  }

  // Get fortune text from fortune stick data
  const fortuneStick = stickNumber ? getFortuneStick(stickNumber) : null
  const fortuneText = fortuneStick?.text || ''

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Deep purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]" />

      {/* Moon Blocks opening animation */}
      <MoonBlocks show={showMoonBlocks} onComplete={handleMoonBlocksComplete} />

      <div className="max-w-4xl w-full relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Link
            href="/toss"
            className="inline-flex items-center gap-2 text-white/70 hover:text-mystic-purple-glow transition-colors text-sm sm:text-base"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </Link>
        </motion.div>

        {/* Main content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Guidance text */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light italic">
                  The Oracle is confirmed. Wisdom is unfolding...
                </p>
              </motion.div>

              {/* Stick number display */}
              {stickNumber && (
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 backdrop-blur-sm rounded-full border-2 border-amber-400/50">
                    <p className="text-amber-300 text-2xl sm:text-3xl font-bold">
                      Lot #{stickNumber}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Silk scroll with fortune */}
              {stickNumber && fortuneText && (
                <SilkScroll stickNumber={stickNumber} fortuneText={fortuneText} />
              )}

              {/* Payment card */}
              <PaymentCard onUnlock={handleUnlock} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
