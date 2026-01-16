import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Notification state structure
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    enableSound: true,
    enableDesktop: true,
    enableEmail: false,
    autoMarkRead: true,
    showTime: 5000,
  },
  loading: false,
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  TRANSPORT: 'transport',
  WAREHOUSE: 'warehouse',
  SYSTEM: 'system',
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Notification actions
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_READ: 'MARK_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  LOAD_NOTIFICATIONS: 'LOAD_NOTIFICATIONS',
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...action.payload,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case NOTIFICATION_ACTIONS.MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const removedNotification = state.notifications.find((n) => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
        unreadCount:
          removedNotification && !removedNotification.isRead
            ? state.unreadCount - 1
            : state.unreadCount,
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
        loading: false,
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications();
    loadSettings();
    requestNotificationPermission();
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (state.notifications.length > 0) {
      localStorage.setItem('mia-notifications', JSON.stringify(state.notifications));
    }
  }, [state.notifications]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mia-notification-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('mia-notifications');
      if (saved) {
        const notifications = JSON.parse(saved);
        // Only keep notifications from last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentNotifications = notifications.filter(
          (n) => new Date(n.timestamp) > thirtyDaysAgo
        );
        dispatch({
          type: NOTIFICATION_ACTIONS.LOAD_NOTIFICATIONS,
          payload: recentNotifications,
        });
      }
    } catch (error) {
      console.warn('Failed to load notifications:', error);
    }
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('mia-notification-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        dispatch({
          type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
          payload: settings,
        });
      }
    } catch (error) {
      console.warn('Failed to load notification settings:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const addNotification = (notification) => {
    const {
      type = NOTIFICATION_TYPES.INFO,
      priority = NOTIFICATION_PRIORITIES.NORMAL,
      title,
      message,
      actions = [],
      autoHide = true,
      data = {},
    } = notification;

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: {
        type,
        priority,
        title,
        message,
        actions,
        autoHide,
        data,
      },
    });

    // Show toast notification
    showToast(type, message, title);

    // Show desktop notification if enabled
    if (state.settings.enableDesktop) {
      showDesktopNotification(title, message, type);
    }

    // Play sound if enabled
    if (state.settings.enableSound) {
      playNotificationSound(type, priority);
    }
  };

  const showToast = (type, message, title) => {
    const options = {
      duration: state.settings.showTime,
    };

    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(title || message, options);
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(title || message, options);
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(title || message, { ...options, icon: '⚠️' });
        break;
      default:
        toast(title || message, options);
    }
  };

  const showDesktopNotification = (title, message, type) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: message,
        icon: getNotificationIcon(type),
        badge: '/favicon.ico',
        tag: 'mia-logistics',
        requireInteraction: type === NOTIFICATION_TYPES.ERROR,
      };

      new Notification(title, options);
    }
  };

  const playNotificationSound = (type, priority) => {
    try {
      const audio = new Audio();

      // Different sounds for different types/priorities
      if (priority === NOTIFICATION_PRIORITIES.URGENT) {
        audio.src = '/sounds/urgent.mp3';
      } else if (type === NOTIFICATION_TYPES.ERROR) {
        audio.src = '/sounds/error.mp3';
      } else if (type === NOTIFICATION_TYPES.SUCCESS) {
        audio.src = '/sounds/success.mp3';
      } else {
        audio.src = '/sounds/notification.mp3';
      }

      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore audio play errors (user hasn't interacted with page yet)
      });
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '/icons/success.png';
      case NOTIFICATION_TYPES.ERROR:
        return '/icons/error.png';
      case NOTIFICATION_TYPES.WARNING:
        return '/icons/warning.png';
      case NOTIFICATION_TYPES.TRANSPORT:
        return '/icons/transport.png';
      case NOTIFICATION_TYPES.WAREHOUSE:
        return '/icons/warehouse.png';
      default:
        return '/icons/info.png';
    }
  };

  const markAsRead = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_READ, payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_READ });
  };

  const removeNotification = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: notificationId,
    });
  };

  const clearAll = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  };

  const updateSettings = (newSettings) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS,
      payload: newSettings,
    });
  };

  // Convenience methods for different notification types
  const showSuccess = (message, title = 'Thành công') => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
    });
  };

  const showError = (message, title = 'Lỗi') => {
    addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      priority: NOTIFICATION_PRIORITIES.HIGH,
    });
  };

  const showWarning = (message, title = 'Cảnh báo') => {
    addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message,
    });
  };

  const showInfo = (message, title = 'Thông tin') => {
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message,
    });
  };

  const showTransportUpdate = (message, data = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.TRANSPORT,
      title: 'Cập nhật vận chuyển',
      message,
      data,
    });
  };

  const showWarehouseUpdate = (message, data = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.WAREHOUSE,
      title: 'Cập nhật kho',
      message,
      data,
    });
  };

  const contextValue = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateSettings,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTransportUpdate,
    showWarehouseUpdate,
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
