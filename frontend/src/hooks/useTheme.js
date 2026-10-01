import { useState, useEffect, useCallback } from 'react';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  try {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (_) {
    // In case localStorage is blocked/restricted
  }

  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  const applyTheme = useCallback((currentTheme) => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (_) {}
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    toggleTheme,
  };
}

export default useTheme;
