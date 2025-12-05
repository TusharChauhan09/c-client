import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Authentication Store
 * Manages user authentication state, subscription, and onboarding
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ================== USER STATE ==================
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Set user after Clerk authentication
      setUser: (userData) => {
        set({ 
          user: userData, 
          isAuthenticated: !!userData,
          isLoading: false 
        });
      },
      
      // Clear user on logout
      clearUser: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          userSubscription: null,
          onboardingCompleted: false
        });
      },
      
      // Update specific user fields
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      },

      // Set loading state
      setAuthLoading: (loading) => set({ isLoading: loading }),

      // ================== SUBSCRIPTION STATE ==================
      userSubscription: null, // { plan: 'free' | 'pro' | 'enterprise', expiresAt: Date, status: 'active' | 'expired' }
      
      setSubscription: (subscription) => {
        set({ userSubscription: subscription });
      },
      
      // Check if user has active premium subscription
      isPremium: () => {
        const { userSubscription } = get();
        if (!userSubscription) return false;
        
        const isPro = userSubscription.plan === 'pro' || userSubscription.plan === 'enterprise';
        const isActive = userSubscription.status === 'active';
        const notExpired = !userSubscription.expiresAt || new Date(userSubscription.expiresAt) > new Date();
        
        return isPro && isActive && notExpired;
      },
      
      // Get user plan name
      getUserPlan: () => {
        const { userSubscription } = get();
        return userSubscription?.plan || 'free';
      },

      // ================== ONBOARDING STATE ==================
      onboardingCompleted: false,
      onboardingStep: 0,
      
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      resetOnboarding: () => set({ onboardingCompleted: false, onboardingStep: 0 }),

      // ================== USER ACTIVITY TRACKING ==================
      lastActivity: null,
      sessionStartTime: null,
      
      updateLastActivity: () => {
        set({ lastActivity: new Date().toISOString() });
      },
      
      startSession: () => {
        set({ 
          sessionStartTime: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
      },
      
      endSession: () => {
        set({ 
          sessionStartTime: null,
          lastActivity: null
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist subscription and onboarding state
        userSubscription: state.userSubscription,
        onboardingCompleted: state.onboardingCompleted,
        onboardingStep: state.onboardingStep,
        
        // Note: user, isAuthenticated, and session data are NOT persisted
        // They will be re-fetched from Clerk on app load
      }),
    }
  )
);

export default useAuthStore;
