import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
  delay: number;
  icon: React.ReactNode;
}

function Step({ number, title, description, isLast = false, delay, icon }: StepProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center max-w-sm mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-5 shadow-md border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute -top-1 -right-1 bg-[#0fae96] dark:bg-[#0fae96] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        <div className="text-[#0fae96] dark:text-[#5eead4] w-6 h-6">
          {icon}
        </div>
      </div>
      
      {!isLast && (
        <div className="hidden md:block w-24 h-px bg-gray-200 dark:bg-gray-700 absolute right-[-3rem] top-8"></div>
      )}
      
      <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"/><path d="M20 12H9"/><path d="M16 16 20 12 16 8"/></svg>,
      title: "Connect Your Website",
      description: "Enter your website URL or install our plugin for WordPress, Shopify, or other platforms for one-click integration."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>,
      title: "Run Advanced Scans",
      description: "Our AI-powered engine automatically analyzes your entire site for WCAG compliance issues with 97% accuracy."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 15-5-5"/><path d="m19.5 20-5-5"/><path d="M4 5a1 1 0 1 1 2 0c0 1.727 0 6.273 0 8a3 3 0 0 0 6 0v-2a2 2 0 1 1 4 0v2.5"/><path d="M6 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>,
      title: "Fix & Monitor",
      description: "Apply automated fixes with one click and enable real-time monitoring to maintain ongoing compliance."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-white dark:from-gray-900 to-[#f9fdff] dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6">
            One dashboard for effortless monitoring
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">How AccessWebPro Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our powerful platform makes achieving WCAG compliance simple and efficient in just three easy steps
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 mb-20 max-w-5xl mx-auto relative">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1} 
              title={step.title} 
              description={step.description}
              isLast={index === steps.length - 1}
              delay={0.1 * index}
              icon={step.icon}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-3 dark:text-white">Ready to get started?</h3>
              <p className="text-gray-600 dark:text-gray-300">Join 5000+ businesses already using AccessWebPro to ensure WCAG compliance.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                id="demo" 
                variant="outline"
                className="rounded-full py-6 px-8 border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                See Demo
                <PlayCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                id="signup" 
                className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 rounded-full py-6 px-8 text-white"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
