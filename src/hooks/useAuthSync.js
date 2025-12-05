import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import useAuthStore from '@/store/useAuthStore';
import useTravelStore from '@/store/useTravelStore';
import useUIStore from '@/store/useUIStore';

/**
 * Custom hook to sync Clerk authentication state with Zustand stores
 * This hook should be used at the app root level (e.g., in App.jsx or main.jsx)
 * 
 * Features:
 * - Syncs Clerk user data to auth store
 * - Updates authentication state
 * - Handles user session tracking
 * - Manages loading states
 * 
 * @returns {Object} Auth state and methods
 */
export const useAuthSync = () => {
  const { user, isLoaded: clerkIsLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  
  const {
    setUser,
    clearUser,
    setAuthLoading,
    startSession,
    endSession,
    updateLastActivity,
    isAuthenticated,
    user: storeUser,
  } = useAuthStore();

  // Sync Clerk user to Zustand store
  useEffect(() => {
    if (!clerkIsLoaded) {
      setAuthLoading(true);
      return;
    }

    if (isSignedIn && user) {
      // Only sync if user ID changed or first time
      const currentStoreUserId = useAuthStore.getState().user?.id;
      
      if (currentStoreUserId !== user.id) {
        // Map Clerk user to our store format
        const userData = {
          id: user.id,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          emailVerified: user.primaryEmailAddress?.verification?.status === 'verified',
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Add any custom metadata from Clerk
          metadata: user.publicMetadata || {},
        };

        setUser(userData);
        startSession();
      }
    } else if (!isSignedIn) {
      // User is signed out - only clear if we had a user
      const hasStoreUser = useAuthStore.getState().isAuthenticated;
      if (hasStoreUser) {
        clearUser();
        endSession();
      } else {
        setAuthLoading(false);
      }
    }
  }, [
    clerkIsLoaded, 
    isSignedIn, 
    user?.id,  // Only depend on user ID, not whole user object
    // Note: setUser, clearUser, etc. are stable Zustand actions
  ]);

  // Update activity on user interaction
  useEffect(() => {
    if (!isSignedIn) return;

    const handleActivity = () => {
      updateLastActivity();
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isSignedIn, updateLastActivity]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      clearUser();
      endSession();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    isLoaded: clerkIsLoaded,
    isAuthenticated,
    user: storeUser,
    signOut: handleSignOut,
  };
};

/**
 * Hook to check if user has premium access
 * 
 * @returns {Object} Premium status and plan info
 */
export const usePremiumStatus = () => {
  const { isPremium, getUserPlan, userSubscription } = useAuthStore();

  return {
    isPremium: isPremium(),
    plan: getUserPlan(),
    subscription: userSubscription,
  };
};

/**
 * Hook to manage auth modal state
 * 
 * @returns {Object} Auth modal state and controls
 */
export const useAuthModal = () => {
  const {
    showAuthModal,
    authModalMode,
    redirectAfterAuth,
    openAuthModal,
    closeAuthModal,
    toggleAuthMode,
  } = useUIStore();

  return {
    isOpen: showAuthModal,
    mode: authModalMode,
    redirectTo: redirectAfterAuth,
    open: openAuthModal,
    close: closeAuthModal,
    toggle: toggleAuthMode,
  };
};

/**
 * Hook to manage user travel preferences
 * 
 * @returns {Object} Travel preferences and update methods
 */
export const useTravelPreferences = () => {
  const {
    travelPreferences,
    setTravelPreferences,
    updateTravelPreferences,
    clearTravelPreferences,
  } = useTravelStore();

  return {
    preferences: travelPreferences,
    setPreferences: setTravelPreferences,
    updatePreferences: updateTravelPreferences,
    clearPreferences: clearTravelPreferences,
  };
};

/**
 * Hook to manage saved destinations
 * 
 * @returns {Object} Saved destinations and methods
 */
export const useSavedDestinations = () => {
  const {
    savedDestinations,
    addSavedDestination,
    removeSavedDestination,
    isDestinationSaved,
  } = useTravelStore();

  const toggleSavedDestination = (destination) => {
    if (isDestinationSaved(destination.id)) {
      removeSavedDestination(destination.id);
      return false; // removed
    } else {
      addSavedDestination(destination);
      return true; // added
    }
  };

  return {
    savedDestinations,
    addDestination: addSavedDestination,
    removeDestination: removeSavedDestination,
    isDestinationSaved,
    toggleDestination: toggleSavedDestination,
  };
};

/**
 * Hook to manage recent searches
 * 
 * @returns {Object} Recent searches and methods
 */
export const useRecentSearches = () => {
  const {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useTravelStore();

  return {
    searches: recentSearches,
    addSearch: addRecentSearch,
    clearSearches: clearRecentSearches,
  };
};

/**
 * Hook to manage trips
 * 
 * @returns {Object} Trip management methods
 */
export const useTrips = () => {
  const {
    currentTrip,
    savedTrips,
    setCurrentTrip,
    saveCurrentTrip,
    updateTrip,
    deleteTrip,
    clearCurrentTrip,
  } = useTravelStore();

  return {
    currentTrip,
    savedTrips,
    setCurrentTrip,
    saveCurrentTrip,
    updateTrip,
    deleteTrip,
    clearCurrentTrip,
  };
};

export default useAuthSync;
