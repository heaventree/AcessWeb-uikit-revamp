import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from localStorage or system preference
function initializeTheme() {
  console.log("Initializing theme");
  // Check for stored theme
  const storedTheme = localStorage.getItem("accessweb-theme");
  const root = window.document.documentElement;
  
  // Clear any existing theme classes first
  root.classList.remove("light", "dark");
  
  if (storedTheme) {
    // Apply stored theme
    console.log("Applying stored theme:", storedTheme);
    root.classList.add(storedTheme);
    document.body.style.colorScheme = storedTheme;
  } else {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log("System prefers dark:", prefersDark);
    
    if (prefersDark) {
      root.classList.add("dark");
      document.body.style.colorScheme = "dark";
      localStorage.setItem("accessweb-theme", "dark");
    } else {
      root.classList.add("light");
      document.body.style.colorScheme = "light";
      localStorage.setItem("accessweb-theme", "light");
    }
  }
  
  console.log("Theme classes after initialization:", root.classList.toString());
}

// Call theme initialization before rendering
if (typeof window !== 'undefined') {
  initializeTheme();
}

createRoot(document.getElementById("root")!).render(<App />);
