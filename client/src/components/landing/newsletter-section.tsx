import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterSectionProps {
  onNewsletterSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewsletterSection({ onNewsletterSignup, isSubmitting }: NewsletterSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated on Accessibility Compliance</h2>
          <p className="text-gray-600 mb-8">
            Get the latest updates on accessibility compliance, tips, and exclusive offers.
          </p>
          <form onSubmit={onNewsletterSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="px-4 py-6 flex-grow"
              required
            />
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 transition-all duration-300 py-6 whitespace-nowrap"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
