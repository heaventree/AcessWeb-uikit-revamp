import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Bot, 
  Wrench, 
  BarChart, 
  Globe, 
  Code, 
  Clock 
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bulletPoints: string[];
  bgColor: string;
  iconColor: string;
  index: number;
}

function FeatureCard({ icon, title, description, bulletPoints, bgColor, iconColor, index }: FeatureProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="bg-white p-8 rounded-xl shadow-sm transition-all duration-300 border border-gray-100 hover:shadow-lg hover:-translate-y-1"
    >
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-6`}>
        <div className={`${iconColor} text-xl`}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 text-sm text-gray-600">
        {bulletPoints.map((point, i) => (
          <li key={i} className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function FeatureSection() {
  const features = [
    {
      icon: <Bot />,
      title: "Automated Testing",
      description: "Scan your entire website automatically for WCAG 2.1 compliance issues",
      bulletPoints: [
        "AI-powered scanning engine",
        "Comprehensive issue detection",
        "Scheduled automatic scans"
      ],
      bgColor: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      icon: <Wrench />,
      title: "Real-time Fixes",
      description: "Get instant recommendations and code snippets to fix accessibility issues",
      bulletPoints: [
        "One-click fix application",
        "Code snippet recommendations",
        "Guided remediation steps"
      ],
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: <BarChart />,
      title: "Detailed Reports",
      description: "Generate comprehensive reports for stakeholders and compliance records",
      bulletPoints: [
        "WCAG criteria breakdown",
        "Exportable compliance documents",
        "Progress tracking dashboard"
      ],
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <Globe />,
      title: "Global Standards",
      description: "Support for WCAG 2.1, Section 508, ADA, and international standards",
      bulletPoints: [
        "Multi-standard compliance checks",
        "Regional requirement support",
        "Legal compliance guidance"
      ],
      bgColor: "bg-red-100",
      iconColor: "text-red-500"
    },
    {
      icon: <Code />,
      title: "API Access",
      description: "Integrate accessibility testing into your development workflow",
      bulletPoints: [
        "RESTful API integration",
        "CI/CD pipeline compatibility",
        "Custom webhook notifications"
      ],
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: <Clock />,
      title: "24/7 Monitoring",
      description: "Continuous monitoring to catch accessibility issues before users do",
      bulletPoints: [
        "Real-time accessibility alerts",
        "Content update scanning",
        "Downtime accessibility checks"
      ],
      bgColor: "bg-blue-100",
      iconColor: "text-primary"
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for WCAG Compliance</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive accessibility testing and monitoring in one powerful platform
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bulletPoints={feature.bulletPoints}
              bgColor={feature.bgColor}
              iconColor={feature.iconColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
