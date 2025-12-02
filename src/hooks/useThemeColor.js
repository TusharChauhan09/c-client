import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';

/**
 * Hook to get the current active theme color
 * Useful for components that need theme-aware colors
 * 
 * @param {string} cssVar - CSS variable name (e.g., '--foreground', '--background')
 * @param {string} fallback - Fallback color if CSS variable is not found
 * @returns {string} The resolved color value
 */
export function useThemeColor(cssVar, fallback = '#000000') {
  const [color, setColor] = useState(fallback);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const updateColor = () => {
      const style = getComputedStyle(document.documentElement);
      const value = style.getPropertyValue(cssVar)?.trim();
      setColor(value || fallback);
    };

    updateColor();

    // Listen for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [cssVar, fallback, theme]);

  return color;
}

/**
 * Hook to get multiple theme colors at once
 * 
 * @param {Object} colorMap - Object mapping keys to CSS variable names
 * @returns {Object} Object with the same keys, but values are resolved colors
 * 
 * @example
 * const colors = useThemeColors({
 *   foreground: '--foreground',
 *   background: '--background',
 *   primary: '--primary'
 * });
 * // colors.foreground, colors.background, colors.primary
 */
export function useThemeColors(colorMap) {
  const [colors, setColors] = useState({});
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      const newColors = {};
      
      Object.entries(colorMap).forEach(([key, cssVar]) => {
        const value = style.getPropertyValue(cssVar)?.trim();
        newColors[key] = value || '#000000';
      });
      
      setColors(newColors);
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [colorMap, theme]);

  return colors;
}

/**
 * Hook to check if dark mode is currently active
 * @returns {boolean} True if dark mode is active
 */
export function useIsDarkMode() {
  const getActiveTheme = useStore((state) => state.getActiveTheme);
  const theme = useStore((state) => state.theme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getActiveTheme() === 'dark');
  }, [theme, getActiveTheme]);

  return isDark;
}
