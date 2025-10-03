import React from 'react';
import { useDispatch } from 'react-redux';
import { setGlobalError, clearGlobalError } from '../../store/slices/uiSlice';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Dispatch to Redux store
    if (this.props.dispatch) {
      this.props.dispatch(setGlobalError({
        message: error.message,
        stack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset error boundary when route changes
    if (prevProps.location !== this.props.location && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null });
      if (this.props.dispatch) {
        this.props.dispatch(clearGlobalError());
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.dispatch) {
      this.props.dispatch(clearGlobalError());
    }
    this.props.onRetry?.();
  };

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                <summary className="cursor-pointer font-medium text-red-800 dark:text-red-300">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-sm text-red-700 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Reload Page
              </button>
            </div>

            {/* Support Contact */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              If the problem persists, contact{' '}
              <a href="mailto:support@crispinterview.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                support@crispinterview.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary context
export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    dispatch(setGlobalError({
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    }));
  };

  return { handleError };
};

// HOC for functional components
export const withErrorBoundary = (Component, fallbackMessage) => {
  return (props) => (
    <ErrorBoundary fallbackMessage={fallbackMessage}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;