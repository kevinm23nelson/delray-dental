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
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#059669',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </NextAuthProvider>
      </body>
    </html>
  )
}