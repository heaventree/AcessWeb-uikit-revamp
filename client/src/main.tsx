import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from localStorage or system preference
function initializeTheme() {
  // Check for stored theme
  const storedTheme = localStorage.getItem("accessweb-theme");
  const root = window.document.documentElement;
  
  if (storedTheme) {
    // Apply stored theme
    root.classList.add(storedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
    }
  }
}

// Call theme initialization before rendering
if (typeof window !== 'undefined') {
  initializeTheme();
}

createRoot(document.getElementById("root")!).render(<App />);
