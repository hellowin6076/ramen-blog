import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ramen Blog - 오사카 라멘 기록',
  description: '오사카에서 먹은 라멘들을 기록하는 블로그',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
