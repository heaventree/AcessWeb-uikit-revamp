import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, FormEvent } from "react";

interface CTABannerProps {
  onTrialSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function CTABanner({ onTrialSignup, isSubmitting }: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-indigo-500">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Start your free trial today and make your website accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <form onSubmit={onTrialSignup}>
              <Button 
                type="submit"
                disabled={isSubmitting}
                variant="secondary" 
                size="lg"
                className="px-8 py-3.5 bg-white text-primary hover:bg-gray-100 transition-colors shadow-lg"
              >
                {isSubmitting ? "Getting started..." : "Get started"}
              </Button>
            </form>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3.5 bg-transparent border border-white text-white hover:bg-white/10 transition-colors"
            >
              View pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
