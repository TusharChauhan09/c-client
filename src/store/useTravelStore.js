import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Travel Store
 * Manages travel-related data like preferences, saved destinations, and search history
 */
const useTravelStore = create(
  persist(
    (set, get) => ({
      // ================== TRAVEL PREFERENCES ==================
      travelPreferences: null,
      
      setTravelPreferences: (preferences) => {
        set({ travelPreferences: preferences });
      },
      
      updateTravelPreferences: (updates) => {
        set((state) => ({
          travelPreferences: state.travelPreferences 
            ? { ...state.travelPreferences, ...updates }
            : updates
        }));
      },
      
      // Reset preferences
      clearTravelPreferences: () => {
        set({ travelPreferences: null });
      },

      // ================== SAVED DESTINATIONS ==================
      savedDestinations: [],
      
      addSavedDestination: (destination) => {
        set((state) => {
          // Avoid duplicates
          const exists = state.savedDestinations.some(d => d.id === destination.id);
          if (exists) return state;
          
          return {
            savedDestinations: [...state.savedDestinations, {
              ...destination,
              savedAt: new Date().toISOString()
            }]
          };
        });
      },
      
      removeSavedDestination: (destinationId) => {
        set((state) => ({
          savedDestinations: state.savedDestinations.filter(d => d.id !== destinationId)
        }));
      },
      
      clearSavedDestinations: () => {
        set({ savedDestinations: [] });
      },
      
      // Check if destination is saved
      isDestinationSaved: (destinationId) => {
        const { savedDestinations } = get();
        return savedDestinations.some(d => d.id === destinationId);
      },

      // ================== RECENT SEARCHES ==================
      recentSearches: [],
      
      addRecentSearch: (search) => {
        set((state) => {
          // Remove duplicate and add to front
          const filtered = state.recentSearches.filter(s => 
            typeof s === 'string' ? s !== search : s.query !== (typeof search === 'string' ? search : search.query)
          );
          
          const newSearch = typeof search === 'string' 
            ? { query: search, timestamp: new Date().toISOString() }
            : { ...search, timestamp: new Date().toISOString() };
          
          return {
            recentSearches: [newSearch, ...filtered].slice(0, 10) // Keep only last 10
          };
        });
      },
      
      removeRecentSearch: (searchId) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s, index) => 
            typeof s === 'string' ? index !== searchId : s.query !== searchId
          )
        }));
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      // ================== TRIP PLANNING ==================
      currentTrip: null,
      savedTrips: [],
      
      setCurrentTrip: (trip) => {
        set({ currentTrip: trip });
      },
      
      saveCurrentTrip: () => {
        set((state) => {
          if (!state.currentTrip) return state;
          
          const trip = {
            ...state.currentTrip,
            id: state.currentTrip.id || Date.now().toString(),
            savedAt: new Date().toISOString()
          };
          
          return {
            savedTrips: [...state.savedTrips, trip],
            currentTrip: null
          };
        });
      },
      
      updateTrip: (tripId, updates) => {
        set((state) => ({
          savedTrips: state.savedTrips.map(trip => 
            trip.id === tripId ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
          )
        }));
      },
      
      deleteTrip: (tripId) => {
        set((state) => ({
          savedTrips: state.savedTrips.filter(trip => trip.id !== tripId)
        }));
      },
      
      clearCurrentTrip: () => {
        set({ currentTrip: null });
      },

      // ================== CONVERSATION HISTORY (Voice Agent) ==================
      conversationHistory: [],
      
      addConversation: (conversation) => {
        set((state) => ({
          conversationHistory: [
            {
              ...conversation,
              id: conversation.id || Date.now().toString(),
              timestamp: new Date().toISOString()
            },
            ...state.conversationHistory
          ].slice(0, 50) // Keep last 50 conversations
        }));
      },
      
      clearConversationHistory: () => {
        set({ conversationHistory: [] });
      },
    }),
    {
      name: 'travel-storage',
      storage: createJSONStorage(() => localStorage),
      // All travel data is persisted
    }
  )
);

export default useTravelStore;
