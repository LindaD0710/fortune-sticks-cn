'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
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

// Ink smoke / silk floating animation
function InkSmokeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${0.1 - i * 0.015}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 20), 0],
            y: [0, (i % 2 === 0 ? -1 : 1) * (30 + i * 15), 0],
            scale: [1, 1.3 + i * 0.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

// Bottom energy field (Floor Glow) - beneath the container
function FloorGlow({ isShaking }: { isShaking: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
      style={{
        bottom: '15%',
        width: '600px',
        height: '200px',
        maxWidth: '90vw',
      }}
      animate={isShaking ? {
        // Rapid flickering during shake - energy instability
        opacity: [0.2, 0.5, 0.15, 0.4, 0.2, 0.45, 0.15],
        scale: [1, 1.2, 1.05, 1.15, 1, 1.18, 1],
      } : {
        opacity: [0.15, 0.25, 0.15],
        scale: [1, 1.1, 1],
      }}
      transition={isShaking ? {
        duration: 0.15,
        repeat: Infinity,
        ease: 'linear',
      } : {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.2) 0%, rgba(168, 85, 247, 0.15) 30%, rgba(168, 85, 247, 0.08) 60%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />
    </motion.div>
  )
}

// Ambient particles - tiny golden dust particles slowly rising
function AmbientParticles() {
  const particleCount = 50 // Increased from 30
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(particleCount)].map((_, i) => {
        const startX = Math.random() * 100 // Random horizontal position
        const duration = 15 + Math.random() * 10 // 15-25 seconds
        const delay = Math.random() * 5 // Random delay
        const size = 2 + Math.random() * 4 // 2-6px (increased from 1-3px)
        const horizontalDrift = (Math.random() - 0.5) * 50 // Slight horizontal drift
        const glowSize = size * 2 // Larger glow for visibility
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${startX}%`,
              bottom: '0%',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 1) 0%, rgba(255, 200, 0, 0.8) 40%, rgba(255, 165, 0, 0.5) 70%, transparent 100%)',
              boxShadow: `0 0 ${glowSize}px rgba(255, 215, 0, 0.9), 0 0 ${glowSize * 1.5}px rgba(255, 215, 0, 0.5)`,
              filter: 'blur(0.5px)',
            }}
            initial={{
              opacity: 0,
              y: 0,
              x: 0,
            }}
            animate={{
              opacity: [0, 0.8, 1, 0.9, 0.7, 0], // More visible opacity range
              y: -1200, // Move up and out of view
              x: horizontalDrift,
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'linear',
              delay: delay,
            }}
          />
        )
      })}
    </div>
  )
}

// Big Dipper (北斗七星) constellation
function BigDipper() {
  // Big Dipper star positions (normalized to 0-100 for percentage)
  // Arranged in the classic "dipper" shape
  const stars = [
    { x: 15, y: 20, name: '天枢' }, // Dubhe
    { x: 18, y: 25, name: '天璇' }, // Merak
    { x: 22, y: 28, name: '天玑' }, // Phecda
    { x: 25, y: 30, name: '天权' }, // Megrez
    { x: 30, y: 35, name: '玉衡' }, // Alioth
    { x: 35, y: 40, name: '开阳' }, // Mizar
    { x: 42, y: 45, name: '摇光' }, // Alkaid
  ]
  
  // Connection lines to form the dipper shape
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], // Main dipper
    [0, 3], // Cross connection for the bowl
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection lines */}
        {connections.map(([start, end], i) => {
          const startStar = stars[start]
          const endStar = stars[end]
          return (
            <motion.line
              key={`line-${i}`}
              x1={startStar.x}
              y1={startStar.y}
              x2={endStar.x}
              y2={endStar.y}
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="0.3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          )
        })}
        
        {/* Stars */}
        {stars.map((star, i) => (
          <motion.g key={`star-${i}`}>
            {/* Star glow */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r="1.5"
              fill="url(#starGradient)"
              filter="url(#starGlow)"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
            {/* Main star */}
            <motion.circle
              cx={star.x}
              cy={star.y}
              r="0.8"
              fill="#FFD700"
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          </motion.g>
        ))}
        
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFA500" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
}

// Bottom stick sea - The Sea of Lots (optimized with flat rectangular sticks)
function StickForest({ isShaking, isRising, drawnStick }: { isShaking: boolean; isRising: boolean; drawnStick: number | null }) {
  const stickCount = 120 // More sticks for richness
  const centerX = 50 // percentage - center of fan
  const centerY = 98 // percentage - bottom center
  const maxAngle = 80 // degrees spread from center (wider arc)
  const minRadius = 12
  const maxRadius = 50
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none overflow-hidden">
      {/* Purple glow effect on the surface */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{
          background: 'linear-gradient(to top, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
          filter: 'blur(8px)',
        }}
      />
      
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(stickCount)].map((_, i) => {
          // Fan-shaped distribution with layered stacking
          const normalizedPos = i / (stickCount - 1) // 0 to 1
          const layer = Math.floor(i / (stickCount / 4)) // 4 layers for depth
          const randomOffset = (i % 11) * 0.25 // Staggered stacking
          const angle = (normalizedPos - 0.5) * maxAngle * 2 + randomOffset * (i % 2 === 0 ? 1 : -1)
          const radius = minRadius + (normalizedPos * (maxRadius - minRadius)) + (i % 6) * 1.5 + randomOffset
          
          // Calculate stick position
          const radian = (angle * Math.PI) / 180
          const x = centerX + Math.cos(radian) * radius
          const y = centerY - Math.sin(radian) * radius
          
          // Flat rectangular stick properties
          const stickLength = 6 + (i % 8) * 1.2 + (i % 3) * 0.6
          const stickWidth = 0.8 + (i % 4) * 0.3 // Thicker for flat appearance
          const stickRotation = angle + 90 + (i % 5) * 1.5 // Slight rotation variation
          
          // Calculate stick rectangle corners
          const halfWidth = stickWidth / 2
          const cosRot = Math.cos((stickRotation * Math.PI) / 180)
          const sinRot = Math.sin((stickRotation * Math.PI) / 180)
          
          // Rectangle corners
          const x1 = x - halfWidth * sinRot
          const y1 = y + halfWidth * cosRot
          const x2 = x + stickLength * cosRot - halfWidth * sinRot
          const y2 = y + stickLength * sinRot + halfWidth * cosRot
          const x3 = x + stickLength * cosRot + halfWidth * sinRot
          const y3 = y + stickLength * sinRot - halfWidth * cosRot
          const x4 = x + halfWidth * sinRot
          const y4 = y - halfWidth * cosRot
          
          // Layer-based opacity and z-index effect
          const layerOpacity = 0.4 - layer * 0.08 // Deeper layers more transparent
          const baseDelay = (i % 15) * 0.06
          const wavePhase = (i % 9) * 0.4
          
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.008 }}
            >
              <motion.polygon
                points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                fill="url(#stickSeaGradient)"
                opacity={layerOpacity}
                stroke="rgba(168, 85, 247, 0.2)"
                strokeWidth="0.1"
                animate={isRising && drawnStick ? {
                  // Ripple effect - waves from center outward
                  opacity: [layerOpacity, layerOpacity * 1.8, layerOpacity * 1.4, layerOpacity],
                } : isShaking ? {
                  // Subtle vibration when shaking
                  opacity: [layerOpacity, layerOpacity * 1.3, layerOpacity],
                } : {
                  // Extremely subtle floating/breathing effect
                  opacity: [
                    layerOpacity * 0.9,
                    layerOpacity * 1.1,
                    layerOpacity * 0.9
                  ],
                }}
                transition={{
                  duration: isRising ? 1.2 : isShaking ? 0.3 : 5 + (i % 8) * 0.5,
                  repeat: isRising ? 2 : Infinity,
                  ease: isRising ? 'easeInOut' : isShaking ? 'easeInOut' : [0.42, 0, 0.58, 1],
                  delay: isRising ? (Math.abs(angle) / maxAngle) * 0.15 : baseDelay,
                }}
              />
            </motion.g>
          )
        })}
        <defs>
          {/* Light beige/pale brown wood gradient */}
          <linearGradient id="stickSeaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5E6D3" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#E8D5C4" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#D4C4B0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C9B8A3" stopOpacity="0.75" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function TossPage() {
  const [isShaking, setIsShaking] = useState(false)
  const [drawnStick, setDrawnStick] = useState<number | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isRising, setIsRising] = useState(false)
  const [containerTop, setContainerTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const shakeSoundIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get user question from sessionStorage
  useEffect(() => {
    const question = sessionStorage.getItem('userQuestion')
    if (!question) {
      window.location.href = '/ask'
    }
  }, [])

  // Initialize Audio Context
  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    return () => {
      // Cleanup
      if (shakeSoundIntervalRef.current) {
        clearInterval(shakeSoundIntervalRef.current)
      }
    }
  }, [])

  // Update container position
  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerTop(rect.top + rect.height / 2)
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  // Haptic feedback function
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch (e) {
        // Vibration not supported or failed
        console.log('Vibration not supported')
      }
    }
  }

  // Generate bamboo stick collision sound
  const playBambooCollisionSound = () => {
    if (!audioContextRef.current) return
    
    const audioContext = audioContextRef.current
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Crisp, short bamboo-like sound
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioContext.currentTime) // 800-1000 Hz
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.05)
  }

  // Generate ethereal "ding" sound for stick drawing
  const playDrawStickSound = () => {
    if (!audioContextRef.current) return
    
    const audioContext = audioContextRef.current
    
    // Create multiple oscillators for a richer, ethereal sound
    const frequencies = [880, 1100, 1320] // A5, C#6, E6 - harmonious chord
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.02)
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.02)
      gainNode.gain.linearRampToValueAtTime(0.15 / (index + 1), audioContext.currentTime + index * 0.02 + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.02 + 0.8)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.start(audioContext.currentTime + index * 0.02)
      oscillator.stop(audioContext.currentTime + index * 0.02 + 0.8)
    })
  }

  const handleShake = () => {
    if (isDrawing) return
    
    // Update container position before shaking
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setContainerTop(rect.top + rect.height / 2)
    }
    
    // Resume audio context if suspended (required for user interaction)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    
    setIsShaking(true)
    setIsDrawing(true)
    
    // Haptic feedback: Start with a strong vibration
    triggerHaptic(50)
    
    // Play bamboo collision sounds during shaking
    // Play initial sound
    playBambooCollisionSound()
    
    // Continue playing collision sounds at intervals during shake
    shakeSoundIntervalRef.current = setInterval(() => {
      playBambooCollisionSound()
      // Subtle haptic feedback for each collision
      triggerHaptic(20)
    }, 120) // Play every 120ms during shake
    
    // High-frequency vibration for 1.5 seconds
    setTimeout(() => {
      // Stop collision sounds
      if (shakeSoundIntervalRef.current) {
        clearInterval(shakeSoundIntervalRef.current)
        shakeSoundIntervalRef.current = null
      }
      
      setIsShaking(false)
      setIsRising(true)
      
      // Draw stick
      const stickNumber = Math.floor(Math.random() * 100) + 1
      setDrawnStick(stickNumber)
      
      sessionStorage.setItem('drawnStick', stickNumber.toString())
      
      // Play ethereal "ding" sound when stick is drawn
      playDrawStickSound()
      
      // Haptic feedback: Gentle pulse for stick drawing
      triggerHaptic([50, 30, 50])
      
      // Navigate to result page after showing the stick
      setTimeout(() => {
        window.location.href = '/result-en'
      }, 4000)
    }, 1500)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Deep purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]" />
      
      {/* Background with parallax effect */}
      <ParallaxBackground />
      
      {/* Ink smoke / silk floating animation */}
      <InkSmokeBackground />
      
      {/* Ambient particles - golden dust slowly rising */}
      <AmbientParticles />

      {/* Background dimming overlay when stick is rising */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isRising ? 0.4 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
        style={{ zIndex: 5 }}
      />

      {/* Bottom energy field - floor glow beneath container */}
      <FloorGlow isShaking={isShaking} />

      {/* Spotlight effect around container */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[600px] pointer-events-none"
        animate={{
          opacity: isShaking ? [0.4, 0.7, 0.4] : isRising ? [0.5, 0.8, 0.5] : [0.2, 0.4, 0.2],
          scale: isShaking ? [1, 1.3, 1] : isRising ? [1, 1.4, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: isShaking ? 0.3 : 2,
          repeat: isShaking ? Infinity : Infinity,
          ease: 'easeInOut',
        }}
      >
        <div 
          className="w-full h-full rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0.3) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col h-full">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-6"
        >
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 text-white/70 hover:text-mystic-purple-glow transition-colors text-sm sm:text-base"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>返回</span>
          </Link>
        </motion.div>

        {/* Main content - split layout */}
        <div className="flex-1 flex flex-col">
          {/* Top section - Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6"
          >
            {/* Title */}
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                摇签求问
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg text-white/80"
              >
                请集中精力，心中默念你的问题
              </motion.p>
            </div>

            {/* 3D Cylindrical Stick Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center items-center"
            >
              <motion.div
                ref={containerRef}
                className="relative cursor-pointer"
                onClick={handleShake}
                whileHover={!isDrawing ? { scale: 1.02 } : {}}
                animate={isShaking ? {
                  // High-frequency vibration with physical tilt and spring damping
                  rotate: [0, -12, 12, -10, 10, -8, 8, -6, 6, -4, 4, -3, 3, -2, 2, -1, 1, 0],
                  x: [0, -6, 6, -5, 5, -4, 4, -3, 3, -2, 2, -1, 1, 0],
                  y: [0, -3, 3, -2, 2, -1, 1, 0],
                } : {}}
                transition={isShaking ? {
                  duration: 0.12,
                  repeat: 12,
                  ease: [0.4, 0, 0.6, 1], // Sharp, quick transitions for vibration
                } : {
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {/* SVG Fortune Stick Container */}
                <motion.svg 
                  width="200" 
                  height="250" 
                  viewBox="0 0 200 250" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80"
                  animate={isShaking ? {
                    filter: [
                      'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
                      'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 20px rgba(255, 215, 0, 1))',
                      'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
                      'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 25px rgba(255, 215, 0, 1))',
                      'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
                    ],
                  } : {
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  }}
                  transition={isShaking ? {
                    duration: 0.12,
                    repeat: Infinity,
                    ease: 'linear',
                  } : {
                    duration: 0.3,
                  }}
                >
                  {/* Golden mist rising from the opening */}
                  <motion.g
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {/* Multiple layers of golden mist */}
                    <ellipse cx="100" cy="75" rx="35" ry="8" fill="url(#goldenMistGradient)" opacity="0.4" filter="url(#mistBlur)"/>
                    <ellipse cx="100" cy="70" rx="30" ry="6" fill="url(#goldenMistGradient)" opacity="0.5" filter="url(#mistBlur)"/>
                    <ellipse cx="100" cy="65" rx="25" ry="5" fill="url(#goldenMistGradient)" opacity="0.6" filter="url(#mistBlur)"/>
                  </motion.g>

                  <rect x="88" y="30" width="8" height="60" rx="4" fill="#CBA35C"/>
                  <rect x="110" y="40" width="8" height="50" rx="4" fill="#B89249"/>

                  {/* Container body with vertical gradient (bottom dark to top lighter) */}
                  <path d="M60 90 V 200 C 60 215, 140 215, 140 200 V 90" fill="url(#containerVerticalGradient)"/>
                  <ellipse cx="100" cy="90" rx="40" ry="15" fill="url(#containerTopGradient)"/>
                  
                  <rect x="95" y="20" width="10" height="75" rx="5" fill="url(#paint2_linear)"/>
                  <rect x="75" y="35" width="8" height="60" rx="4" fill="#D4AF67"/>
                  <rect x="120" y="35" width="8" height="60" rx="4" fill="#D4AF67"/>

                  {/* Golden metallic borders with inner glow */}
                  <ellipse cx="100" cy="90" rx="40" ry="15" stroke="url(#goldenMetallicGradient)" strokeWidth="4" filter="url(#innerGlow)"/>
                  <path d="M60 200 C 60 215, 140 215, 140 200" stroke="url(#goldenMetallicGradient)" strokeWidth="4" filter="url(#innerGlow)"/>

                  {/* "签" character with golden metallic gradient and inner glow */}
                  <text
                    x="100"
                    y="145"
                    textAnchor="middle"
                    fill="url(#goldenMetallicGradient)"
                    fontSize="36"
                    fontWeight="bold"
                    fontFamily="serif"
                    opacity="0.95"
                    filter="url(#innerGlow)"
                  >
                    签
                  </text>

                  <defs>
                    {/* Vertical gradient for container body (bottom dark to top lighter purple) */}
                    <linearGradient id="containerVerticalGradient" x1="100" y1="200" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1a0a2e" stopOpacity="0.95"/>
                      <stop offset="30%" stopColor="#2A1B3D" stopOpacity="0.9"/>
                      <stop offset="70%" stopColor="#3d2a5a" stopOpacity="0.85"/>
                      <stop offset="100%" stopColor="#4B366B" stopOpacity="0.8"/>
                    </linearGradient>
                    
                    {/* Top opening gradient */}
                    <linearGradient id="containerTopGradient" x1="100" y1="75" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4B366B" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#3F2E56" stopOpacity="0.95"/>
                    </linearGradient>
                    
                    {/* Golden metallic gradient for borders and text */}
                    <linearGradient id="goldenMetallicGradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="1"/>
                      <stop offset="25%" stopColor="#FFA500" stopOpacity="0.95"/>
                      <stop offset="50%" stopColor="#DAA520" stopOpacity="0.9"/>
                      <stop offset="75%" stopColor="#B8860B" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="1"/>
                    </linearGradient>
                    
                    {/* Golden mist gradient */}
                    <radialGradient id="goldenMistGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#FFA500" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
                    </radialGradient>
                    
                    {/* Stick gradient */}
                    <linearGradient id="paint2_linear" x1="100" y1="20" x2="100" y2="95" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFEB99"/>
                      <stop offset="1" stopColor="#DAA520"/>
                    </linearGradient>
                    
                    {/* Inner glow filter for golden elements */}
                    <filter id="innerGlow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                      <feOffset in="blur" dx="0" dy="0" result="offsetBlur"/>
                      <feFlood floodColor="#FFD700" floodOpacity="0.4" result="glowColor"/>
                      <feComposite in="glowColor" in2="offsetBlur" operator="in" result="innerGlow"/>
                      <feComposite in="SourceGraphic" in2="innerGlow" operator="over"/>
                    </filter>
                    
                    {/* Blur filter for golden mist */}
                    <filter id="mistBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3"/>
                    </filter>
                  </defs>
                </motion.svg>
              </motion.div>
            </motion.div>

            {/* Instruction text */}
            {!isRising && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-2 flex flex-col items-center"
              >
                <motion.button
                  onClick={handleShake}
                  disabled={isDrawing}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet text-white font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isDrawing ? { scale: 1.05 } : {}}
                  whileTap={!isDrawing ? { scale: 0.95 } : {}}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <span>开始摇签</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </motion.button>
                <p className="text-xs sm:text-sm text-white/60 mt-4 text-center">
                  点击签筒即可开始摇签
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Drawn stick - slowly rising from container center with golden glow */}
      <AnimatePresence>
        {isRising && drawnStick && containerRef.current && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.1,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: [0, 0.5, 1, 1],
              scale: [0.1, 0.6, 1, 1.2],
              y: [0, -100, -200, -250], // Slow, uniform rise
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 2.5,
              ease: 'linear', // Uniform speed
              times: [0, 0.3, 0.7, 1],
            }}
            className="fixed left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            style={{
              top: `${containerTop}px`,
            }}
          >
            {/* Radiating light rays */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12
              const radian = (angle * Math.PI) / 180
              return (
                <motion.div
                  key={`ray-${i}`}
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    width: '2px',
                    height: '150px',
                    background: 'linear-gradient(to top, rgba(255, 215, 0, 0.8) 0%, rgba(255, 215, 0, 0.4) 50%, transparent 100%)',
                    transform: `rotate(${angle}deg) translateY(-75px)`,
                    transformOrigin: 'bottom center',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.8, 0.6, 0.4],
                    scale: [0, 1, 1.2, 1, 0.8],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }}
                />
              )
            })}
            
            {/* Particle trail */}
            {[...Array(20)].map((_, i) => {
              const angle = Math.random() * 360
              const distance = 30 + Math.random() * 40
              const radian = (angle * Math.PI) / 180
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{
                    width: '3px',
                    height: '3px',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 1) 0%, transparent 100%)',
                    boxShadow: '0 0 6px rgba(255, 215, 0, 0.8)',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    x: Math.cos(radian) * distance,
                    y: Math.sin(radian) * distance - 50,
                    opacity: [1, 0.8, 0.4, 0],
                    scale: [1, 1.5, 0.8, 0],
                  }}
                  transition={{
                    duration: 1.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                />
              )
            })}
            
            <motion.div
              className="relative"
              animate={{
                scale: [1.2, 1.3, 1.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Intense golden glow effect - multiple layers */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-yellow-400/90 via-amber-400/70 to-yellow-600/90 rounded-lg blur-3xl -z-10"
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-yellow-300/60 via-amber-300/50 to-yellow-500/60 rounded-lg blur-2xl -z-10"
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
              
              {/* Golden light stream wrapping the stick */}
              <motion.div
                className="absolute inset-0 rounded-xl -z-10"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 50%, rgba(255, 215, 0, 0.6) 100%)',
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Stick with golden border and glow */}
              <div className="relative px-10 py-8 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 rounded-xl border-4 border-yellow-400 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)' }}>
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-yellow-200/40 to-transparent" />
                <div className="text-center relative z-10">
                  <p className="text-amber-900 text-5xl sm:text-6xl md:text-7xl font-bold">
                    第 {drawnStick} 签
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
