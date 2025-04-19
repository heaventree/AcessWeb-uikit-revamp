import { MainNavigation } from "@/components/navigation/MainNavigation";
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
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
export default function Home() {
  const { toast } = useToast();
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);

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
      <MainNavigation />
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
