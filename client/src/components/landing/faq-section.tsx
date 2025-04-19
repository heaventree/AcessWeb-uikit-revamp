import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

function FAQItem({ question, answer, value }: FAQItemProps) {
  return (
    <AccordionItem value={value} className="border-b border-gray-200 py-2">
      <AccordionTrigger className="text-left font-semibold hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 pt-2">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
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
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about AccessWebPro
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
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
      </div>
    </section>
  );
}
