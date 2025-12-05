import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * UI Store
 * Manages theme, UI preferences, and visual settings
 */
const useUIStore = create(
  persist(
    (set, get) => ({
      // ================== THEME STATE ==================
      theme: 'dark',
      
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
      
      // Get current active theme (resolves 'system' to actual theme)
      getActiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
      
      // ================== CLICK SPARK SETTINGS ==================
      sparkSettings: {
        size: 10,
        radius: 15,
        count: 8,
        duration: 400,
      },
      
      setSparkSettings: (settings) => {
        set({ sparkSettings: { ...get().sparkSettings, ...settings } });
      },
      
      // ================== USER PREFERENCES ==================
      preferences: {
        animations: true,
        soundEffects: false,
      },
      
      setPreferences: (prefs) => {
        set({ preferences: { ...get().preferences, ...prefs } });
      },

      // ================== AUTH MODAL STATE ==================
      showAuthModal: false,
      authModalMode: 'sign-in', // 'sign-in' | 'sign-up'
      redirectAfterAuth: null,
      
      openAuthModal: (mode = 'sign-in', redirectTo = null) => {
        set({ 
          showAuthModal: true, 
          authModalMode: mode,
          redirectAfterAuth: redirectTo
        });
      },
      
      closeAuthModal: () => {
        set({ 
          showAuthModal: false,
          redirectAfterAuth: null
        });
      },
      
      toggleAuthMode: () => {
        set((state) => ({
          authModalMode: state.authModalMode === 'sign-in' ? 'sign-up' : 'sign-in'
        }));
      },

      // ================== SIDEBAR STATE ==================
      sidebarOpen: false,
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // ================== NOTIFICATION SETTINGS ==================
      notificationsEnabled: true,
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sparkSettings: state.sparkSettings,
        preferences: state.preferences,
        notificationsEnabled: state.notificationsEnabled,
        // Modal state and sidebar are NOT persisted
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedState = localStorage.getItem('ui-storage');
  if (storedState) {
    try {
      const { state } = JSON.parse(storedState);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (state.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(state.theme || 'dark');
      }
    } catch (e) {
      console.error('Failed to parse UI storage:', e);
    }
  }
}

export default useUIStore;
