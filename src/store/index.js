/**
 * Store Index
 * Central export point for all Zustand stores
 */

// Import individual stores
export { default as useAuthStore } from './useAuthStore';
export { default as useUIStore } from './useUIStore';
export { default as useTravelStore } from './useTravelStore';

// For backward compatibility, export useUIStore as default (since it was useStore before)
export { default } from './useUIStore';
