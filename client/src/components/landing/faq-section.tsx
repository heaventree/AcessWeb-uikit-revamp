import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

function FAQItem({ question, answer, value }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AccordionItem value={value} className="border-0 mb-4">
      <AccordionTrigger 
        onClick={() => setIsOpen(!isOpen)}
        className="text-left font-semibold hover:no-underline bg-white dark:bg-gray-800 rounded-xl py-5 px-6 shadow-sm border border-gray-100 dark:border-gray-700 data-[state=open]:rounded-b-none dark:text-white [&>svg]:hidden"
      >
        <span>{question}</span>
        <div className="shrink-0 ml-4">
          {isOpen ? 
            <div className="w-6 h-6 rounded-full bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center">
              <Minus className="h-4 w-4 text-[#0fae96] dark:text-[#5eead4]" />
            </div> : 
            <div className="w-6 h-6 rounded-full bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center">
              <Plus className="h-4 w-4 text-[#0fae96] dark:text-[#5eead4]" />
            </div>
          }
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 dark:text-gray-300 p-6 pt-4 border border-t-0 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const ctaRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ctaIsInView = useInView(ctaRef, { once: true, margin: "-100px" });
  
  const faqs = [
    {
      question: "What accessibility standards does AccessWebPro check for?",
      answer: "AccessWebPro thoroughly checks your website against WCAG 2.1 (levels A, AA, and AAA), Section 508, ADA, and international accessibility standards. Our platform stays updated with the latest guidelines and requirements to ensure your website remains compliant.",
      value: "item-1"
    },
    {
      question: "How does the automated fix feature work?",
      answer: "Our platform analyzes each accessibility issue and generates specific code fixes that can be applied with a single click. For more complex issues, we provide detailed guidance on how to make the necessary changes. Our AI engine ensures that fixes are contextually appropriate and maintain your site's functionality.",
      value: "item-2"
    },
    {
      question: "Can AccessWebPro help with legal compliance?",
      answer: "Yes, AccessWebPro helps organizations meet legal accessibility requirements like the ADA and Section 508. While we can't guarantee legal immunity, our comprehensive reports and remediation history provide valuable documentation of your good-faith efforts to maintain accessibility, which can be crucial in legal situations.",
      value: "item-3"
    },
    {
      question: "How often should I scan my website?",
      answer: "We recommend daily scans for sites that update content frequently. For more static websites, weekly scans may be sufficient. Our Professional and Enterprise plans include continuous monitoring options that automatically check your site whenever content changes are detected.",
      value: "item-4"
    },
    {
      question: "Can I use AccessWebPro with my CMS?",
      answer: "Yes, AccessWebPro integrates with popular CMS platforms including WordPress, Shopify, Drupal, and more. We offer dedicated plugins that make the integration seamless, allowing you to manage accessibility directly from your CMS dashboard. For other platforms, our API and JavaScript snippet options ensure compatibility.",
      value: "item-5"
    }
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6">
            We're here to help
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about AccessWebPro and web accessibility compliance
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto mb-20">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                value={faq.value}
              />
            ))}
          </Accordion>
        </div>
        
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="bg-[#f4f9ff] dark:bg-gray-800 p-10 rounded-2xl max-w-4xl mx-auto border border-[#e5f1fb] dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-3 dark:text-white">Still have questions?</h3>
              <p className="text-gray-600 dark:text-gray-300">Contact our support team for personalized assistance with your accessibility needs.</p>
            </div>
            <div>
              <Button 
                className="bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80 rounded-full py-6 px-8 text-white"
              >
                Contact Support <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
