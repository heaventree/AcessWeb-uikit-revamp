# Tailwind Configuration Updates for AccessWebPro UI Skin

This document outlines the necessary updates to the Tailwind configuration to properly implement the AccessWebPro UI skin.

## Tailwind CSS Configuration

The following configuration should be added to your existing `tailwind.config.ts` file to ensure all colors and design tokens are properly applied.

```js
import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './client/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary teal/mint colors
        "primary": {
          50: "#ecfefb",
          100: "#d1faf3",
          200: "#a6f4e6",
          300: "#6de7d1",
          400: "#2dd2b7",
          500: "#0fae96", // Primary brand color
          600: "#0d947f",
          700: "#106b5c",
          800: "#115449",
          900: "#12463c",
          950: "#052a25",
        },
        // Secondary blue colors
        "secondary": {
          50: "#e6f1ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0066ff", // Secondary blue
          600: "#0052cc",
          700: "#003d99",
          800: "#002966",
          900: "#001433",
        },
        // Semantic UI colors
        "success": {
          DEFAULT: "#10b981", // Green
          foreground: "#ffffff",
        },
        "warning": {
          DEFAULT: "#f59e0b", // Amber
          foreground: "#ffffff", 
        },
        "danger": {
          DEFAULT: "#ef4444", // Red
          foreground: "#ffffff",
        },
        "info": {
          DEFAULT: "#3b82f6", // Blue
          foreground: "#ffffff",
        },
        // Extending the border, background etc.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Various UI component colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

## Theme Integration in globals.css

The following CSS should be added to your globals CSS file or equivalent:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base colors as RGB values for opacity control */
    --color-primary-50: 236, 254, 251;
    --color-primary-100: 209, 250, 243;
    --color-primary-200: 166, 244, 230;
    --color-primary-300: 109, 231, 209;
    --color-primary-400: 45, 210, 183;
    --color-primary-500: 15, 174, 150;
    --color-primary-600: 13, 148, 127;
    --color-primary-700: 16, 107, 92;
    --color-primary-800: 17, 84, 73;
    --color-primary-900: 18, 70, 60;
    --color-primary-950: 5, 42, 37;

    /* Semantic tokens - Light mode defaults */
    --background: 249, 250, 251;
    --foreground: 17, 24, 39;
    
    --card: 255, 255, 255;
    --card-foreground: 17, 24, 39;
    
    --popover: 255, 255, 255;
    --popover-foreground: 17, 24, 39;
    
    --primary: 15, 174, 150;
    --primary-foreground: 255, 255, 255;
    
    --secondary: 0, 102, 255;
    --secondary-foreground: 255, 255, 255;
    
    --muted: 243, 244, 246;
    --muted-foreground: 107, 114, 128;
    
    --accent: 229, 231, 235;
    --accent-foreground: 17, 24, 39;
    
    --destructive: 239, 68, 68;
    --destructive-foreground: 255, 255, 255;
    
    --border: 229, 231, 235;
    --input: 229, 231, 235;
    --ring: 15, 174, 150;
    
    --radius: 0.5rem;
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;
  }

  .dark {
    --background: 3, 7, 18;
    --foreground: 249, 250, 251;
    
    --card: 31, 41, 55;
    --card-foreground: 249, 250, 251;
    
    --popover: 31, 41, 55;
    --popover-foreground: 249, 250, 251;
    
    --primary: 94, 234, 212;
    --primary-foreground: 17, 24, 39;
    
    --secondary: 59, 130, 246;
    --secondary-foreground: 255, 255, 255;
    
    --muted: 31, 41, 55;
    --muted-foreground: 156, 163, 175;
    
    --accent: 55, 65, 81;
    --accent-foreground: 249, 250, 251;
    
    --destructive: 239, 68, 68;
    --destructive-foreground: 255, 255, 255;
    
    --border: 55, 65, 81;
    --input: 55, 65, 81;
    --ring: 94, 234, 212;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

## Theme.json Configuration

Update your `theme.json` file with the following configuration to match the new UI skin:

```json
{
  "primary": "#0fae96",
  "variant": "tint",
  "appearance": "system",
  "radius": 12
}
```

## Implementation Notes

1. Ensure that your application is properly set up to use the dark mode class system:
   ```js
   function setTheme(theme) {
     const root = window.document.documentElement;
     const isDark = theme === 'dark';
     
     root.classList.remove(isDark ? 'light' : 'dark');
     root.classList.add(theme);
     
     localStorage.setItem('accessweb-theme', theme);
   }
   ```

2. For projects using the shadcn/ui component library, ensure all components are updated to use these theme variables.

3. For custom components, replace all hardcoded colors with the appropriate CSS variables or Tailwind classes from this configuration.