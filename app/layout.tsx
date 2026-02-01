import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Noto_Serif_SC } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const notoSerifSC = Noto_Serif_SC({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif-sc',
  display: 'swap',
})
const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '东方神签 - 传统中国占卜（仅供娱乐）',
  description: '体验古老的中国占卜艺术，用于娱乐和文化反思。仅供娱乐，非专业建议。',
  keywords: ['中国占卜', '神签', '娱乐', '文化体验', '反思'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${notoSerifSC.variable} ${playfairDisplay.variable} zen-container`}>
        {children}
        <footer className="w-full py-8 text-center relative z-10">
          <p 
            className="text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              letterSpacing: '0.3em',
            }}
          >
            BANXIA LAB
          </p>
        </footer>
      </body>
    </html>
  )
}
