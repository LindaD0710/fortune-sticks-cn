'use client'

import Link from 'next/link'
import { ArrowLeft, Loader2, Waves, GitBranch, Sparkles, Download, Check } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { getFortuneStick } from '@/lib/fortune-sticks'
import html2canvas from 'html2canvas'

// Unified container width constant - responsive: 95% on mobile, 90% on tablet, max-w-5xl on desktop
const UNIFIED_CONTAINER_WIDTH = 'w-[95%] sm:w-[90%] max-w-5xl'

// Weaving animation component for loading state
function WeavingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-64 h-64 mb-8">
        {/* Golden thread weaving animation */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thread path - weaving pattern */}
          <motion.path
            d="M 20 100 Q 50 20, 100 50 T 180 100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
            }}
          />
          <motion.path
            d="M 20 100 Q 50 180, 100 150 T 180 100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              pathLength: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
            }}
          />
          <motion.path
            d="M 100 20 Q 150 50, 180 100 T 100 180"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              pathLength: { duration: 2, repeat: Infinity, ease: "linear", delay: 1 },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
            }}
          />
          
          {/* Glowing dots along the path */}
          {[0, 0.33, 0.66, 1].map((offset, i) => {
            // Calculate positions along the path for animation
            const positions = [
              { cx: 20, cy: 100 },
              { cx: 60, cy: 50 },
              { cx: 100, cy: 75 },
              { cx: 140, cy: 100 },
            ]
            const pos = positions[i % positions.length]
            
            return (
              <motion.circle
                key={i}
                r="4"
                fill="#FFD700"
                cx={pos.cx}
                cy={pos.cy}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: offset * 2,
                }}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 1))',
                }}
              />
            )
          })}
        </svg>
      </div>
      <motion.p
        className="text-amber-400/80 text-sm sm:text-base tracking-widest uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0.5, 1, 1, 0.5], y: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          fontFamily: 'var(--font-sans), "Inter", sans-serif',
          letterSpacing: '0.2em',
        }}
      >
        Weaving the cosmic threads for you...
      </motion.p>
    </div>
  )
}

