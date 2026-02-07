// Simple error tracking module
export const errorTrackingEnabled = true; // Toggle for enabling/disabling error tracking
export const errorTrackingVersion = "1.0.0"; // Version of the error tracking module

// Initialize error tracking
export const setupErrorTracking = () => {
  console.log("Setting up error tracking...");

  // Add global error handler
  window.addEventListener("error", (event) => {
    logError({
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  // Add unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    logError({
      message: "Unhandled Promise Rejection",
      error: event.reason,
    });
  });

  console.log("Error tracking initialized");
  return true;
};

// Log an error
// Interface for error data
interface ErrorData {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
}

export const logError = (errorData: ErrorData): boolean => {
  console.error("Application Error:", errorData);

  // In a production app, you would send this to your error tracking service
  sendToErrorTrackingService(errorData);

  return true;
};

// Function to send errors to a tracking service (placeholder)
export const sendToErrorTrackingService = (errorData: ErrorData): void => {
  // In a real implementation, this would send data to a service like Sentry, LogRocket, etc.
  console.log("Sending to error tracking service:", errorData);
};
