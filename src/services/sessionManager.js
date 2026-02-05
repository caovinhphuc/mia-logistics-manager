/**
 * Session Management Service
 * Quản lý phiên đăng nhập thông minh với timeout và extension
 */

const SESSION_KEY = 'mia_session';
const SESSION_WARNING_KEY = 'mia_session_warning';
const LAST_ACTIVITY_KEY = 'mia_last_activity';

class SessionManager {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.warningTimeout = 5 * 60 * 1000; // 5 minutes before timeout
    this.checkInterval = 60 * 1000; // Check every minute
    this.extensionThreshold = 10 * 60 * 1000; // 10 minutes before timeout
    this.listeners = [];
    this.checkTimer = null;
  }

  /**
   * Initialize session
   * @param {Object} user - User data
   * @param {string} token - Auth token
   */
  initializeSession(user, token) {
    const sessionData = {
      user,
      token,
      startTime: Date.now(),
      lastActivity: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    this.startMonitoring();
    this.notifyListeners('session_initialized', sessionData);
  }

  /**
   * Get current session
   * @returns {Object|null} Session data or null
   */
  getCurrentSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      const now = Date.now();
      const elapsed = now - session.startTime;

      // Check if session expired
      if (elapsed > this.sessionTimeout) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Check if session is valid
   * @returns {boolean}
   */
  isSessionValid() {
    const session = this.getCurrentSession();
    return session !== null;
  }

  /**
   * Update last activity time
   */
  updateActivity() {
    const session = this.getCurrentSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      this.notifyListeners('activity_updated', session);
    }
  }

  /**
   * Get remaining session time in milliseconds
   * @returns {number}
   */
  getRemainingTime() {
    const session = this.getCurrentSession();
    if (!session) return 0;

    const now = Date.now();
    const elapsed = now - session.startTime;
    return Math.max(0, this.sessionTimeout - elapsed);
  }

  /**
   * Get remaining time until warning (in milliseconds)
   * @returns {number}
   */
  getWarningTime() {
    const remaining = this.getRemainingTime();
    return Math.max(0, remaining - this.warningTimeout);
  }

  /**
   * Check if should show warning
   * @returns {boolean}
   */
  shouldShowWarning() {
    const session = this.getCurrentSession();
    if (!session) return false;

    const remaining = this.getRemainingTime();
    return remaining > 0 && remaining <= this.warningTimeout;
  }

  /**
   * Check if can extend session
   * @returns {boolean}
   */
  canExtendSession() {
    const session = this.getCurrentSession();
    if (!session) return false;

    const remaining = this.getRemainingTime();
    return remaining > 0 && remaining <= this.extensionThreshold;
  }

  /**
   * Extend session (Smart Extension)
   * @param {number} _extensionTime - Time to extend in milliseconds (default: sessionTimeout)
   */
  extendSession(_extensionTime = null) {
    const session = this.getCurrentSession();
    if (!session) return false;

    if (!this.canExtendSession()) {
      return false;
    }

    session.startTime = Date.now(); // Reset start time
    session.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    this.notifyListeners('session_extended', session);
    return true;
  }

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_WARNING_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    this.stopMonitoring();
    this.notifyListeners('session_cleared', null);
  }

  /**
   * Store redirect path
   * @param {string} path - Path to redirect to
   */
  storeRedirectPath(path) {
    if (path && path !== '/login') {
      sessionStorage.setItem('redirect_after_login', path);
    }
  }

  /**
   * Get and clear redirect path
   * @returns {string|null} Redirect path or null
   */
  getRedirectPath() {
    const path = sessionStorage.getItem('redirect_after_login');
    if (path) {
      sessionStorage.removeItem('redirect_after_login');
    }
    return path;
  }

  /**
   * Start monitoring session
   */
  startMonitoring() {
    this.stopMonitoring(); // Clear any existing timer

    this.checkTimer = setInterval(() => {
      const session = this.getCurrentSession();

      if (!session) {
        this.notifyListeners('session_expired', null);
        return;
      }

      const remaining = this.getRemainingTime();

      // Check if should show warning
      if (this.shouldShowWarning() && !localStorage.getItem(SESSION_WARNING_KEY)) {
        localStorage.setItem(SESSION_WARNING_KEY, 'true');
        this.notifyListeners('show_warning', { remaining });
      }

      // Notify about remaining time
      this.notifyListeners('session_tick', { remaining });

      // Check if session expired
      if (remaining <= 0) {
        this.clearSession();
        this.notifyListeners('session_expired', null);
      }
    }, this.checkInterval);
  }

  /**
   * Stop monitoring session
   */
  stopMonitoring() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Subscribe to session events
   * @param {Function} callback - Callback function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in session listener:', error);
      }
    });
  }

  /**
   * Configure timeouts
   * @param {Object} config - Configuration object
   */
  configure(config) {
    if (config.sessionTimeout) {
      this.sessionTimeout = config.sessionTimeout;
    }
    if (config.warningTimeout) {
      this.warningTimeout = config.warningTimeout;
    }
    if (config.checkInterval) {
      this.checkInterval = config.checkInterval;
    }
    if (config.extensionThreshold) {
      this.extensionThreshold = config.extensionThreshold;
    }
  }

  /**
   * Get session statistics
   * @returns {Object} Session stats
   */
  getStats() {
    const session = this.getCurrentSession();
    if (!session) {
      return null;
    }

    const now = Date.now();
    const elapsed = now - session.startTime;
    const lastActivity = session.lastActivity;
    const inactiveTime = now - lastActivity;

    return {
      elapsed,
      remaining: this.getRemainingTime(),
      lastActivity,
      inactiveTime,
      canExtend: this.canExtendSession(),
      shouldWarn: this.shouldShowWarning(),
    };
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;
