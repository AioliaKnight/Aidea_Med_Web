import Link from 'next/link'
import { generatePaginationRange } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  createUrl: (page: number) => string
  maxVisible?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  createUrl,
  maxVisible = 5,
}: PaginationProps) {
  const pages = generatePaginationRange(currentPage, totalPages, maxVisible)

  if (totalPages <= 1) return null

  return (
    <nav className="flex justify-center gap-2 mt-12" aria-label="分頁導航">
      {/* 上一頁 */}
      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="前往上一頁"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      )}

      {/* 第一頁 */}
      {!pages.includes(1) && (
        <>
          <Link
            href={createUrl(1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
          >
            1
          </Link>
          <span className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        </>
      )}

      {/* 頁碼 */}
      {pages.map((page) => (
        <Link
          key={page}
          href={createUrl(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            currentPage === page
              ? 'bg-brand-red text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* 最後一頁 */}
      {!pages.includes(totalPages) && (
        <>
          <span className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
          <Link
            href={createUrl(totalPages)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* 下一頁 */}
      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="前往下一頁"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </nav>
  )
} 