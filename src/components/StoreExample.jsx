import useStore from '@/store/useStore';

/**
 * Example component showing how to use the Zustand store
 * You can use this as a reference for accessing global state
 */
export function StoreExample() {
  // Access state - this component will re-render when these values change
  const theme = useStore((state) => state.theme);
  const sparkSettings = useStore((state) => state.sparkSettings);
  const preferences = useStore((state) => state.preferences);
  
  // Access actions
  const setTheme = useStore((state) => state.setTheme);
  const setSparkSettings = useStore((state) => state.setSparkSettings);
  const setPreferences = useStore((state) => state.setPreferences);
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Zustand Store Example</h2>
      
      {/* Theme Controls */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Theme: {theme}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme('light')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Dark
          </button>
          <button 
            onClick={() => setTheme('system')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            System
          </button>
        </div>
      </div>
      
      {/* Spark Settings */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Spark Settings</h3>
        <div className="space-y-1">
          <div>Size: {sparkSettings.size}</div>
          <div>Radius: {sparkSettings.radius}</div>
          <div>Count: {sparkSettings.count}</div>
          <div>Duration: {sparkSettings.duration}ms</div>
        </div>
        <button
          onClick={() => setSparkSettings({ count: sparkSettings.count + 1 })}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
        >
          Increase Spark Count
        </button>
      </div>
      
      {/* Preferences */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Preferences</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences.animations}
            onChange={(e) => setPreferences({ animations: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Enable Animations</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences.soundEffects}
            onChange={(e) => setPreferences({ soundEffects: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Enable Sound Effects</span>
        </label>
      </div>
    </div>
  );
}
