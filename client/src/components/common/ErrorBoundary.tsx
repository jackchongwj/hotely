import React from 'react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; message: string; }

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. Refreshing the page usually fixes this.
            </p>
            {this.state.message && (
              <code className="block text-xs bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400 rounded p-2 text-left break-all">
                {this.state.message}
              </code>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
