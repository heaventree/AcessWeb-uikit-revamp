import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Menu,
  X,
  CheckCircle,
  ArrowRight
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
    <header className={`fixed w-full bg-white/95 backdrop-blur-sm z-50 ${scrolled ? 'shadow-sm' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="w-10 h-10 rounded-xl bg-[#e0f5f1] flex items-center justify-center mr-1">
            <CheckCircle className="w-5 h-5 text-[#0fae96]" />
          </div>
          <span className="text-xl font-bold text-gray-900">AccessWeb<span className="text-[#0fae96]">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-5">
          <a href="#" className="hidden md:inline-block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            Login
          </a>
          <Button 
            className="bg-[#0fae96] hover:bg-[#0fae96]/90 transition-all duration-300 rounded-full px-6 text-white"
          >
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
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
            className="md:hidden bg-white border-t border-gray-100 px-4 py-4 overflow-hidden"
          >
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="block py-3 text-gray-600 hover:text-[#0fae96] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <a 
                href="#" 
                className="block py-3 text-gray-600 hover:text-[#0fae96] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              <Button 
                className="w-full mt-3 bg-[#0fae96] hover:bg-[#0fae96]/90 transition-all duration-300 rounded-full px-6 text-white"
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
