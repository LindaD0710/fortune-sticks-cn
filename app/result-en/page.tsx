'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { ArrowLeft, Lock, Heart, DollarSign, Briefcase, GraduationCap, Activity, Scale, Plane, Users, TrendingUp, Loader2, Waves, GitBranch, Sparkles, X, ScrollText, BookOpen, Lightbulb } from 'lucide-react'
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

function OracleVerseCard({ content }: { content: string }) {
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
          {/* Title inside the card */}
          <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
            <OracleVerseIcon />
            签诗
          </h3>
          
          {/* Collection Seal Watermark */}
          <CollectionSealWatermark />
          
          {/* Content - Chinese poem */}
          <div className="flex flex-col gap-4">
            {/* Chinese original poem (Content) - Two lines format */}
            <div className="w-full flex justify-center">
              {(() => {
                // Split Chinese poem by punctuation (，。、) and format into two lines
                const sentences = content.split(/[，。、]/).filter(s => s.trim());
                const firstLine = sentences.slice(0, 2).join('，') + (sentences.length > 2 ? '，' : '');
                const secondLine = sentences.slice(2, 4).join('，') + (sentences.length > 4 ? '，' : '') + '。';
                
                return (
                  <div 
                    className="text-lg sm:text-xl md:text-2xl font-serif font-light tracking-[0.1em] sm:tracking-[0.15em] leading-[2.2] sm:leading-[2.5] text-center"
                    style={{ 
                      fontFamily: '"STXingkai", "Xingkai SC", "行楷", "KaiTi", "楷体", serif',
                      color: '#FFFFFF',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 215, 0, 0.15)',
                    }}
                  >
                    <div style={{ marginBottom: '0.5em' }}>{firstLine}</div>
                    <div>{secondLine}</div>
                  </div>
                );
              })()}
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

