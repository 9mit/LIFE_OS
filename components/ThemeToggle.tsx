
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center gap-2.5 rounded-xl border border-champagne-200/50 bg-gradient-to-r from-white/80 to-champagne-50/50 px-4 py-2.5 text-xs font-semibold shadow-sm transition-all duration-300 hover:shadow-md hover:border-champagne-300 dark:border-champagne-500/20 dark:from-navy-900/80 dark:to-navy-800/50 dark:hover:border-champagne-400/40"
    >
      {/* Icon Container */}
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300 ${theme === "light"
          ? "bg-gradient-to-br from-champagne-400 to-champagne-500 text-white shadow-sm"
          : "bg-gradient-to-br from-navy-600 to-navy-700 text-champagne-300"
        }`}>
        {theme === "light" ? (
          <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
        )}
      </div>

      {/* Label */}
      <span className={`transition-colors ${theme === "light"
          ? "text-navy-700"
          : "text-champagne-200"
        }`}>
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
