import { Inter } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next E-commerce',
  description: 'Next E-commerce'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={clsx(inter.className, 'bg-slate-700')}>
        <Navbar />
        <main className="h-screen p-16">{children}</main>
      </body>
    </html>
  )
}
