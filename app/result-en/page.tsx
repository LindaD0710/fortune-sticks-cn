'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowLeft, Lock, Heart, DollarSign, Briefcase, GraduationCap, Activity, Scale, Plane, Users, TrendingUp } from 'lucide-react'
import { getFortuneStick } from '@/lib/fortune-sticks'

// Moon Blocks (筊杯) component for opening animation
function MoonBlocks({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const [blocksVisible, setBlocksVisible] = useState(false)
  const [blocksLanded, setBlocksLanded] = useState(false)
  const [goldenLight, setGoldenLight] = useState(false)

  useEffect(() => {
    if (show) {
      setBlocksVisible(true)
      setTimeout(() => {
        setBlocksLanded(true)
        setGoldenLight(true)
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
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 40 10 Q 50 20 50 40 Q 50 60 40 70 Q 30 60 30 40 Q 30 20 40 10 Z"
                    fill="url(#moonBlockGradient)"
                    stroke="#DAA520"
                    strokeWidth="2"
                  />
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

// Seal (印章) component - Red circular seal with woodcut impression and vermillion texture
function Seal({ level }: { level: string }) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
        }}
      >
        <defs>
          {/* Circular mask for texture */}
          <mask id="circleMask">
            <circle cx="40" cy="40" r="38" fill="white"/>
          </mask>
          
          {/* Inner shadow for woodcut impression effect - very subtle */}
          <filter id="woodcutImpression" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
            <feOffset in="blur" dx="0" dy="0.5" result="offsetBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.12" result="shadowColor"/>
            <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="innerShadow"/>
            <feComposite in="SourceGraphic" in2="innerShadow" operator="arithmetic" k2="1" k3="1"/>
          </filter>
          
          {/* Subtle vermillion grain texture - circular */}
          <filter id="vermillionGrain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="1.2" 
              numOctaves="2" 
              result="noise"
            />
            <feColorMatrix 
              in="noise" 
              type="saturate" 
              values="0"
            />
            <feComponentTransfer in="noise" result="grain">
              <feFuncA type="discrete" tableValues="0 0.05 0.08 0.1" />
            </feComponentTransfer>
            <feGaussianBlur in="grain" stdDeviation="0.5" result="softGrain"/>
            <feComposite in="SourceGraphic" in2="softGrain" operator="multiply"/>
          </filter>
        </defs>
        
        {/* Darker red circle with woodcut impression - historical narrative feel */}
        <circle
          cx="40"
          cy="40"
          r="38"
          fill="#B22222"
          stroke="#6B0000"
          strokeWidth="2"
          filter="url(#woodcutImpression)"
        />
        
        {/* Subtle vermillion grain overlay - circular */}
        <circle
          cx="40"
          cy="40"
          r="38"
          fill="#B22222"
          mask="url(#circleMask)"
          filter="url(#vermillionGrain)"
          opacity="0.3"
        />
        {/* Text */}
        <text
          x="40"
          y="50"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="28"
          fontWeight="bold"
          fontFamily="var(--font-serif-sc), serif"
          className="select-none"
          style={{
            filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
          }}
        >
          {level}
        </text>
      </svg>
    </motion.div>
  )
}

// Vertical Chinese text watermark background - Left-aligned with Xingkai font
function VerticalChineseWatermark({ content, isHovered }: { content: string; isHovered: boolean }) {
  // Split content into characters and arrange vertically
  const characters = content.split('')
  
  return (
    <motion.div 
      className="absolute left-0 top-0 bottom-0 flex items-start justify-start pointer-events-none overflow-hidden pl-8 sm:pl-12"
      animate={{ opacity: isHovered ? 0.1 : 0.08 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex flex-col items-start justify-start h-full pt-8"
        style={{ 
          fontFamily: '"STXingkai", "STKaiti", "KaiTi", "楷体", serif',
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          color: '#FFD700',
          fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
          lineHeight: '2.5',
          letterSpacing: '0.3em',
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.1 : 0.08 }}
            transition={{ duration: 0.3, delay: index * 0.01 }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// Tooltip component with hover state for watermark
function TooltipWithWatermark({ 
  children, 
  text, 
  watermarkContent 
}: { 
  children: React.ReactNode; 
  text: string;
  watermarkContent?: string;
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Watermark with hover state */}
      {watermarkContent && (
        <VerticalChineseWatermark content={watermarkContent} isHovered={isHovered} />
      )}
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Oracle Verse Card - Dark purple background with gold border, showing both Chinese and English
// Collection Seal Watermark Component - "关帝灵签"
function CollectionSealWatermark() {
  return (
    <div 
      className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none"
      style={{
        opacity: 0.12, // Very subtle watermark
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="40" cy="40" r="38" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.4"/>
        {/* Inner decorative border */}
        <circle cx="40" cy="40" r="32" stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.3"/>
        {/* Text: 关帝灵签 */}
        <text
          x="40"
          y="30"
          textAnchor="middle"
          fill="#FFD700"
          fontSize="10"
          fontFamily="var(--font-serif-sc), 'Noto Serif SC', serif"
          fontWeight="500"
          opacity="0.6"
        >
          关帝
        </text>
        <text
          x="40"
          y="50"
          textAnchor="middle"
          fill="#FFD700"
          fontSize="10"
          fontFamily="var(--font-serif-sc), 'Noto Serif SC', serif"
          fontWeight="500"
          opacity="0.6"
        >
          灵签
        </text>
      </svg>
    </div>
  )
}

// Unified container width constant - responsive: 95% on mobile, 90% on tablet, max-w-5xl on desktop
const UNIFIED_CONTAINER_WIDTH = 'w-[95%] sm:w-[90%] max-w-5xl'

function OracleVerseCard({ content, contentEN }: { content: string; contentEN: string }) {
  return (
    <motion.div
      className={`relative ${UNIFIED_CONTAINER_WIDTH} mx-auto my-8 rounded-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {/* Card with unified border style: left border only, bg-white/5 backdrop-blur-md */}
      <div 
        className="relative rounded-xl p-6 sm:p-8 overflow-hidden bg-white/5 backdrop-blur-md"
        style={{
          borderLeft: '2px solid #FFD700',
        }}
      >
          {/* Collection Seal Watermark */}
          <CollectionSealWatermark />
          
          {/* Content - Chinese poem first, then English */}
          <div className="flex flex-col gap-4">
            {/* Chinese original poem (Content) - Two lines format with vertical alignment */}
            <div className="w-full flex justify-center">
              {(() => {
                // Split Chinese poem by punctuation (，。、) and format into two lines
                const sentences = content.split(/[，。、]/).filter(s => s.trim());
                const firstLine = sentences.slice(0, 2).join('，') + (sentences.length > 2 ? '，' : '');
                const secondLine = sentences.slice(2, 4).join('，') + (sentences.length > 4 ? '，' : '') + '。';
                
                return (
                  <div 
                    className="text-lg sm:text-xl md:text-2xl font-serif font-light tracking-[0.1em] sm:tracking-[0.15em] leading-[2.2] sm:leading-[2.5]"
                    style={{ 
                      fontFamily: '"STXingkai", "Xingkai SC", "行楷", "KaiTi", "楷体", serif',
                      textAlign: 'left',
                      display: 'inline-block',
                      color: '#FFFFFF', // White color
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 215, 0, 0.15)', // Subtle shadow with golden glow
                    }}
                  >
                    <div style={{ marginBottom: '0.5em' }}>{firstLine}</div>
                    <div>{secondLine}</div>
                  </div>
                );
              })()}
            </div>

            {/* English translation (Content_EN) */}
            <div className="w-full text-center">
              <p 
                className="text-sm sm:text-base md:text-lg italic text-white leading-relaxed"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {contentEN}
              </p>
            </div>
          </div>
      </div>
    </motion.div>
  )
}

// Standardized Golden Divider component
function GoldenDivider() {
  return (
    <div className="flex justify-center my-8">
      <div 
        className="h-px"
        style={{
          width: '85%',
          background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.25), transparent)',
        }}
      />
    </div>
  )
}

// Minimalist icon component - Luban Ruler (鲁班尺) for The Builder theme
function LubanRulerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ stroke: '#FFD700', strokeWidth: '1', strokeLinecap: 'round', strokeLinejoin: 'round' }}
    >
      {/* Ruler body - horizontal line with measurement marks */}
      <line x1="2" y1="12" x2="22" y2="12" />
      {/* Measurement marks */}
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="8" y1="11" x2="8" y2="13" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <line x1="16" y1="11" x2="16" y2="13" />
      <line x1="20" y1="10" x2="20" y2="14" />
      {/* Decorative corner brackets */}
      <path d="M2 8 L6 12 L2 16" fill="none" />
      <path d="M22 8 L18 12 L22 16" fill="none" />
    </svg>
  )
}

// Story Brief component - Dark purple background with gold border, includes Story_EN and Story_Brief_EN
function StoryBrief({ storyEN, storyBrief }: { storyEN: string; storyBrief: string }) {
  return (
    <motion.div
      className={`relative ${UNIFIED_CONTAINER_WIDTH} mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <h3 
        className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wider"
        style={{ 
          paddingLeft: '0px',
          marginLeft: '0px',
          textAlign: 'left',
        }}
      >
        THE ANCIENT LEGEND
      </h3>
      {/* Card with unified border style: left border 2px solid gold, other borders 1px subtle gold */}
      <div 
        className="relative rounded-xl p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-md"
        style={{
          borderLeft: '2px solid #FFD700',
        }}
      >
          {/* Story_EN subtitle with icon */}
          {storyEN && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <LubanRulerIcon className="opacity-60" />
              <p 
                className="text-lg sm:text-xl font-medium"
                style={{ 
                  color: '#FFD700',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {storyEN}
              </p>
              <LubanRulerIcon className="opacity-60" />
            </div>
          )}
          {/* Story_Brief_EN content */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
            {storyBrief}
          </p>
      </div>
    </motion.div>
  )
}

// Items grid component with icons
function ItemsGrid({ itemsEN }: { itemsEN: string }) {
  // Parse items string and map to icons
  const parseItems = (items: string) => {
    if (!items) return []
    
    const itemMap: { [key: string]: { icon: any; label: string } } = {
      'Career': { icon: Briefcase, label: 'Career' },
      'Wealth': { icon: DollarSign, label: 'Wealth' },
      'Relationships': { icon: Heart, label: 'Relationships' },
      'Love': { icon: Heart, label: 'Love' },
      'Achievement': { icon: GraduationCap, label: 'Achievement' },
      'Health': { icon: Activity, label: 'Health' },
      'Legal': { icon: Scale, label: 'Legal' },
      'Travel': { icon: Plane, label: 'Travel' },
      'Social': { icon: Users, label: 'Social' },
      'Current Situation': { icon: TrendingUp, label: 'Current Situation' },
      'All Matters': { icon: TrendingUp, label: 'All Matters' },
    }

    return items.split('; ').map(item => {
      const [key, value] = item.split(': ')
      const mapped = itemMap[key] || { icon: TrendingUp, label: key }
      return {
        ...mapped,
        value: value || '',
        key,
      }
    })
  }

  const items = parseItems(itemsEN)

  if (items.length === 0) return null

  return (
    <motion.div
      className={`mt-8 ${UNIFIED_CONTAINER_WIDTH} mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <h3 
        className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wider"
        style={{ 
          paddingLeft: '0px',
          marginLeft: '0px',
          textAlign: 'left',
        }}
      >
        DESTINY'S COMPASS
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={index}
              className="relative rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
              }}
            >
              {/* Subtle radial purple glow behind the card */}
              <div 
                className="absolute inset-0 rounded-lg -z-10"
                style={{
                  background: 'radial-gradient(circle at center, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
              
              {/* Card with unified border style: left border 2px solid gold, other borders 1px subtle gold */}
              <div 
                className="relative rounded-lg p-4 sm:p-5 bg-white/5 backdrop-blur-md"
                style={{
                  borderLeft: '2px solid #FFD700',
                }}
              >
              {/* Vertical layout: icon on top, text below */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-lg">
                  <Icon 
                    className="w-6 h-6 stroke-[1.5]" 
                    stroke="#FFD700" 
                    fill="none"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.2))',
                    }}
                  />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-white/60 text-xs sm:text-sm font-medium mb-2 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-amber-300 text-sm sm:text-base font-semibold">
                    {item.value}
                  </p>
                </div>
              </div>
                </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Payment card component with pulse animation
function PaymentCard({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.div
      className={`relative ${UNIFIED_CONTAINER_WIDTH} mx-auto mt-12`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <div 
        className="relative rounded-xl p-6 sm:p-8 overflow-hidden bg-white/5 backdrop-blur-md"
        style={{
          borderLeft: '2px solid #FFD700',
          background: `
            radial-gradient(circle at center 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)
          `,
        }}
      >
        <div className="relative z-10 text-center">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-amber-400" />
          <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
            Unlock the Deep Interpretation
          </h3>
          <p className="text-white/70 text-sm sm:text-base mb-6">
            Step beyond the surface. Let the Silk weave a profound revelation specifically for your unique path.
          </p>
          {/* Social proof micro-copy */}
          <p className="text-white/40 text-xs mb-3 font-light">
            Join 10,000+ seekers who found clarity through our AI-guided wisdom.
          </p>
          <motion.button
            onClick={onUnlock}
            className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-white font-bold text-lg rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_4px_rgba(255,215,0,0.3),0_0_6px_rgba(255,215,0,0.15),0_4px_6px_rgba(0,0,0,0.1)]"
            whileHover={{ 
              scale: 1.08,
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Premium horizontal shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Text - clean and clear, no shadows */}
            <span className="relative z-20 font-bold">
              Unlock for $1.99
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Text fade-in animation component
function FadeInText({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ResultPageEN() {
  const [showMoonBlocks, setShowMoonBlocks] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [stickNumber, setStickNumber] = useState<number | null>(null)
  const [userQuestion, setUserQuestion] = useState<string | null>(null)

  useEffect(() => {
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
    window.location.href = '/interpret'
  }

  const fortuneStick = stickNumber ? getFortuneStick(stickNumber) : null

  if (!fortuneStick) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Deep purple background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1A1A2E' }} />

      {/* Moon Blocks opening animation */}
      <MoonBlocks show={showMoonBlocks} onComplete={handleMoonBlocksComplete} />

      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto relative z-10`}>
        {/* Back button */}
        <FadeInText delay={0.2}>
          <Link
            href="/toss"
            className="inline-flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors text-sm sm:text-base mb-6"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </Link>
        </FadeInText>

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
              <FadeInText delay={0.3} className="text-center mb-8">
                <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light italic">
                  The Oracle is confirmed. Wisdom is unfolding...
                </p>
              </FadeInText>

              {/* Golden divider */}
              <GoldenDivider />

              {/* Lot number */}
              {stickNumber && (
                <FadeInText delay={0.4} className="text-center mb-8">
                  <div 
                    className="relative inline-block px-6 py-3 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
                      border: '1px solid #FFD700',
                    }}
                  >
                    <p className="text-white text-2xl sm:text-3xl font-bold">
                      Lot #{stickNumber}
                    </p>
                  </div>
                </FadeInText>
              )}

              {/* Title: Level_EN with Seal - Seal fixed on left, Title centered */}
              <FadeInText delay={0.5}>
                <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto relative flex items-center mb-2`}>
                  {/* Seal fixed on the left, aligned with card left edge */}
                  <div className="absolute left-0 flex-shrink-0 z-10">
                    <Seal level={fortuneStick.level || '大吉'} />
                  </div>
                  {/* Level_EN title - Large Serif with golden color, centered, responsive */}
                  <h1 
                    className="w-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
                    style={{ 
                      fontFamily: '"Playfair Display", "Cormorant Garamond", "EB Garamond", Georgia, serif',
                      color: '#FFD700',
                      fontWeight: 700,
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    {fortuneStick.levelEN || 'Divine Favor'}
                  </h1>
                </div>
              </FadeInText>

              {/* Oracle Verse Card - Core visual area */}
              {fortuneStick.content && fortuneStick.contentEN && (
                <>
                  <OracleVerseCard 
                    content={fortuneStick.content}
                    contentEN={fortuneStick.contentEN}
                  />
                  {/* Golden divider after Verse */}
                  <GoldenDivider />
                </>
              )}

              {/* Story_Brief_EN with Story_EN */}
              {fortuneStick.storyBriefEN && (
                <>
                  <StoryBrief 
                    storyEN={fortuneStick.storyEN || ''}
                    storyBrief={fortuneStick.storyBriefEN} 
                  />
                  {/* Golden divider after Story */}
                  <GoldenDivider />
                </>
              )}

              {/* Detail2_EN - Core message */}
              {fortuneStick.detail2EN && (
                <FadeInText delay={1.3}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                    <h3 
                      className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wider"
                      style={{ 
                        paddingLeft: '0px',
                        marginLeft: '0px',
                        textAlign: 'left',
                      }}
                    >
                      ORACLE'S REVELATION
                    </h3>
                    {/* Card with unified border style: left border only, bg-white/5 backdrop-blur-md */}
                    <div 
                      className="relative rounded-xl p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-md"
                      style={{
                        borderLeft: '2px solid #FFD700',
                      }}
                    >
                        <p 
                          className="text-white/90 text-base sm:text-lg leading-relaxed"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          {fortuneStick.detail2EN}
                        </p>
                    </div>
                  </div>
                </FadeInText>
              )}

              {/* Golden divider after Message */}
              {fortuneStick.detail2EN && <GoldenDivider />}

              {/* Items_EN Grid */}
              {fortuneStick.itemsEN && (
                <ItemsGrid itemsEN={fortuneStick.itemsEN} />
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
