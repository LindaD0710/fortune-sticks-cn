'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Moon, BookOpen, Info } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

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

// Ambient particles - tiny golden particles slowly rising (like stars)
function AmbientParticles() {
  const particleCount = 80
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(particleCount)].map((_, i) => {
        const startX = Math.random() * 100 // Random horizontal position
        const duration = 15 + Math.random() * 10 // 15-25 seconds
        const delay = Math.random() * 5 // Random delay
        const size = 2 + Math.random() * 4 // 2-6px
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
              opacity: [0, 0.8, 1, 0.9, 0.7, 0],
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


export default function HomePage() {
  const [redeemCode, setRedeemCode] = useState('')
  const [isCodeValid, setIsCodeValid] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim()
    setRedeemCode(code)
    setCodeError('')
    // 基本格式验证：至少6个字符
    setIsCodeValid(code.length >= 6)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!redeemCode || redeemCode.length < 6) {
      setCodeError('请输入有效的兑换码')
      return
    }

    setIsVerifying(true)
    setCodeError('')

    try {
      // 格式化兑换码（去除空格，转为大写）
      const formattedCode = redeemCode.trim().toUpperCase().replace(/\s+/g, '')
      
      // 验证格式：XXXX-XXXX-XXXX 或 XXXXXXXXXXXX
      if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedCode) && 
          !/^[A-Z0-9]{12}$/.test(formattedCode)) {
        setCodeError('兑换码格式不正确')
        setIsCodeValid(false)
        setIsVerifying(false)
        return
      }

      // 如果是12位无分隔符，转换为带分隔符格式
      const normalizedCode = formattedCode.length === 12
        ? `${formattedCode.slice(0, 4)}-${formattedCode.slice(4, 8)}-${formattedCode.slice(8, 12)}`
        : formattedCode

      // 直接调用 API 进行验证和标记（确保原子性操作）
      // 使用 Supabase 函数 verify_redeem_code 会自动检查、验证并标记为已使用
      const verifyResponse = await fetch('/api/redeem/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: normalizedCode }),
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.valid) {
        // 验证成功，保存到 sessionStorage 并跳转
        sessionStorage.setItem('redeemCode', normalizedCode)
        sessionStorage.setItem('redeemCodeValidated', 'true')
        window.location.href = '/ask'
      } else {
        // 验证失败，显示错误信息
        setCodeError(verifyData.error || '兑换码验证失败')
        setIsCodeValid(false)
      }
    } catch (error) {
      console.error('Redeem code verification error:', error)
      setCodeError('验证失败，请稍后重试')
      setIsCodeValid(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 relative overflow-hidden pb-24 sm:pb-28 md:pb-32">
      {/* Background with parallax effect */}
      <ParallaxBackground />
      
      {/* Ambient particles - stars floating upward */}
      <AmbientParticles />
      
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

      <div className="max-w-5xl w-full text-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-12 relative z-10">
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 tracking-tight leading-[1.1] sm:leading-tight">
              <motion.span
                className="block relative"
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
                关帝灵签
              </motion.span>
              <motion.span
                className="block relative mt-1 sm:mt-2"
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
                东方智慧
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
            className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed sm:leading-relaxed font-light px-4 sm:px-6"
          >
            <span className="text-white/90">对话千年智慧，</span>
            <br className="hidden sm:block" />
            <span className="text-mystic-purple-glow font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">在喧嚣中寻回你的"内心秩序"。</span>
          </motion.p>
        </motion.div>
        
        {/* Redeem Code Input & CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-2 sm:pt-4 flex flex-col items-center w-full max-w-md mx-auto"
        >
          {/* Redeem Code Input */}
          <form onSubmit={handleSubmit} className="w-full mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="relative"
            >
              <input
                type="text"
                value={redeemCode}
                onChange={handleCodeChange}
                placeholder="请输入兑换码"
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white/10 backdrop-blur-md border-2 border-mystic-purple/40 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-mystic-purple-glow focus:ring-2 focus:ring-mystic-purple-glow/50 transition-all duration-300 text-sm sm:text-base md:text-lg min-h-[44px] sm:min-h-[48px]"
                style={{
                  boxShadow: isCodeValid 
                    ? '0 0 20px rgba(168, 85, 247, 0.3)' 
                    : '0 0 10px rgba(168, 85, 247, 0.1)',
                }}
              />
              {(codeError || isVerifying) && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 text-xs sm:text-sm text-center ${
                    isVerifying ? 'text-white/60' : 'text-red-400'
                  }`}
                >
                  {isVerifying ? '验证中...' : codeError}
                </motion.p>
              )}
            </motion.div>
          </form>

          {/* CTA Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={isVerifying || !isCodeValid}
            className={`group relative z-10 px-6 sm:px-8 md:px-10 lg:px-12 py-3.5 sm:py-4 md:py-5 lg:py-6 rounded-full text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl shadow-lg transition-all duration-300 overflow-hidden min-h-[44px] sm:min-h-[48px] w-full ${
              isVerifying || !isCodeValid
                ? 'bg-white/10 border-2 border-white/20 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet'
            }`}
            whileHover={!isVerifying && isCodeValid ? {
              scale: 1.05,
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
            } : {}}
            whileTap={!isVerifying && isCodeValid ? { scale: 0.95 } : {}}
          >
            {!isVerifying && isCodeValid && (
              <>
                {/* Base gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-mystic-purple via-mystic-indigo to-mystic-violet" />
                
                {/* Horizontal sweep light effect - Left to right */}
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
                      x: ['-200%', '100%'],
                    }}
                    transition={{
                      duration: 2,
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
                      x: ['-200%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      repeatType: 'loop',
                      delay: 0.1,
                    }}
                  />
                </motion.div>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-mystic-purple-glow/30 blur-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
            
            {/* Text overlay */}
            <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              <span>{isVerifying ? '验证中...' : '开启对话'}</span>
              {!isVerifying && isCodeValid && (
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </motion.button>
          
          {/* Subtitle text below button */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm text-white/70 text-center px-4"
          >
            请集中精力，心中默念你的问题。
          </motion.p>
        </motion.div>

        {/* Feature cards with staggered animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-8 sm:pt-10 md:pt-12 lg:pt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-4xl mx-auto px-4 sm:px-6"
        >
          {[
            {
              icon: BookOpen,
              title: '典籍底蕴',
              description: '深耕古籍智慧，传承东方美学，让每一次翻开都有深度',
              delay: 0.1,
            },
            {
              icon: Sparkles,
              title: 'AI 解读',
              description: '结合您的问题与人生境遇，提供个性化的深度解读',
              delay: 0.2,
            },
            {
              icon: Moon,
              title: '决策复盘',
              description: '不定义未来，只为你提供多维度的思考方向与行动建议',
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
                className="group relative p-4 sm:p-5 md:p-6 lg:p-8 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-mystic-purple/30 hover:border-mystic-purple-glow/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden xuan-paper-texture"
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mystic-purple-glow/20 group-hover:border-mystic-purple-glow/60 transition-colors"></div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/10 via-mystic-violet/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  {/* Icon on left, Title centered */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 relative">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-mystic-purple/20 to-mystic-indigo/20 flex items-center justify-center group-hover:from-mystic-purple-glow/30 group-hover:to-mystic-violet/30 transition-all duration-300 relative flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-mystic-purple-glow/20 blur-md group-hover:bg-mystic-purple-glow/40 transition-all"></div>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-purple-glow relative z-10" />
                    </motion.div>
                    <h3 
                      className="text-base sm:text-lg md:text-xl font-semibold flex-1 text-center whitespace-nowrap"
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
                    {/* Invisible spacer to balance the icon on the left */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed sm:leading-relaxed text-center">
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
          className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 space-y-4 sm:space-y-5"
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
            传统 • 现代 • 个人
          </motion.p>
          
          {/* Disclaimer for compliance - Enhanced visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-2xl mx-auto px-4 sm:px-6"
          >
            <div className="text-center text-xs sm:text-sm text-white/80 bg-white/15 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border-2 border-mystic-purple-glow/40 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-mystic-purple-glow flex-shrink-0" />
                <p className="font-semibold text-white/90 text-xs sm:text-sm md:text-base">
                  温馨提示
                </p>
              </div>
              <p className="leading-relaxed text-xs sm:text-sm">
                本应用致力于传承东方传统文化，签文解读仅供参考与思考，<strong className="text-white">不构成任何专业建议</strong>。
                <span className="text-white/70"> AI生成的建议不具备专业指导意义，请保持科学理性的生活态度，<strong className="text-white">美好生活由您的双手创造</strong>。</span>
              </p>
            </div>
          </motion.div>
          
          {/* Privacy & Legal Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs text-white/60 mt-4 sm:mt-5"
          >
            <Link href="/privacy" className="hover:text-mystic-purple-glow transition-colors underline py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              隐私政策
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/terms" className="hover:text-mystic-purple-glow transition-colors underline py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              服务条款
            </Link>
            <span className="text-white/40">•</span>
            <Link href="/disclaimer" className="hover:text-mystic-purple-glow transition-colors underline py-1 px-2 -mx-2 min-h-[32px] flex items-center">
              免责声明
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
