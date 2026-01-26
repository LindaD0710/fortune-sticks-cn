'use client'

import Link from 'next/link'
import { ArrowLeft, Trash2, Calendar, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getFortuneStick } from '@/lib/fortune-sticks'

interface SavedInterpretation {
  id: number
  date: string
  stickNumber: number
  level: string
  question: string
  interpretation: {
    resonance: string
    weaving: string
    ritual: string
  }
}

const UNIFIED_CONTAINER_WIDTH = 'w-[90%] max-w-5xl'

function ScrollFadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function HistoryPage() {
  const [savedReadings, setSavedReadings] = useState<SavedInterpretation[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('savedInterpretations')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Sort by date, newest first
        const sorted = parsed.sort((a: SavedInterpretation, b: SavedInterpretation) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setSavedReadings(sorted)
      } catch (e) {
        console.error('Error parsing saved interpretations:', e)
      }
    }
  }, [])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this reading?')) {
      const updated = savedReadings.filter((reading) => reading.id !== id)
      setSavedReadings(updated)
      localStorage.setItem('savedInterpretations', JSON.stringify(updated))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isClient) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]">
        <div className="text-white/50">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]">
      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto relative z-10`}>
        {/* Back Button */}
        <Link
          href="/interpret"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interpretation</span>
        </Link>

        {/* Header */}
        <ScrollFadeIn delay={0}>
          <div className="mb-12 text-center">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
              style={{
                color: '#FFD700',
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                letterSpacing: '0.05em',
                fontWeight: 400,
              }}
            >
              My Collection
            </h1>
            <p className="text-white/50 text-sm sm:text-base">
              Your saved readings are stored in your browser's local storage
            </p>
          </div>
        </ScrollFadeIn>

        {/* Saved Readings List */}
        {savedReadings.length === 0 ? (
          <ScrollFadeIn delay={0.2}>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 text-center border-l-2 border-[#FFD700]">
              <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 text-lg mb-2">No saved readings yet</p>
              <p className="text-white/30 text-sm">
                Your saved interpretations will appear here
              </p>
            </div>
          </ScrollFadeIn>
        ) : (
          <div className="space-y-6">
            {savedReadings.map((reading, index) => {
              const fortuneStick = getFortuneStick(reading.stickNumber)
              return (
                <ScrollFadeIn key={reading.id} delay={index * 0.1}>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700] relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-amber-400 font-semibold text-lg">
                            Lot #{reading.stickNumber}
                          </span>
                          <span className="text-white/60 text-sm">•</span>
                          <span 
                            className="text-white/80 font-semibold"
                            style={{
                              color: '#FFD700',
                              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                            }}
                          >
                            {reading.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(reading.date)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-2"
                        title="Delete this reading"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Question */}
                    {reading.question && (
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Your Question</p>
                        <p 
                          className="text-white/90 italic"
                          style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                          }}
                        >
                          "{reading.question}"
                        </p>
                      </div>
                    )}

                    {/* Interpretation Preview */}
                    <div className="space-y-4">
                      {reading.interpretation.resonance && (
                        <div>
                          <p className="text-amber-300 text-xs uppercase tracking-wider mb-2">The Resonance</p>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {reading.interpretation.resonance.replace(/\*\*/g, '')}
                          </p>
                        </div>
                      )}
                      {reading.interpretation.weaving && (
                        <div>
                          <p className="text-amber-300 text-xs uppercase tracking-wider mb-2">The Weaving</p>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {reading.interpretation.weaving.replace(/\*\*/g, '')}
                          </p>
                        </div>
                      )}
                      {reading.interpretation.ritual && (
                        <div>
                          <p className="text-amber-300 text-xs uppercase tracking-wider mb-2">The Practice</p>
                          <p className="text-white/70 text-sm line-clamp-1 italic">
                            {reading.interpretation.ritual.replace(/\*\*/g, '')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Full Reading Link */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <Link
                        href={`/interpret?reading=${reading.id}`}
                        className="text-amber-400 hover:text-amber-300 text-sm transition-colors inline-flex items-center gap-2"
                      >
                        View Full Reading →
                      </Link>
                    </div>
                  </div>
                </ScrollFadeIn>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