// Scroll-triggered fade-in wrapper component
function ScrollFadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Icon components for section headers
function ResonanceIcon() {
  return (
    <Waves 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

function WeavingIcon() {
  return (
    <GitBranch 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

function RitualIcon() {
  return (
    <Sparkles 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

// Component to render text with golden highlights
function HighlightedText({ text }: { text: string }) {
  // Split text by **golden** markers and render highlighted parts
  const parts = text.split(/(\*\*.*?\*\*)/g)
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove the ** markers and render as golden bold
          const goldenText = part.slice(2, -2)
          return (
            <span 
              key={index}
              className="font-bold text-[#FFD700]"
              style={{
                textShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
              }}
            >
              {goldenText}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

// Typewriter effect component
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 15)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text])

  return (
    <div>
      <p className="whitespace-pre-wrap leading-relaxed">
        {displayedText}
        {currentIndex < text.length && (
          <span className="inline-block w-0.5 h-5 bg-amber-400 ml-1 animate-pulse align-middle" />
        )}
      </p>
    </div>
  )
}

export default function InterpretPage() {
  const [stickNumber, setStickNumber] = useState<number | null>(null)
  const [userQuestion, setUserQuestion] = useState<string | null>(null)
  const [interpretation, setInterpretation] = useState<{
    resonance: string
    weaving: string
    ritual: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWeaving, setIsWeaving] = useState(true) // 3-second weaving animation
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const fetchInterpretation = async (stickNum: number, question: string) => {
    const startTime = Date.now()
    let weavingTimer: NodeJS.Timeout | null = null
    
    try {
      setIsLoading(true)
      setIsWeaving(true)
      setError(null)
      
      // Start 3-second weaving animation
      weavingTimer = setTimeout(() => {
        setIsWeaving(false)
      }, 3000)

      const fortuneStick = getFortuneStick(stickNum)
      
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          fortuneStick: {
            number: fortuneStick.number,
            level: fortuneStick.level,
            levelEN: fortuneStick.levelEN,
            content: fortuneStick.content,
            contentEN: fortuneStick.contentEN,
            detail2EN: fortuneStick.detail2EN,
            storyEN: fortuneStick.storyEN,
            storyBriefEN: fortuneStick.storyBriefEN,
            itemsEN: fortuneStick.itemsEN,
          },
        }),
      })

      const data = await response.json()

      // Check if API returned an error
      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || 'Failed to generate interpretation')
      }

      // Check if we have at least resonance (most important field)
      if (!data.resonance) {
        throw new Error('Incomplete interpretation received from API: missing resonance field')
      }

      // Set interpretation with fallbacks for missing fields
      setInterpretation({
        resonance: data.resonance || 'The energy resonates with your question...',
        weaving: data.weaving || data.resonance || 'The Oracle weaves its wisdom through the threads of fate...',
        ritual: data.ritual || 'Take a moment of quiet reflection to connect with this guidance.'
      })
    } catch (err) {
      if (weavingTimer) clearTimeout(weavingTimer)
      setIsWeaving(false)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      // Wait for weaving animation to complete (minimum 3 seconds)
      const minDelay = 3000
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minDelay - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
        if (weavingTimer) {
          clearTimeout(weavingTimer)
          setIsWeaving(false)
        }
      }, remaining)
    }
  }

  useEffect(() => {
    const stick = sessionStorage.getItem('drawnStick')
    const question = sessionStorage.getItem('userQuestion')
    
    if (!stick) {
      window.location.href = '/toss'
      return
    }

    setStickNumber(parseInt(stick))
    setUserQuestion(question || '')

    fetchInterpretation(parseInt(stick), question || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fortuneStick = stickNumber ? getFortuneStick(stickNumber) : null

  if (!fortuneStick) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: '#1A1A2E' }} />

      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto relative z-10`}>
        <Link
          href="/result-en"
          className="inline-flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors text-sm sm:text-base mb-6"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span>
        </Link>

        {/* Content area for image capture */}
        <div ref={contentRef} className="space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white"
              style={{
                fontFamily: '"Playfair Display", "Cormorant Garamond", "EB Garamond", Georgia, serif',
                fontWeight: 600,
                wordBreak: 'break-word',
                hyphens: 'auto',
              }}
            >
              Deep Interpretation
            </h1>
          </motion.div>

          {userQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}
            >
              <div 
                className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
                style={{
                  borderLeft: '2px solid #FFD700',
                  borderTop: '0.5px solid rgba(255, 215, 0, 0.15)',
                  borderRight: '0.5px solid rgba(255, 215, 0, 0.15)',
                  borderBottom: '0.5px solid rgba(255, 215, 0, 0.15)',
                }}
              >
                <div className="relative z-10">
                  <p className="text-white/70 text-sm sm:text-base mb-3">
                    You sought guidance on:
                  </p>
                  <p 
                    className="text-white/95 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed italic"
                    style={{
                      fontFamily: '"Brush Script MT", "Lucida Handwriting", "Kalam", cursive, serif',
                    }}
                  >
                    "{userQuestion}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <ScrollFadeIn delay={0}>
            <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-4 py-2 rounded-full bg-white/10 border border-amber-400/30">
                    <span className="text-amber-400 font-bold text-lg">
                      Lot #{fortuneStick.number}
                    </span>
                  </div>
                  <span 
                    className="font-semibold text-xl sm:text-2xl"
                    style={{
                      color: '#DAA520', // Matte gold color
                      fontFamily: '"Playfair Display", "Cormorant Garamond", "EB Garamond", Georgia, serif',
                      fontWeight: 600,
                    }}
                  >
                    {fortuneStick.levelEN || fortuneStick.level}
                  </span>
                </div>
                
                {/* Chinese original poem */}
                {fortuneStick.content && (
                  <div className="mb-4">
                    {(() => {
                      // Split Chinese poem by punctuation and format into two lines
                      const sentences = fortuneStick.content.split(/[，。、]/).filter((s: string) => s.trim())
                      const firstLine = sentences.slice(0, 2).join('，') + (sentences.length > 2 ? '，' : '')
                      const secondLine = sentences.slice(2, 4).join('，') + (sentences.length > 4 ? '，' : '') + '。'
                      
                      return (
                        <div 
                          className="text-base sm:text-lg md:text-xl font-serif font-light tracking-[0.1em] sm:tracking-[0.15em] leading-[2.2] sm:leading-[2.5] mb-3"
                          style={{ 
                            fontFamily: '"STXingkai", "Xingkai SC", "行楷", "KaiTi", "楷体", serif',
                            textAlign: 'left',
                            color: '#FFFFFF',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 215, 0, 0.15)',
                          }}
                        >
                          <div style={{ marginBottom: '0.5em' }}>{firstLine}</div>
                          <div>{secondLine}</div>
                        </div>
                      )
                    })()}
                  </div>
                )}
                
                {/* English translation */}
                {fortuneStick.contentEN && (
                  <p className="text-white/80 text-sm sm:text-base italic leading-relaxed">
                    {fortuneStick.contentEN}
                  </p>
                )}
              </div>
            </div>
          </ScrollFadeIn>

          {isLoading || isWeaving ? (
            <WeavingAnimation />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}
            >
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-red-500">
                <div className="mb-4">
                  <p className="text-red-400 text-base sm:text-lg font-semibold mb-2">
                    {error}
                  </p>
                  <div className="text-white/60 text-sm">
                    <p className="mb-2">Please check:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your API key is correctly set in .env.local</li>
                      <li>You have restarted the development server after adding the API key</li>
                      <li>Your internet connection is working</li>
                      <li>Check the server terminal for detailed error messages</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => fortuneStick && userQuestion && fetchInterpretation(fortuneStick.number, userQuestion)}
                  className="mt-4 px-6 py-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-full transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : interpretation ? (
            <div className="space-y-8">
              {interpretation.resonance && (
                <ScrollFadeIn delay={0}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700]">
                    <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
                      <ResonanceIcon />
                      The Resonance
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed" style={{ lineHeight: '1.8' }}>
                      <HighlightedText text={interpretation.resonance} />
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
              )}

              {interpretation.weaving && (
                <ScrollFadeIn delay={0}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                  <div 
                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700] relative overflow-hidden"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 2px,
                          rgba(255, 215, 0, 0.03) 2px,
                          rgba(255, 215, 0, 0.03) 4px
                        ),
                        repeating-linear-gradient(
                          -45deg,
                          transparent,
                          transparent 2px,
                          rgba(255, 215, 0, 0.02) 2px,
                          rgba(255, 215, 0, 0.02) 4px
                        ),
                        linear-gradient(135deg, rgba(26, 10, 46, 0.95) 0%, rgba(45, 27, 78, 0.95) 100%)
                      `,
                      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
                    }}
                  >
                    <h3 className="text-amber-300 text-sm sm:text-base font-semibold mb-5 uppercase tracking-wider text-left relative z-10 flex items-center gap-3">
                      <WeavingIcon />
                      The Weaving
                    </h3>
                    <div className="text-white/90 text-sm sm:text-base md:text-lg relative z-10" style={{ lineHeight: '1.8' }}>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        <HighlightedText text={interpretation.weaving} />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
              )}

              {interpretation.ritual && (
                <ScrollFadeIn delay={0}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                  <div 
                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700] relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
                        <RitualIcon />
                        The Practice
                      </h3>
                      <p 
                        className="text-white/95 text-base sm:text-lg md:text-xl leading-relaxed italic"
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          lineHeight: '1.8',
                        }}
                      >
                        <HighlightedText text={interpretation.ritual} />
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
              )}
            </div>
          ) : null}
        </div>

        {/* Save Button - Outside contentRef so it's not included in the image */}
        {interpretation && !isLoading && !error && (
            <ScrollFadeIn delay={0}>
              <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto mt-12 mb-8`}>
                <motion.button
                  onClick={async () => {
                    if (!fortuneStick || !interpretation || !contentRef.current) return
                    
                    setIsSavingImage(true)
                    
                    try {
                      // Capture the content as image
                      const canvas = await html2canvas(contentRef.current, {
                        backgroundColor: '#1A1A2E',
                        scale: 2, // Higher quality
                        useCORS: true,
                        logging: false,
                        windowWidth: contentRef.current.scrollWidth,
                        windowHeight: contentRef.current.scrollHeight,
                      })
                      
                      // Convert to blob and download
                      canvas.toBlob((blob) => {
                        if (!blob) {
                          setIsSavingImage(false)
                          return
                        }
                        
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `Oracle-Reading-Lot-${fortuneStick.number}-${new Date().toISOString().split('T')[0]}.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                        
                        // Also save to localStorage
                        const savedInterpretations = JSON.parse(
                          localStorage.getItem('savedInterpretations') || '[]'
                        )
                        const newInterpretation = {
                          id: Date.now(),
                          date: new Date().toISOString(),
                          stickNumber: fortuneStick.number,
                          level: fortuneStick.levelEN || fortuneStick.level,
                          question: userQuestion,
                          interpretation: {
                            resonance: interpretation.resonance,
                            weaving: interpretation.weaving,
                            ritual: interpretation.ritual,
                          },
                        }
                        savedInterpretations.push(newInterpretation)
                        localStorage.setItem('savedInterpretations', JSON.stringify(savedInterpretations))
                        
                        setIsSaved(true)
                        setIsSavingImage(false)
                        setTimeout(() => setIsSaved(false), 3000)
                      }, 'image/png')
                    } catch (error) {
                      console.error('Error saving image:', error)
                      setIsSavingImage(false)
                      alert('Failed to save image. Please try again.')
                    }
                  }}
                  disabled={isSavingImage}
                  className="w-full relative overflow-hidden rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 group"
                  style={{
                    background: isSaved 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(218, 165, 32, 0.15) 100%)',
                    border: `2px solid ${isSaved ? '#22c55e' : '#FFD700'}`,
                    boxShadow: isSaved 
                      ? '0 0 20px rgba(34, 197, 94, 0.3)'
                      : '0 0 20px rgba(255, 215, 0, 0.2)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Shimmer effect */}
                  {!isSaved && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.3) 50%, transparent 100%)',
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    {isSavingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        <span className="text-amber-400 font-semibold text-lg">
                          Generating Image...
                        </span>
                        <p className="text-white/40 text-xs mt-1">
                          Please wait
                        </p>
                      </>
                    ) : isSaved ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold text-lg">
                            Image Saved!
                          </span>
                        </div>
                        <p className="text-white/50 text-xs mt-1">
                          Downloaded to your device & saved to collection
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-amber-400" />
                          <span 
                            className="font-semibold text-lg"
                            style={{
                              color: '#FFD700',
                              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                            }}
                          >
                            Save Reading
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-1">
                          Download as image & save to collection
                        </p>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </ScrollFadeIn>
          )}

          {/* View Collection Link - Only show when there are saved readings */}
          {typeof window !== 'undefined' && (
            <ScrollFadeIn delay={0}>
              <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto mt-6 mb-8 text-center`}>
                <Link
                  href="/history"
                  className="text-white/50 hover:text-white/80 text-sm transition-colors duration-200 underline underline-offset-4"
                >
                  View My Collection ({typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('savedInterpretations') || '[]').length) : 0})
                </Link>
              </div>
            </ScrollFadeIn>
          )}
      </div>
    </main>
  )
}
