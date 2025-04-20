import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";
import NavDropdown from "./navbar-dropdown";
import NavigationIcons from "../navigation/NavigationIconGuide";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  // Toggle dark mode function
  const toggleTheme = () => {
    console.log("Toggling theme");
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    
    // Log current state
    console.log("Current dark mode:", isDark);
    console.log("Current classes:", root.classList.toString());
    
    if (isDark) {
      // Switch to light mode
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
      document.body.style.colorScheme = "light";
      root.setAttribute('data-theme', 'light');
      setDarkMode(false);
      console.log("Switched to light mode");
    } else {
      // Switch to dark mode
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
      document.body.style.colorScheme = "dark";
      root.setAttribute('data-theme', 'dark');
      setDarkMode(true);
      console.log("Switched to dark mode");
    }
    
    // Force a repaint to ensure all elements update correctly
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger a reflow
      document.body.style.display = '';
    }, 10);
    
    // Log updated state
    console.log("Updated classes:", root.classList.toString());
  };
  
  // Effect to listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Handle scroll events to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Tools dropdown items
  const toolsDropdownItems = [
    { 
      icon: NavigationIcons.tools.wcagChecker, 
      label: 'WCAG Checker',
      description: 'Test your website against WCAG standards',
      href: '/tools/wcag-checker'
    },
    { 
      icon: NavigationIcons.tools.colorPalette, 
      label: 'Color Palette',
      description: 'Create accessible color combinations',
      href: '/tools/color-palette'
    },
    { 
      icon: NavigationIcons.tools.colorSimulator, 
      label: 'Color Accessibility Simulator',
      description: 'Test colors for accessibility',
      href: '/tools/color-simulator'
    },
    { 
      icon: NavigationIcons.tools.wcagStandards, 
      label: 'WCAG Standards',
      description: 'Browse WCAG 2.1 standards',
      href: '/tools/wcag-standards'
    }
  ];

  // Resources dropdown items
  const resourcesDropdownItems = [
    { 
      icon: NavigationIcons.resources.documentation, 
      label: 'Documentation',
      description: 'Technical guides and API docs',
      href: '/resources/documentation'
    },
    { 
      icon: NavigationIcons.resources.helpCenter, 
      label: 'Help Center',
      description: 'FAQs and troubleshooting',
      href: '/resources/help-center'
    },
    { 
      icon: NavigationIcons.resources.blog, 
      label: 'Blog',
      description: 'Articles and accessibility updates',
      href: '/resources/blog'
    }
  ];

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" }
  ];

  return (
    <header className={`fixed w-full bg-background/95 dark:bg-background/95 backdrop-blur-sm z-50 ${scrolled ? 'shadow-sm' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="w-10 h-10 rounded-xl bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center mr-1">
            <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4]" />
          </div>
          <span className="text-xl font-bold text-foreground dark:text-foreground">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Tools Dropdown */}
          <NavDropdown label="Tools" items={toolsDropdownItems} />
          
          {/* Resources Dropdown */}
          <NavDropdown label="Resources" items={resourcesDropdownItems} />
          
          {/* Regular nav items */}
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-5">
          <a href="#" className="hidden md:inline-block text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            Login
          </a>
          <Button 
            className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-6 text-white"
          >
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border px-4 py-4 overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Tools Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#5eead4]">Tools</h3>
              {toolsDropdownItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a className="block py-2 pl-3 text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center mb-1">
                      <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                      <span className="dark:text-white">{item.label}</span>
                    </div>
                    <div className="pl-7 text-sm text-muted-foreground dark:text-[#5eead4] whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.description}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Resources Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#5eead4]">Resources</h3>
              {resourcesDropdownItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a className="block py-2 pl-3 text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center mb-1">
                      <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                      <span className="dark:text-white">{item.label}</span>
                    </div>
                    <div className="pl-7 text-sm text-muted-foreground dark:text-[#5eead4] whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.description}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Regular Nav Items */}
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="block py-3 text-muted-foreground hover:text-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-border">
              <div className="flex items-center justify-between py-3">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <Button 
                className="w-full mt-3 bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-6 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
