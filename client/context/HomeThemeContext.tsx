'use client';

import { createContext, useContext, useState } from 'react';

interface HomeThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const HomeThemeContext = createContext<HomeThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function HomeThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <HomeThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </HomeThemeContext.Provider>
  );
}

export function useHomeTheme() {
  return useContext(HomeThemeContext);
}