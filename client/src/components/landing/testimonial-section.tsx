import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  delay: number;
}

function TestimonialCard({ image, name, role, content, rating, delay }: TestimonialProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center mb-4">
          <img 
            src={image} 
            alt={name} 
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star 
              key={index}
              className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export default function TestimonialSection() {
  const ref = useRef(null);
  const logoRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const logoIsInView = useInView(logoRef, { once: true, margin: "-100px" });
  
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "Sarah Wilson",
      role: "Head of Digital, TechCorp",
      content: "\"AccessWebPro has transformed how we approach accessibility testing and real-time monitoring has saved us countless hours.\"",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "Michael Chen",
      role: "CTO, WebSolutions",
      content: "\"The detailed reports and fix suggestions make it easy for our developers to maintain WCAG compliance across all our projects.\"",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      name: "David Thompson",
      role: "Accessibility Lead, Agency X",
      content: "\"AccessWebPro's continuous monitoring gives us peace of mind knowing our sites stay compliant even as we make updates.\"",
      rating: 4.5
    }
  ];

  const companyLogos = [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      alt: "Google"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      alt: "Microsoft"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      alt: "Apple"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      alt: "Netflix"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      alt: "Amazon"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how AccessWebPro has helped companies achieve WCAG compliance
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        <motion.div 
          ref={logoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={logoIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <p className="text-center text-gray-500 mb-8">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companyLogos.map((logo, index) => (
              <img 
                key={index}
                src={logo.url} 
                alt={logo.alt} 
                className="h-8 opacity-50 hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
