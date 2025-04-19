import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PlanFeature[];
  isPopular?: boolean;
  cta: string;
  variant: "default" | "primary" | "outline";
  delay: number;
  accentColor: string;
}

function PricingPlan({ 
  name, 
  description, 
  price, 
  period,
  features, 
  isPopular = false, 
  cta, 
  variant, 
  delay,
  accentColor
}: PricingPlanProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-2xl p-8 shadow-sm border ${isPopular ? 'border-[#0fae96] shadow-lg relative' : 'border-gray-100'} flex flex-col h-full`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#0fae96] text-white px-5 py-1.5 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-end">
          <span className="text-5xl font-extrabold">{price}</span>
          <span className="text-gray-500 ml-2 mb-1.5">/{period}</span>
        </div>
      </div>
      
      <div className="mb-8 flex-grow">
        <p className="text-sm text-gray-500 mb-4 font-medium">INCLUDES:</p>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`mr-3 h-5 w-5 ${feature.available ? accentColor : 'text-gray-300'} flex-shrink-0`} />
              <span className={`text-gray-600 ${!feature.available && 'text-gray-400 line-through'}`}>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        variant={variant as any} 
        className={`
          ${variant === 'primary' 
            ? `bg-[#0fae96] hover:bg-[#0fae96]/90 text-white` 
            : variant === 'outline' 
              ? 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900' 
              : ''}
          transition-colors rounded-full py-6 ${isPopular ? 'shadow-md' : ''}
        `}
      >
        {cta} {isPopular && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small websites and blogs",
      price: "$29",
      period: "month",
      features: [
        { text: "Up to 100 pages scanned", available: true },
        { text: "Weekly automated scans", available: true },
        { text: "Basic compliance reporting", available: true },
        { text: "Email support", available: true },
        { text: "Automated fixes", available: false },
        { text: "PDF export", available: false }
      ],
      cta: "Get Started",
      variant: "outline" as const,
      accentColor: "text-primary"
    },
    {
      name: "Professional",
      description: "For growing businesses and e-commerce",
      price: "$49",
      period: "month",
      features: [
        { text: "Up to 500 pages scanned", available: true },
        { text: "Daily automated scans", available: true },
        { text: "Advanced compliance reporting", available: true },
        { text: "Automated fixes with suggestions", available: true },
        { text: "Priority email and chat support", available: true },
        { text: "PDF & CSV exports", available: true }
      ],
      isPopular: true,
      cta: "Get Started",
      variant: "primary" as const,
      accentColor: "text-[#0fae96]"
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex needs",
      price: "$99",
      period: "month",
      features: [
        { text: "Unlimited pages scanned", available: true },
        { text: "Real-time compliance monitoring", available: true },
        { text: "Custom reporting & dashboards", available: true },
        { text: "Advanced API access", available: true },
        { text: "Dedicated account manager", available: true },
        { text: "Legal compliance documentation", available: true }
      ],
      cta: "Contact Sales",
      variant: "outline" as const,
      accentColor: "text-primary"
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="bg-[#e0f5f1] text-[#0fae96] border-0 rounded-full px-4 py-1 mb-6">
            Choose a package
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No hidden fees or complicated tiers. Choose the plan that's right for your business.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              isPopular={plan.isPopular}
              cta={plan.cta}
              variant={plan.variant}
              delay={0.1 * index}
              accentColor={plan.accentColor}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-600 mb-4">Need a custom solution for your enterprise organization?</p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full">
            Contact our sales team <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
