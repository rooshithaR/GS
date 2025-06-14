import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Garden Management System',
  description: 'Smart garden management with weather-based watering recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
