import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-wide hover:text-gray-700 transition">
          LogRamen
        </Link>
        <div className="flex gap-6 sm:gap-8 text-sm sm:text-base">
          <Link href="/blog" className="hover:text-gray-600 transition font-medium">
            All Posts
          </Link>
          <Link href="/about" className="hover:text-gray-600 transition font-medium">
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
