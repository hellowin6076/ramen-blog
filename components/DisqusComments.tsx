'use client'

import { useEffect } from 'react'

interface DisqusCommentsProps {
  identifier: string
  title: string
  url: string
}

export default function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

  useEffect(() => {
    if (!shortname) return

    // Disqus 스크립트가 이미 로드되었는지 확인
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier
          this.page.url = url
          this.page.title = title
        },
      })
    } else {
      // Disqus 설정
      window.disqus_config = function () {
        this.page.url = url
        this.page.identifier = identifier
        this.page.title = title
      }

      // Disqus 스크립트 로드
      const script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.setAttribute('data-timestamp', String(+new Date()))
      ;(document.head || document.body).appendChild(script)
    }
  }, [identifier, title, url, shortname])

  if (!shortname) {
    return null
  }

  return (
    <div className="mt-12">
      <div id="disqus_thread"></div>
    </div>
  )
}

// Disqus 타입 정의
declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: () => void }) => void
    }
    disqus_config?: () => void
  }
}
