// src/app/layout.tsx
import { Inter } from 'next/font/google'
import TopNav from '../components/layout/Navigation/TopNav'
import Footer from '../components/layout/Footer/Footer'
import { NextAuthProvider } from './providers'
import { Toaster } from 'react-hot-toast'
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
        <NextAuthProvider>
          <div className="min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
              <TopNav />
            </div>
            <main className="pt-[72px] flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  )
}