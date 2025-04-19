import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import StatSection from "@/components/landing/stat-section";
import FeatureSection from "@/components/landing/feature-section";
import HowItWorks from "@/components/landing/how-it-works";
import CTABanner from "@/components/landing/cta-banner";
import TestimonialSection from "@/components/landing/testimonial-section";
import PricingSection from "@/components/landing/pricing-section";
import FAQSection from "@/components/landing/faq-section";
import NewsletterSection from "@/components/landing/newsletter-section";
import Footer from "@/components/landing/footer";
import AccessibilityBadge from "@/components/landing/accessibility-badge";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Sun, Moon } from "lucide-react"; // Import sun and moon icons

export default function Home() {
  const { toast } = useToast();
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

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
  
  // Toggle dark mode function
  const toggleTheme = () => {
    const root = window.document.documentElement;
    
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
      setDarkMode(false);
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
      setDarkMode(true);
    }
  };

  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/trial-signup", { email: (e.target as HTMLFormElement).email.value });
      toast({
        title: "Success!",
        description: "Your free trial has been initiated. Check your email for next steps.",
        variant: "default",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsTrialSubmitting(false);
    }
  };

  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/newsletter-signup", { email: (e.target as HTMLFormElement).email.value });
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Navbar />
      
      {/* Dark Mode Toggle (top-right fixed position) */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun size={24} />
          ) : (
            <Moon size={24} />
          )}
        </button>
        <div className="text-center mt-2 text-xs font-medium bg-card text-card-foreground px-2 py-1 rounded shadow">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </div>
      </div>
      
      <main>
        <HeroSection onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <StatSection />
        <FeatureSection />
        <HowItWorks />
        <CTABanner onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <TestimonialSection />
        <PricingSection />
        <FAQSection />
        <NewsletterSection onNewsletterSignup={handleNewsletterSignup} isSubmitting={isNewsletterSubmitting} />
      </main>
      <Footer />
      <AccessibilityBadge />
    </div>
  );
}
