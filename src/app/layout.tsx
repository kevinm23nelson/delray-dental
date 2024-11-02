// src/app/layout.tsx
import { Inter } from 'next/font/google'
import TopNav from '../components/layout/Navigation/TopNav'
import Footer from '../components/layout/Footer/Footer'
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
        <div className="min-h-screen flex flex-col">
          <div className="fixed top-0 left-0 right-0 z-50">
            <TopNav />
          </div>
          <div className="pt-[72px] flex-grow"> {/* flex-grow ensures content takes available space */}
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}