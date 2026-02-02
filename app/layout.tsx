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
  title: '东方文化体验',
  description: '对话千年智慧，在喧嚣中寻回你的内心秩序。基于传统文化的心理疏导与自我反思工具，仅供娱乐，请相信科学。',
  keywords: ['关帝灵签', '传统文化', '心理疏导', '自我反思', '智慧对话', '文化体验'],
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
