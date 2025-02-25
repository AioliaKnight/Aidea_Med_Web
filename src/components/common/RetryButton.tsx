'use client'

interface RetryButtonProps {
  onRetry: () => void
}

export default function RetryButton({ onRetry }: RetryButtonProps) {
  return (
    <button
      onClick={onRetry}
      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      重試
    </button>
  )
} 