'use client'

import { FormStatus } from '@/types/form'
import { motion } from 'framer-motion'

interface SubmitButtonProps {
  status: FormStatus
  idleText?: string
  submittingText?: string
  successText?: string
  errorText?: string
  className?: string
  onClick?: () => void
}

export default function SubmitButton({
  status,
  idleText = '送出表單',
  submittingText = '提交中...',
  successText = '提交成功',
  errorText = '請重試',
  className = '',
  onClick
}: SubmitButtonProps) {
  // 根據狀態確定按鈕文字
  const buttonText = () => {
    switch (status) {
      case FormStatus.SUBMITTING:
        return submittingText
      case FormStatus.SUCCESS:
        return successText
      case FormStatus.ERROR:
        return errorText
      default:
        return idleText
    }
  }

  // 根據狀態確定按鈕樣式
  const buttonStyle = () => {
    switch (status) {
      case FormStatus.SUBMITTING:
        return 'bg-primary/70 cursor-not-allowed'
      case FormStatus.SUCCESS:
        return 'bg-green-600 hover:bg-green-700'
      case FormStatus.ERROR:
        return 'bg-red-600 hover:bg-red-700'
      default:
        return 'bg-primary hover:bg-primary/90'
    }
  }

  return (
    <motion.button
      type="submit"
      className={`w-full text-white py-3 font-semibold transition-colors ${buttonStyle()} ${className}`}
      disabled={status === FormStatus.SUBMITTING}
      onClick={onClick}
      whileTap={{ scale: status !== FormStatus.SUBMITTING ? 0.98 : 1 }}
    >
      {status === FormStatus.SUBMITTING && (
        <span className="inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {buttonText()}
    </motion.button>
  )
} 