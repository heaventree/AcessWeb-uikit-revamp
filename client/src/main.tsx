import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from localStorage or system preference
function initializeTheme() {
  console.log("Initializing theme");
  
  // Get the document root element
  const root = window.document.documentElement;
  
  // Clear any existing theme classes first to avoid conflicts
  root.classList.remove('light', 'dark');
  
  // Get stored theme or use system preference as fallback
  const storedTheme = localStorage.getItem("accessweb-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Determine which theme to use
  let finalTheme = "light";
  
  if (storedTheme === "dark" || (storedTheme === null && systemPrefersDark)) {
    finalTheme = "dark";
  }
  
  // Apply final theme
  root.classList.add(finalTheme);
  localStorage.setItem("accessweb-theme", finalTheme);
  document.body.style.colorScheme = finalTheme;
  
  // Set a data attribute for additional CSS targeting
  root.setAttribute('data-theme', finalTheme);
  
  // Force a repaint to ensure all elements update correctly
  setTimeout(() => {
    // This small delay helps ensure the theme is properly applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger a reflow
    document.body.style.display = '';
  }, 10);
  
  console.log("Theme classes after initialization:", root.classList.toString());
}

// Call theme initialization before rendering
if (typeof window !== 'undefined') {
  initializeTheme();
}

createRoot(document.getElementById("root")!).render(<App />);
