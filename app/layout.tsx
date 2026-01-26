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
  title: 'Oriental Oracle - Traditional Chinese Divination (Entertainment Only)',
  description: 'Experience the ancient art of Chinese divination for entertainment and cultural reflection. For entertainment purposes only - not professional advice.',
  keywords: ['chinese divination', 'chinese oracle', 'entertainment', 'cultural experience', 'reflection'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
