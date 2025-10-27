// Session Service for managing user sessions
class SessionService {
  constructor() {
    this.sessionId = null;
    this.sessionData = {};
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startSession() {
    this.sessionId = this.generateSessionId();
    this.sessionData = {
      id: this.sessionId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem("sessionId", this.sessionId);
    localStorage.setItem("sessionData", JSON.stringify(this.sessionData));

    return this.sessionId;
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem("sessionId") || this.startSession();
    }
    return this.sessionId;
  }

  getSessionData() {
    const stored = localStorage.getItem("sessionData");
    return stored ? JSON.parse(stored) : this.sessionData;
  }

  updateActivity() {
    this.sessionData.lastActivity = new Date().toISOString();
    localStorage.setItem("sessionData", JSON.stringify(this.sessionData));
  }

  endSession() {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionData");
    this.sessionId = null;
    this.sessionData = {};
  }

  isSessionActive() {
    return !!this.sessionId || !!localStorage.getItem("sessionId");
  }

  // Create a new session with user data
  createSession(user) {
    const sessionId = this.startSession();
    const sessionData = {
      id: sessionId,
      userId: user.id,
      email: user.email,
      role: user.role,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
    this.sessionData = sessionData;

    return { id: sessionId, ...sessionData };
  }

  // Get session from localStorage
  getSession() {
    const sessionData = localStorage.getItem("sessionData");
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData);
    } catch (error) {
      console.error("Error parsing session data:", error);
      return null;
    }
  }

  // Check if session is valid
  isValidSession(session) {
    if (!session) return false;

    // Check if session has required fields
    if (!session.id || !session.userId) return false;

    // Check if session is not expired (optional - 24 hours)
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const timeDiff = now - lastActivity;

    return timeDiff < sessionTimeout;
  }

  // Clear session
  clearSession() {
    this.endSession();
  }

  // Update session with new user data
  updateSession(userData) {
    const session = this.getSession();
    if (session) {
      const updatedSession = { ...session, ...userData };
      localStorage.setItem("sessionData", JSON.stringify(updatedSession));
      this.sessionData = updatedSession;
      return updatedSession;
    }
    return null;
  }
}

export const sessionService = new SessionService();
