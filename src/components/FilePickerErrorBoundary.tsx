import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePickerErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface FilePickerErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

/**
 * Error boundary specifically designed for FilePicker components
 * Provides graceful error handling and recovery options
 */
export class FilePickerErrorBoundary extends React.Component<
  FilePickerErrorBoundaryProps,
  FilePickerErrorBoundaryState
> {
  constructor(props: FilePickerErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FilePickerErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[FilePickerErrorBoundary] Error caught:', error);
    console.error('[FilePickerErrorBoundary] Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error('FilePicker crashed with error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="w-[500px] h-[400px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">File Picker Error</span>
            </div>
          </div>

          {/* Error Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive/60" />
            
            <div className="text-center space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Something went wrong with the file picker
              </h3>
              <p className="text-xs text-muted-foreground max-w-[400px]">
                {this.state.error.message || 'An unexpected error occurred while browsing files.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={this.handleRetry}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-xs text-muted-foreground mt-4">
                <summary className="cursor-pointer">Debug Info</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-2">
            <p className="text-xs text-muted-foreground text-center">
              If this problem persists, try restarting the application
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Custom hook for handling FilePicker errors in functional components
 */
export function useFilePickerErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('[FilePicker] Handled error:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    hasError: error !== null,
    handleError,
    clearError,
  };
}