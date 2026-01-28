import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always light theme - no dark mode
  const isDark = false;

  useEffect(() => {
    // Force light theme on the DOM
    localStorage.setItem("theme", "light");
    const html = document.documentElement;
    html.classList.remove("dark");
  }, []);

  // Empty function to maintain compatibility if toggleTheme is called anywhere
  const toggleTheme = () => {
    // No-op: theme toggle disabled
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
