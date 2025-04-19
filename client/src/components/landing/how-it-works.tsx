import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
  delay: number;
}

function Step({ number, title, description, isLast = false, delay }: StepProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute hidden md:block w-20 h-2 bg-gradient-to-r from-primary to-indigo-500 top-1/4 -right-10 transform translate-y-1/2 z-0"></div>
      )}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white rounded-xl p-8 relative z-10 h-full border border-gray-100 shadow-sm"
      >
        <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mb-5">
          {number}
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How AccessWebPro Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our powerful platform makes achieving WCAG compliance simple and efficient
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <Step 
            number={1} 
            title="Connect Your Website" 
            description="Simply enter your website URL or connect via our plugin for WordPress, Shopify, or other platforms."
            delay={0.1}
          />
          <Step 
            number={2} 
            title="Automated Analysis" 
            description="Our AI engine scans your entire site for WCAG compliance issues across all pages and content."
            delay={0.2}
          />
          <Step 
            number={3} 
            title="Fix & Monitor" 
            description="Get detailed reports and automated fixes to resolve issues, then enable continuous monitoring."
            isLast={true}
            delay={0.3}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Button 
            id="demo" 
            size="lg"
            className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            See It In Action
            <PlayCircle className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
