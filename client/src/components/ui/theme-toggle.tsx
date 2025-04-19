import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.classList.contains("dark");
    setIsDarkMode(initialColorValue);
  }, []);

  const toggleTheme = () => {
    console.log("Toggling theme");
    console.log("Current dark mode:", isDarkMode);
    
    const root = window.document.documentElement;
    console.log("Current classes:", root.classList.toString());
    
    if (isDarkMode) {
      // Switch to light mode
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      console.log("Switched to light mode");
    } else {
      // Switch to dark mode
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      console.log("Switched to dark mode");
    }
    
    console.log("Updated classes:", root.classList.toString());
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
      <span className="sr-only">{isDarkMode ? "Light" : "Dark"} mode</span>
    </Button>
  );
}