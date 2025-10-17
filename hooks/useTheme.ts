
import { useEffect } from "react";
import { useLifeOSStore } from "../store/useLifeOSStore";
import { useLocalStorage } from "./useLocalStorage";
import type { Theme } from "../store/useLifeOSStore";

export function useTheme() {
  const { theme: globalTheme, setTheme: setGlobalTheme } = useLifeOSStore();
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(
    "lifeos-theme",
    "light"
  );

  const theme = globalTheme ?? storedTheme;

  useEffect(() => {
    setGlobalTheme(storedTheme);
  }, [storedTheme, setGlobalTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setStoredTheme(nextTheme);
    setGlobalTheme(nextTheme);
  };

  return { theme, toggleTheme };
}
