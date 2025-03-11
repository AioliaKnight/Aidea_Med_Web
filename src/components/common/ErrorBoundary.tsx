'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // 可在此處添加錯誤報告機制
  }

  render() {
    if (this.state.hasError) {
      // 自定義回退 UI
      return this.props.fallback || (
        <div className="p-6 bg-red-50 rounded-lg border border-red-100">
          <h2 className="text-xl font-semibold text-red-700 mb-2">發生錯誤</h2>
          <p className="text-red-600 mb-4">很抱歉，載入此內容時發生問題。</p>
          {this.state.error && (
            <details className="bg-white p-4 rounded border border-red-100 mt-4">
              <summary className="cursor-pointer text-red-700 font-medium">錯誤詳情</summary>
              <pre className="mt-2 text-sm text-gray-700 overflow-auto p-2 bg-gray-50 rounded">
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-gray-600 overflow-auto p-2 bg-gray-50 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            重新載入頁面
          </button>
        </div>
      )
    }

    return this.props.children
  }
} 