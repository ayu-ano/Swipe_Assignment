import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'


// Error handler for uncaught errors
const handleGlobalError = (error, errorInfo) => {
  console.error('Global error caught:', error, errorInfo)
  // You can send to error reporting service (Sentry, etc.)
}

// Render function
const root = createRoot(document.getElementById('root'))

try {
  root.render(
    <StrictMode>
      <ErrorBoundary onError={handleGlobalError}>
        <Provider store={store}>
          <PersistGate 
            loading={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size={48} text="Loading your data..." />
              </div>
            } 
            persistor={persistor}
          >
            <App />
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  // Fallback render for critical errors
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p className="text-gray-600">Failed to load the application. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}