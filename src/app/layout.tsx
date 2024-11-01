// src/app/layout.tsx
import { Inter } from 'next/font/google'
import TopNav from '../components/layout/Navigation/TopNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />          {/* This will appear on EVERY page */}
        <div className="pt-24"> 
          {children}        {/* This is where your page content gets injected */}
        </div>
      </body>
    </html>
  )
}