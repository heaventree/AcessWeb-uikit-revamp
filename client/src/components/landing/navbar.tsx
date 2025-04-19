import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Menu,
  X,
  CheckCircle
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" }
  ];

  return (
    <header className={`fixed w-full bg-white/90 backdrop-blur-sm z-50 ${scrolled ? 'shadow-sm' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-gray-900">AccessWeb<span className="text-primary">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <a href="#" className="hidden md:inline-block text-gray-600 hover:text-primary font-medium transition-colors">
            Login
          </a>
          <Button 
            className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Start Free Trial
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 py-3 overflow-hidden"
          >
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="block py-2 text-gray-600 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#" 
              className="block py-2 text-gray-600 hover:text-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