// Story Brief component - Dark purple background with gold border, includes Story and Story_Brief
function StoryBrief({ story, storyBrief }: { story: string; storyBrief: string }) {
  return (
    <motion.div
      className={`relative ${UNIFIED_CONTAINER_WIDTH} mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      {/* Card with unified border style: left border 2px solid gold, other borders 1px subtle gold */}
      <div 
        className="relative rounded-xl p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-md"
        style={{
          borderLeft: '2px solid #FFD700',
        }}
      >
          {/* Title inside the card */}
          <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
            <StoryIcon />
            典故
          </h3>
          
          {/* Story subtitle with icon */}
          {story && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <LubanRulerIcon className="opacity-60" />
              <p 
                className="text-lg sm:text-xl font-medium text-center"
                style={{ 
                  color: '#FFD700',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {story}
              </p>
              <LubanRulerIcon className="opacity-60" />
            </div>
          )}
          {/* Story_Brief content */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed text-center">
            {storyBrief}
          </p>
      </div>
    </motion.div>
  )
}

// Items grid component with icons
function ItemsGrid({ items }: { items: string }) {
  // Parse Chinese items string and map to icons
  const parseItems = (items: string) => {
    if (!items) return []
    
    const itemMap: { [key: string]: { icon: any; label: string } } = {
      '事业': { icon: Briefcase, label: '事业' },
      '财运': { icon: DollarSign, label: '财运' },
      '婚姻': { icon: Heart, label: '婚姻' },
      '感情': { icon: Heart, label: '感情' },
      '功名': { icon: GraduationCap, label: '功名' },
      '健康': { icon: Activity, label: '健康' },
      '疾病': { icon: Activity, label: '疾病' },
      '诉讼': { icon: Scale, label: '诉讼' },
      '出行': { icon: Plane, label: '出行' },
      '远行': { icon: Plane, label: '远行' },
      '社交': { icon: Users, label: '社交' },
      '当前状况': { icon: TrendingUp, label: '当前状况' },
      '所有事项': { icon: TrendingUp, label: '所有事项' },
    }

    return items.split(';').map(item => {
      const [key, value] = item.split(':')
      const mapped = itemMap[key?.trim() || ''] || { icon: TrendingUp, label: key?.trim() || '' }
      return {
        ...mapped,
        value: value?.trim() || '',
        key: key?.trim() || '',
      }
    }).filter(item => item.key && item.value)
  }

  const parsedItems = parseItems(items)

  if (parsedItems.length === 0) return null

  return (
    <motion.div
      className={`mt-8 ${UNIFIED_CONTAINER_WIDTH} mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {parsedItems.map((item, index) => {
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

// Weaving animation component for loading state
function WeavingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-64 h-64 mb-8">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
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
      >
        正在为您编织解读...
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

function OracleVerseIcon() {
  return (
    <ScrollText 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

function StoryIcon() {
  return (
    <BookOpen 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

function RevelationIcon() {
  return (
    <Lightbulb 
      className="w-5 h-5 text-amber-400" 
      strokeWidth={1.5}
      style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' }}
    />
  )
}

// Component to render text with golden highlights and paragraph breaks
function HighlightedText({ text }: { text: string }) {
  // Split by double newlines first to get major sections
  const sections = text.split(/\n\n+/).filter(s => s.trim())
  
  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => {
        // Check if this section starts with a bold title (like "**当前状态**：")
        const titleMatch = section.match(/^(\*\*.*?\*\*[：:])?\s*([\s\S]*)$/)
        const hasTitle = titleMatch && titleMatch[1]
        const title = hasTitle ? titleMatch[1].replace(/\*\*/g, '').replace(/[：:]\s*$/, '') : null
        const content = hasTitle ? titleMatch[2] : section
        
        // Split content by single newlines to get paragraphs
        const paragraphs = content.split(/\n/).filter(p => p.trim())
        
        return (
          <div key={sectionIndex} className="space-y-3">
            {/* Render title if exists */}
            {title && (
              <h4 
                className="text-amber-300 font-semibold text-base sm:text-lg mb-2"
                style={{
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                }}
              >
                {title}
              </h4>
            )}
            
            {/* Render paragraphs */}
            {paragraphs.map((paragraph, paraIndex) => {
              // Process bold text within paragraph
              const parts = paragraph.split(/(\*\*.*?\*\*)/g)
              
              return (
                <p 
                  key={paraIndex}
                  className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed"
                  style={{ lineHeight: '1.8' }}
                >
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      const goldenText = part.slice(2, -2)
                      return (
                        <span 
                          key={partIndex}
                          className="font-bold text-[#FFD700]"
                          style={{
                            textShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
                          }}
                        >
                          {goldenText}
                        </span>
                      )
                    }
                    return <span key={partIndex}>{part}</span>
                  })}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// Payment card component removed - no longer needed

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
  const [interpretation, setInterpretation] = useState<{
    insight: string
    guidance: string
    practice: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWeaving, setIsWeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

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
    // Start fetching AI interpretation after content is shown
    const stick = sessionStorage.getItem('drawnStick')
    const question = sessionStorage.getItem('userQuestion')
    if (stick && question) {
      fetchInterpretation(parseInt(stick), question)
    }
  }

  const fetchInterpretation = async (stickNum: number, question: string) => {
    try {
      setIsLoading(true)
      setIsWeaving(true)
      setError(null)
      
      setTimeout(() => {
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
            content: fortuneStick.content,
            detail2: fortuneStick.detail2,
            story: fortuneStick.story,
            storyBrief: fortuneStick.storyBrief,
            items: fortuneStick.items,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || '生成解读失败')
      }

      if (!data.insight && !data.resonance) {
        throw new Error('API返回的解读数据不完整')
      }

      setInterpretation({
        insight: data.insight || data.resonance || '签文已感受到你的问题，能量正在与你的问题产生共鸣...',
        guidance: data.guidance || data.weaving || '签文的智慧提醒我们，每一个挑战都蕴含着成长的机会。',
        practice: data.practice || data.ritual || '本周每天花10分钟静心反思，写下你的感受和想法。'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误')
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setIsWeaving(false)
      }, 3000)
    }
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
            <span>返回</span>
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

              {/* Golden divider */}
              <GoldenDivider />

              {/* 1. Lot Number with Seal */}
              {stickNumber && (
                <FadeInText delay={0.5}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto relative flex items-center mb-8`}>
                    {/* Seal fixed on the left, aligned with card left edge */}
                    <div className="absolute left-0 flex-shrink-0 z-10">
                      <Seal level={fortuneStick.level || '大吉'} />
                    </div>
                    {/* Lot number title - Large Serif with golden color, centered, responsive */}
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
                      第 {stickNumber} 签
                    </h1>
                  </div>
                </FadeInText>
              )}

              {/* Golden divider */}
              <GoldenDivider />

              {/* 2. User Question */}
              {userQuestion && (
                <FadeInText delay={0.7}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                    <div 
                      className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
                      style={{
                        borderLeft: '2px solid #FFD700',
                        borderTop: '0.5px solid rgba(255, 215, 0, 0.15)',
                        borderRight: '0.5px solid rgba(255, 215, 0, 0.15)',
                        borderBottom: '0.5px solid rgba(255, 215, 0, 0.15)',
                      }}
                    >
                      <div className="relative z-10 text-center">
                        <p 
                          className="text-white/95 text-lg sm:text-xl md:text-2xl leading-relaxed"
                          style={{
                            fontFamily: '"STXingkai", "Xingkai SC", "行楷", "KaiTi", "楷体", serif',
                          }}
                        >
                          "{userQuestion}"
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeInText>
              )}

              {/* Golden divider */}
              {userQuestion && <GoldenDivider />}

              {/* 4. Content - Oracle Verse Card */}
              {fortuneStick.content && (
                <FadeInText delay={0.8}>
                  <OracleVerseCard 
                    content={fortuneStick.content}
                  />
                  <GoldenDivider />
                </FadeInText>
              )}

              {/* 4. AI Deep Interpretation Section - 个性化解读 */}
              {/* Loading or Error State */}
              {(isLoading || isWeaving) && (
                <WeavingAnimation />
              )}

              {error && (
                <FadeInText delay={0}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-red-500">
                      <p className="text-red-400 text-base sm:text-lg font-semibold mb-2">
                        {error}
                      </p>
                      <button
                        onClick={() => stickNumber && userQuestion && fetchInterpretation(stickNumber, userQuestion)}
                        className="mt-4 px-6 py-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-full transition-colors"
                      >
                        重试
                      </button>
                    </div>
                  </div>
                </FadeInText>
              )}

              {/* AI Interpretation Content */}
              {interpretation && !isLoading && !error && (
                <div className="space-y-8 mt-8" ref={contentRef}>
                  {/* Core Insight */}
                  {interpretation.insight && (
                    <ScrollFadeIn delay={0}>
                      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700]">
                          <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
                            <ResonanceIcon />
                            核心洞察
                          </h3>
                          <div>
                            <HighlightedText text={interpretation.insight} />
                          </div>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  )}

                  {/* Golden divider between Core Insight and Guidance */}
                  {interpretation.insight && (interpretation.guidance || interpretation.practice) && (
                    <GoldenDivider />
                  )}

                  {/* Action Guidance */}
                  {interpretation.guidance && (
                    <ScrollFadeIn delay={0.1}>
                      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700]">
                          <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
                            <WeavingIcon />
                            行动指引
                          </h3>
                          <div>
                            <HighlightedText text={interpretation.guidance} />
                          </div>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  )}

                  {/* Golden divider between Guidance and Practice */}
                  {interpretation.guidance && interpretation.practice && (
                    <GoldenDivider />
                  )}

                  {/* Practice - 实践建议 */}
                  {interpretation.practice && (
                    <ScrollFadeIn delay={0.2}>
                      <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto`}>
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border-l-2 border-[#FFD700]">
                          <h3 className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 uppercase tracking-wider text-left flex items-center gap-2 sm:gap-3">
                            <RitualIcon />
                            实践建议
                          </h3>
                          <div>
                            <HighlightedText text={interpretation.practice} />
                          </div>
                        </div>
                      </div>
                    </ScrollFadeIn>
                  )}
                </div>
              )}

              {/* Deep Consultation Button */}
              {interpretation && !isLoading && !error && (
                <FadeInText delay={2}>
                  <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto mt-12 mb-8 flex justify-center`}>
                    <motion.button
                      onClick={() => setShowQRCode(true)}
                      className="relative w-full sm:w-auto px-10 sm:px-14 md:px-18 py-5 sm:py-6 md:py-7 text-white font-bold text-lg sm:text-xl md:text-2xl rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        background: '#6B21A8',
                        boxShadow: '0 10px 30px rgba(107, 33, 168, 0.4), 0 5px 15px rgba(107, 33, 168, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
                      }}
                      whileHover={{ 
                        scale: 1.08,
                        boxShadow: '0 15px 40px rgba(107, 33, 168, 0.5), 0 8px 20px rgba(107, 33, 168, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                      }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {/* Sweep light effect from right to left */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                        style={{
                          zIndex: 1,
                          background: 'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%, transparent 100%)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['200% 0', '-200% 0'],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                          ease: 'easeInOut',
                        }}
                      />
                      
                      {/* Text - clean and clear, no shadows */}
                      <span 
                        className="relative z-20 font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                        style={{
                          letterSpacing: '0.5px',
                        }}
                      >
                        点击升级人工专业解读
                      </span>
                    </motion.button>
                  </div>
                </FadeInText>
              )}

              {/* WeChat QR Code Modal */}
              {showQRCode && (
                <AnimatePresence>
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowQRCode(false)}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <motion.div
                      className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowQRCode(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      {/* Header with Avatar and Name */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src="/yinyang.png" 
                            alt="头像" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image doesn't exist
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            半夏实验室
                          </h3>
                          <p className="text-xs text-gray-500">
                            深度解惑咨询
                          </p>
                        </div>
                      </div>
                      
                      {/* QR Code */}
                      <div className="flex justify-center mb-4">
                        <div className="w-64 h-64 bg-white rounded-lg p-3 border-2 border-gray-200 shadow-inner">
                          <img 
                            src="/wechat-qr.png" 
                            alt="微信二维码" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback placeholder if image doesn't exist
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent && !parent.querySelector('.qr-placeholder')) {
                                const placeholder = document.createElement('div')
                                placeholder.className = 'qr-placeholder w-full h-full bg-gray-100 rounded flex items-center justify-center'
                                placeholder.innerHTML = '<p class="text-gray-400 text-sm">[微信二维码]</p>'
                                parent.appendChild(placeholder)
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Instruction Text */}
                      <p className="text-gray-600 text-center mb-3 text-sm leading-relaxed">
                        扫一扫上面的二维码图案，加我为朋友。
                      </p>
                      
                      {/* Fallback Text */}
                      <p className="text-gray-500 text-xs text-center leading-relaxed">
                        如果二维码失效，请在微信中搜索微信号 <span className="font-mono font-semibold text-gray-700 whitespace-nowrap">goodluck-lilylily</span> 添加
                      </p>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Compliance Statement */}
              <FadeInText delay={2.2}>
                <div className={`${UNIFIED_CONTAINER_WIDTH} mx-auto mt-8 mb-12`}>
                  <p className="text-white/30 text-[10px] sm:text-xs text-center leading-relaxed">
                    本报告由 AI 基于传统文化大数据推演，仅供心理疏导与娱乐，请相信科学，美好生活靠努力创造。
                  </p>
                </div>
              </FadeInText>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
