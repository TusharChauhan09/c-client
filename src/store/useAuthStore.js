import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

/**
 * Authentication Store
 * Manages user authentication state, subscription, and onboarding
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ================== USER STATE ==================
      user: null, // Clerk User
      dbUser: null, // MongoDB User (with subscription info)
      isAuthenticated: false,
      isLoading: false,
      
      // Fetch user from MongoDB (creates if doesn't exist)
      syncUser: async (clerkId, clerkUser = null) => {
        if (!clerkId) return;
        try {
          // First try to get existing user
          const response = await axios.get(`http://localhost:3000/api/auth/me?clerkId=${clerkId}`);
          if (response.data.success) {
            set({ dbUser: response.data.user });
          }
        } catch (error) {
          // User not found - create them using the sync endpoint
          if (error.response?.status === 404 && clerkUser) {
            try {
              console.log("User not found in DB, creating...");
              const syncResponse = await axios.post('http://localhost:3000/api/auth/sync', {
                clerkId: clerkId,
                email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                username: clerkUser.username,
                avatar: clerkUser.imageUrl,
              });
              if (syncResponse.data.success) {
                console.log("✅ User created in DB:", syncResponse.data.user._id);
                set({ dbUser: syncResponse.data.user });
              }
            } catch (syncError) {
              console.error("Failed to create user in DB:", syncError);
            }
          } else {
            console.error("Failed to sync user from DB:", error);
          }
        }
      },

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
          dbUser: null,
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
        dbUser: state.dbUser,
        
        // Note: user, isAuthenticated, and session data are NOT persisted
        // They will be re-fetched from Clerk on app load
      }),
    }
  )
);

export default useAuthStore;
