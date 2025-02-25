'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              很抱歉，發生了一些錯誤
            </h1>
            <p className="text-gray-600 mb-8">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full"
            >
              重新整理
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 