import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Custom notification interface
interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Global UI State
interface UIState {
  sidebarOpen: boolean;
  loading: boolean;
  notifications: AppNotification[];
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: AppNotification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        loading: false,
        notifications: [],
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setLoading: (loading) => set({ loading }),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [...state.notifications, notification],
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
      }
    )
  )
);

// User Settings State
interface SettingsState {
  language: string;
  currency: string;
  timezone: string;
  updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        language: 'vi',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        updateSettings: (settings) =>
          set((state) => ({ ...state, ...settings })),
      }),
      {
        name: 'settings-store',
      }
    )
  )
);