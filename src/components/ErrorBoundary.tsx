import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught runtime error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg text-stone-900">
            <div className="flex items-center space-x-3 text-amber-700 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold font-serif">Something went wrong</h2>
            </div>
            <p className="text-sm text-stone-600 mb-4">
              An unexpected error prevented this view from rendering.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-stone-100 rounded-lg text-xs text-stone-800 overflow-x-auto mb-5 font-mono">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
