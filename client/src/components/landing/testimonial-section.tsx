import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  company: string;
  content: string;
  stat?: string;
  statLabel?: string;
  delay: number;
}

function TestimonialCard({ image, name, role, company, content, stat, statLabel, delay }: TestimonialProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="mb-6 text-[#0fae96] dark:text-[#5eead4]">
          <Quote className="h-8 w-8 rotate-180 opacity-30" />
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 flex-grow">{content}</p>
        
        {stat && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#0fae96] dark:text-[#5eead4]">{stat}</div>
              <div className="ml-2 text-sm text-gray-600 dark:text-gray-400">{statLabel}</div>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold dark:text-white">{name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{role}, {company}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function TestimonialSection() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "Sarah Wilson",
      role: "Head of Digital",
      company: "TechCorp",
      content: "AccessWebPro has completely transformed how we approach website accessibility. The automated scanning and real-time monitoring have saved our team countless hours while dramatically improving our compliance scores.",
      stat: "47%",
      statLabel: "increase in user engagement"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "Michael Chen",
      role: "CTO",
      company: "WebSolutions",
      content: "The detailed reports and fix suggestions make it easy for our developers to maintain WCAG compliance across all our client projects. What used to take weeks now happens in hours.",
      stat: "99.8%",
      statLabel: "compliance score achieved"
    },
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "David Thompson",
      role: "Accessibility Lead",
      company: "Agency X",
      content: "AccessWebPro's continuous monitoring gives us peace of mind knowing our sites stay compliant even as we make updates. Their support team is also incredibly responsive when we need guidance.",
      stat: "3x",
      statLabel: "faster compliance audits"
    }
  ];

  const stats = [
    { value: "5,000+", label: "Active users" },
    { value: "10M+", label: "Pages scanned" },
    { value: "98.7%", label: "Customer satisfaction" }
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#f9fdff] dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6">
            Success stories from real users
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Trusted by Industry Leaders</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how AccessWebPro has helped companies achieve WCAG compliance and improve user experiences
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              stat={testimonial.stat}
              statLabel={testimonial.statLabel}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Why businesses choose AccessWebPro</h3>
            <p className="text-gray-600 dark:text-gray-300">Our platform delivers measurable results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-between">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5 mx-auto opacity-60 dark:invert dark:opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-5 mx-auto opacity-60 dark:invert dark:opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-5 mx-auto opacity-60 dark:invert dark:opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-5 mx-auto opacity-60 dark:opacity-80" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-5 mx-auto opacity-60 dark:invert dark:opacity-50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
