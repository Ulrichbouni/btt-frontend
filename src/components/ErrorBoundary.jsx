import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary global pour capturer les erreurs React
 * Affiche une UI de fallback au lieu d'un écran blanc
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log vers un service de monitoring (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // TODO: Envoyer vers Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Optionnel : recharger la page si erreurs répétées
    if (this.state.errorCount >= 3) {
      window.location.href = '/';
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Oups ! Une erreur est survenue
                </h1>
                <p className="text-gray-600 mt-1">
                  Nous sommes désolés pour ce désagrément.
                </p>
              </div>
            </div>

            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-mono text-sm text-red-800 mb-2">
                  <strong>Erreur :</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 font-medium">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-700 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Réessayer
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Retour à l'accueil
              </button>
            </div>

            {this.state.errorCount >= 2 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Si le problème persiste, veuillez contacter le support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
