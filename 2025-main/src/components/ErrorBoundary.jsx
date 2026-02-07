//

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

// to log results (for example: reportWebVitals(console.log))

class ErrorBoundary extends React.Component {
  // ErrorBoundary component to catch JavaScript errors in child components
  // and display a fallback UI instead of crashing the whole app.
  constructor(props) {
    // Initialize state to track if an error has occurred

    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };

  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Update state with the error and errorInfo for rendering in the fallback UI
    this.setState({ error, errorInfo });

  }

  render() {
    // If an error has occurred, render the fallback UI
    // Otherwise, render the child components as normal
    // If an error has occurred, render the fallback UI

    if (this.state.hasError) {
      // Display a user-friendly error message and the error details
      // along with a button to refresh the page.
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">

            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-red-600">Ứng dụng gặp sự cố</h2>
            </div>
            <p className="text-lg text-gray-800 mb-4">
              Chúng tôi xin lỗi, nhưng ứng dụng đã gặp một lỗi không mong muốn.
            </p>
            <p className="text-gray-700 mb-4">
              Vui lòng thử làm mới trang hoặc liên hệ với bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>
            <p className="text-gray-700 mb-4">
              Đã xảy ra lỗi không mong muốn. Vui lòng thử làm mới trang.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-auto max-h-48">
              <pre className="text-sm text-gray-800">

                { this.state.error && this.state.error.toString() }
                <br />
                { this.state.errorInfo && this.state.errorInfo.componentStack }

              </pre>
            </div>
            <button
              type="button"
              // Button to refresh the page

              onClick={ () => window.location.reload() }

              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              <RefreshCcw className="inline-block mr-2" />

              Làm mới trang

            </button>
            <p className="text-gray-700 mb-4">
              Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với bộ phận hỗ trợ.
            </p>
            <p className="text-gray-500 text-xs">
              Mã lỗi: { this.state.error ? this.state.error.toString() : 'Không có thông tin lỗi' }
            </p>
          </div>
        </div>
      );
    }
    // If no error has occurred, render the children components
    // This allows the application to continue functioning normally


    return this.props.children;

  }
}


export default ErrorBoundary;
