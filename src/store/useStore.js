import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme state
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
      
      // Click spark settings
      sparkSettings: {
        size: 10,
        radius: 15,
        count: 8,
        duration: 400,
      },
      setSparkSettings: (settings) => set({ sparkSettings: { ...get().sparkSettings, ...settings } }),
      
      // User preferences
      preferences: {
        animations: true,
        soundEffects: false,
      },
      setPreferences: (prefs) => set({ preferences: { ...get().preferences, ...prefs } }),
    }),
    {
      name: 'app-storage', // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        sparkSettings: state.sparkSettings,
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedState = localStorage.getItem('app-storage');
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
      console.error('Failed to parse stored state:', e);
    }
  }
}

export default useStore;
