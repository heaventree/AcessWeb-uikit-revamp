import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { motion } from "framer-motion";
import { PlayCircle, CheckCircle, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onTrialSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function HeroSection({ onTrialSignup, isSubmitting }: HeroSectionProps) {
  return (
    <section className="pt-28 pb-16 md:pb-32 bg-gradient-to-b from-[#f9fdff] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1.5 bg-[#e0f5f1] text-[#0fae96] rounded-full font-medium text-sm mb-6">
              Introducing the industry standard for WCAG compliance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text">
              Make Your Website Accessible to <span className="text-primary">Everyone</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form onSubmit={onTrialSignup} className="flex-shrink-0">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all duration-300 rounded-full px-8 py-6 text-white"
                >
                  {isSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:border-primary transition-colors rounded-full px-8 py-6"
              >
                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1573167710701-35950a41e251?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="AccessWebPro dashboard showing accessibility compliance metrics" 
              className="w-full h-auto"
            />
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-between opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 mx-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-6 mx-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-6 mx-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-5 mx-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-5 mx-auto" />
          </div>
          
          {/* Floating certification badge */}
          <div className="absolute -bottom-10 right-8 md:right-10 bg-white p-5 rounded-xl shadow-lg max-w-xs border border-gray-100">
            <div className="flex items-center text-[#0fae96] mb-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">WCAG 2.1 AA Certified</span>
            </div>
            <p className="text-sm text-gray-600">Verify your site meets accessibility standards in minutes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
