import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Activity,
  BarChart4, 
  Check,
  Shield, 
  Code2, 
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      className="bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 hover:shadow-lg h-full"
    >
      <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-6`}>
        <div className={`${iconColor} w-6 h-6`}>{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3">
        {bulletPoints.map((point, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 mr-3 text-[#0fae96] flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function FeatureSection() {
  const features = [
    {
      icon: <Activity />,
      title: "Automated Testing",
      description: "Scan your entire website automatically for WCAG 2.1 compliance issues",
      bulletPoints: [
        "AI-powered scanning engine with up to 97% accuracy",
        "Comprehensive issue detection across all pages",
        "Scheduled automatic scans at your preferred frequency"
      ],
      bgColor: "bg-[#e0f5f1]",
      iconColor: "text-[#0fae96]"
    },
    {
      icon: <Shield />,
      title: "Real-time Fixes",
      description: "Get instant recommendations and code snippets to fix accessibility issues",
      bulletPoints: [
        "One-click fix application with rollback options",
        "Code snippet recommendations for developer implementation",
        "Guided remediation steps with priority indicators"
      ],
      bgColor: "bg-[#e7f5ff]",
      iconColor: "text-primary"
    },
    {
      icon: <BarChart4 />,
      title: "Detailed Reports",
      description: "Generate comprehensive reports for stakeholders and compliance records",
      bulletPoints: [
        "WCAG criteria breakdown with severity indicators",
        "Exportable compliance documents in multiple formats",
        "Progress tracking dashboard with historical data"
      ],
      bgColor: "bg-[#eeeaff]",
      iconColor: "text-purple-600"
    },
    {
      icon: <RefreshCw />,
      title: "Continuous Monitoring",
      description: "Always-on monitoring to catch accessibility issues before users do",
      bulletPoints: [
        "Real-time accessibility alerts via email, Slack, or SMS",
        "Content update scanning triggered by site changes",
        "Downtime accessibility validation and reporting"
      ],
      bgColor: "bg-[#ffede8]",
      iconColor: "text-orange-500"
    },
    {
      icon: <Code2 />,
      title: "Developer Tools",
      description: "Integrate accessibility testing into your development workflow",
      bulletPoints: [
        "RESTful API integration with comprehensive documentation",
        "CI/CD pipeline compatibility for pre-deployment testing",
        "Custom webhook notifications for your tech stack"
      ],
      bgColor: "bg-[#fef8e0]",
      iconColor: "text-yellow-600"
    },
    {
      icon: <Shield />,
      title: "Legal Compliance",
      description: "Support for global accessibility standards and legal requirements",
      bulletPoints: [
        "Coverage for WCAG 2.1, Section 508, ADA, and AODA",
        "Legal compliance documentation and audit trails",
        "Expert guidance on regional accessibility requirements"
      ],
      bgColor: "bg-[#e5f4ff]",
      iconColor: "text-blue-500"
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 bg-[#f9fdff]">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="bg-[#e0f5f1] text-[#0fae96] border-0 rounded-full px-4 py-1 mb-6">
            Unleash advanced capabilities
          </Badge>
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
