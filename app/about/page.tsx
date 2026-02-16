import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 tracking-wide">
          ABOUT
        </h1>
        
        <div className="bg-white p-6 sm:p-8 border border-gray-200">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              오사카에서 생활하면서 방문한 라멘 가게들을 기록하는 개인 블로그입니다.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">블로그 목적</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• 방문한 라멘 가게 기록</li>
              <li>• 맛과 분위기에 대한 솔직한 후기</li>
              <li>• 개인적인 라멘 맛집 데이터베이스 구축</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">평가 기준</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• 국물의 깊이와 풍미</li>
              <li>• 면의 식감과 조리도</li>
              <li>• 토핑의 품질</li>
              <li>• 전체적인 균형과 완성도</li>
              <li>• 가성비</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-gray-700">
              GitHub: <a href="https://github.com/hellowin6076" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                @hellowin6076
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
