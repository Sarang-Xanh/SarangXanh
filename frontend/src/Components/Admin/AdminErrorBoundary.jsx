import React from "react";

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AdminErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-red-950 text-red-50 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Admin Page Error</h1>
            <p className="text-red-200">
              This error occurred inside the admin dashboard.
            </p>
            <div className="bg-red-900/60 border border-red-700 rounded-lg p-4">
              <div className="text-sm uppercase tracking-wide text-red-200">
                Error Message
              </div>
              <div className="mt-2 text-lg">
                {error?.message || "Unknown error"}
              </div>
            </div>
            <div className="bg-black/40 border border-red-700 rounded-lg p-4">
              <div className="text-sm uppercase tracking-wide text-red-200">
                Component Stack
              </div>
              <pre className="mt-2 text-xs text-red-100 whitespace-pre-wrap">
                {errorInfo?.componentStack || "No component stack available."}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
