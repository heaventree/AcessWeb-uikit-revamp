import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

interface HeroSectionProps {
  onTrialSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function HeroSection({ onTrialSignup, isSubmitting }: HeroSectionProps) {
  return (
    <section className="pt-28 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1 bg-blue-100 text-primary rounded-full font-medium text-sm mb-4">
              WCAG Compliance Made Simple
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Make Your Website <span className="bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text">Accessible</span> to Everyone
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={onTrialSignup} className="flex-shrink-0">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {isSubmitting ? "Starting..." : "Start Free Trial"} →
                </Button>
              </form>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:border-primary transition-colors"
              >
                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="rounded-xl overflow-hidden shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 6,
                ease: "easeInOut"
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573167710701-35950a41e251?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Accessible interface demonstration" 
                className="w-full h-auto rounded-xl"
              />
            </motion.div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center text-green-500 mb-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">WCAG Compliant</span>
              </div>
              <p className="text-sm text-gray-600">Your website now meets AA accessibility standards!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
