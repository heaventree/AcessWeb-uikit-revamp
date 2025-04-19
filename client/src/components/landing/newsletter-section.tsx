import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail } from "lucide-react";

interface NewsletterSectionProps {
  onNewsletterSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewsletterSection({ onNewsletterSignup, isSubmitting }: NewsletterSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#f4f9ff] p-10 md:p-16 rounded-3xl border border-[#e5f1fb] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#e0f5f1] opacity-50 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-100 opacity-30 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <Badge variant="outline" className="bg-[#e0f5f1] text-[#0fae96] border-0 rounded-full px-4 py-1 mb-6">
                Accessibility insights
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated on Accessibility</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our newsletter for the latest accessibility compliance updates, best practices, and exclusive resources to keep your sites fully accessible.
              </p>
              
              <form onSubmit={onNewsletterSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="pl-12 pr-4 py-6 rounded-full border-gray-200 flex-grow"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90 transition-all duration-300 rounded-full py-6 whitespace-nowrap"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              
              <p className="text-gray-500 text-xs mt-4">
                By subscribing, you agree to our Privacy Policy. We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
