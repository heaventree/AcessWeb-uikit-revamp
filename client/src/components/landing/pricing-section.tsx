import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  isPopular?: boolean;
  cta: string;
  variant: "default" | "primary" | "outline";
  delay: number;
}

function PricingPlan({ 
  name, 
  description, 
  price, 
  features, 
  isPopular = false, 
  cta, 
  variant, 
  delay 
}: PricingPlanProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-xl p-8 shadow-sm border ${isPopular ? 'border-2 border-primary shadow-xl relative transform scale-105' : 'border-gray-100'} flex flex-col`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`mt-1 mr-3 h-4 w-4 ${feature.available ? 'text-green-500' : 'text-gray-300'}`} />
            <span className="text-gray-600">{feature.text}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={variant as any} 
        className={`
          ${variant === 'primary' 
            ? 'bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white shadow-lg' 
            : variant === 'outline' 
              ? 'border-primary text-primary hover:bg-primary hover:text-white' 
              : ''}
          transition-colors
        `}
      >
        {cta}
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
      description: "For small websites and blogs",
      price: "$49",
      features: [
        { text: "Up to 100 pages", available: true },
        { text: "Weekly scans", available: true },
        { text: "Basic reporting", available: true },
        { text: "Email support", available: true },
        { text: "Automated fixes", available: false }
      ],
      cta: "Get Started",
      variant: "outline" as const
    },
    {
      name: "Professional",
      description: "For growing businesses",
      price: "$149",
      features: [
        { text: "Up to 500 pages", available: true },
        { text: "Daily scans", available: true },
        { text: "Advanced reporting", available: true },
        { text: "Automated fixes", available: true },
        { text: "Priority support", available: true }
      ],
      isPopular: true,
      cta: "Get Started",
      variant: "primary" as const
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "$399",
      features: [
        { text: "Unlimited pages", available: true },
        { text: "Real-time monitoring", available: true },
        { text: "Custom reporting", available: true },
        { text: "API access", available: true },
        { text: "Dedicated account manager", available: true }
      ],
      cta: "Contact Sales",
      variant: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your business
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular}
              cta={plan.cta}
              variant={plan.variant}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Need a custom solution for your organization?</p>
          <a href="#" className="text-primary font-medium hover:underline">
            Contact our sales team <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
