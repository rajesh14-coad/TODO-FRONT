import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  corporateBlue: {
    id: 'corporateBlue',
    name: 'Corporate Blue',
    colors: {
      primary: '#1e3a8a',
      primaryLight: '#3b82f6',
      primaryDark: '#1e40af',
      secondary: '#f8fafc',
      accent: '#60a5fa',
      background: '#ffffff',
      backgroundDark: '#0f172a',
      text: '#1e293b',
      textDark: '#f1f5f9',
      border: '#cbd5e1',
      borderDark: '#334155',
    },
    cssVars: {
      '--theme-primary': '#1e3a8a',
      '--theme-primary-light': '#3b82f6',
      '--theme-primary-dark': '#1e40af',
      '--theme-secondary': '#f8fafc',
      '--theme-accent': '#60a5fa',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#0f172a',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#f1f5f9',
      '--theme-border': '#cbd5e1',
      '--theme-border-dark': '#334155',
    }
  },
  evergreen: {
    id: 'evergreen',
    name: 'Evergreen',
    colors: {
      primary: '#064e3b',
      primaryLight: '#10b981',
      primaryDark: '#065f46',
      secondary: '#f0fdf4',
      accent: '#6ee7b7',
      background: '#ffffff',
      backgroundDark: '#022c22',
      text: '#1e293b',
      textDark: '#f0fdf4',
      border: '#d1fae5',
      borderDark: '#065f46',
    },
    cssVars: {
      '--theme-primary': '#064e3b',
      '--theme-primary-light': '#10b981',
      '--theme-primary-dark': '#065f46',
      '--theme-secondary': '#f0fdf4',
      '--theme-accent': '#6ee7b7',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#022c22',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#f0fdf4',
      '--theme-border': '#d1fae5',
      '--theme-border-dark': '#065f46',
    }
  },
  roseGold: {
    id: 'roseGold',
    name: 'Rose Gold',
    colors: {
      primary: '#9f1239',
      primaryLight: '#fb7185',
      primaryDark: '#881337',
      secondary: '#fef2f2',
      accent: '#fda4af',
      background: '#ffffff',
      backgroundDark: '#1f1315',
      text: '#1e293b',
      textDark: '#fef2f2',
      border: '#fecdd3',
      borderDark: '#9f1239',
    },
    cssVars: {
      '--theme-primary': '#9f1239',
      '--theme-primary-light': '#fb7185',
      '--theme-primary-dark': '#881337',
      '--theme-secondary': '#fef2f2',
      '--theme-accent': '#fda4af',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#1f1315',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#fef2f2',
      '--theme-border': '#fecdd3',
      '--theme-border-dark': '#9f1239',
    }
  },
  steelGrey: {
    id: 'steelGrey',
    name: 'Steel Grey',
    colors: {
      primary: '#475569',
      primaryLight: '#94a3b8',
      primaryDark: '#334155',
      secondary: '#f8fafc',
      accent: '#cbd5e1',
      background: '#ffffff',
      backgroundDark: '#0f172a',
      text: '#1e293b',
      textDark: '#f1f5f9',
      border: '#e2e8f0',
      borderDark: '#475569',
    },
    cssVars: {
      '--theme-primary': '#475569',
      '--theme-primary-light': '#94a3b8',
      '--theme-primary-dark': '#334155',
      '--theme-secondary': '#f8fafc',
      '--theme-accent': '#cbd5e1',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#0f172a',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#f1f5f9',
      '--theme-border': '#e2e8f0',
      '--theme-border-dark': '#475569',
    }
  },
  sunsetGlow: {
    id: 'sunsetGlow',
    name: 'Sunset Glow',
    colors: {
      primary: '#d97706',
      primaryLight: '#fbbf24',
      primaryDark: '#b45309',
      secondary: '#fffbeb',
      accent: '#fcd34d',
      background: '#ffffff',
      backgroundDark: '#1c1301',
      text: '#1e293b',
      textDark: '#fffbeb',
      border: '#fde68a',
      borderDark: '#d97706',
    },
    cssVars: {
      '--theme-primary': '#d97706',
      '--theme-primary-light': '#fbbf24',
      '--theme-primary-dark': '#b45309',
      '--theme-secondary': '#fffbeb',
      '--theme-accent': '#fcd34d',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#1c1301',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#fffbeb',
      '--theme-border': '#fde68a',
      '--theme-border-dark': '#d97706',
    }
  },
  deepOcean: {
    id: 'deepOcean',
    name: 'Deep Ocean',
    colors: {
      primary: '#0d9488',
      primaryLight: '#2dd4bf',
      primaryDark: '#0f766e',
      secondary: '#f0fdfa',
      accent: '#5eead4',
      background: '#ffffff',
      backgroundDark: '#042f2e',
      text: '#1e293b',
      textDark: '#f0fdfa',
      border: '#ccfbf1',
      borderDark: '#0d9488',
    },
    cssVars: {
      '--theme-primary': '#0d9488',
      '--theme-primary-light': '#2dd4bf',
      '--theme-primary-dark': '#0f766e',
      '--theme-secondary': '#f0fdfa',
      '--theme-accent': '#5eead4',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#042f2e',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#f0fdfa',
      '--theme-border': '#ccfbf1',
      '--theme-border-dark': '#0d9488',
    }
  },
  royalPurple: {
    id: 'royalPurple',
    name: 'Royal Purple',
    colors: {
      primary: '#7e22ce',
      primaryLight: '#a855f7',
      primaryDark: '#6b21a8',
      secondary: '#f5f3ff',
      accent: '#c084fc',
      background: '#ffffff',
      backgroundDark: '#140a21',
      text: '#1e293b',
      textDark: '#f5f3ff',
      border: '#ddd6fe',
      borderDark: '#7e22ce',
    },
    cssVars: {
      '--theme-primary': '#7e22ce',
      '--theme-primary-light': '#a855f7',
      '--theme-primary-dark': '#6b21a8',
      '--theme-secondary': '#f5f3ff',
      '--theme-accent': '#c084fc',
      '--theme-bg': '#ffffff',
      '--theme-bg-dark': '#140a21',
      '--theme-text': '#1e293b',
      '--theme-text-dark': '#f5f3ff',
      '--theme-border': '#ddd6fe',
      '--theme-border-dark': '#7e22ce',
    }
  }
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const saved = localStorage.getItem('theme-variant');
    // Validate that the saved theme exists in the themes object
    if (saved && themes[saved]) {
      return saved;
    }
    // Default to corporateBlue if saved theme doesn't exist
    return 'corporateBlue';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Set dark/light mode
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('theme-mode', mode);

    // Apply theme CSS variables with safety check
    const currentTheme = themes[selectedTheme];
    if (currentTheme && currentTheme.cssVars) {
      const themeVars = currentTheme.cssVars;
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      localStorage.setItem('theme-variant', selectedTheme);
    } else {
      // If theme doesn't exist, reset to default
      console.warn(`Theme "${selectedTheme}" not found, resetting to corporateBlue`);
      setSelectedTheme('corporateBlue');
    }
  }, [mode, selectedTheme]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeTheme = (themeId) => {
    setSelectedTheme(themeId);
  };

  const value = {
    mode,
    theme: selectedTheme,
    themeConfig: themes[selectedTheme],
    toggleMode,
    changeTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
