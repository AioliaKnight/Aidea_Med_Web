'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary 組件 - 用於捕獲子組件樹中的 JavaScript 錯誤
 * 符合 React 19+ 標準的錯誤處理機制
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新狀態，下一次渲染將顯示備用 UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 記錄錯誤信息
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // 如果提供了onError回調，則呼叫它
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定義的fallback，則使用它
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      // 預設的錯誤UI
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-100 m-4">
          <div className="text-red-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">內容載入發生錯誤</h2>
          <p className="text-gray-600 text-sm mb-4">很抱歉，顯示此內容時發生了問題</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            重新嘗試
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 