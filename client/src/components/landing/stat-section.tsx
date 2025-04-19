import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

function StatCard({ value, label, delay }: StatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counted, setCounted] = useState(false);
  
  useEffect(() => {
    if (isInView && !counted) {
      setCounted(true);
    }
  }, [isInView, counted]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm text-center group relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{value}</div>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
}

export default function StatSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="99%" label="Accuracy Rate" delay={0} />
          <StatCard value="5M+" label="Pages Scanned" delay={0.1} />
          <StatCard value="10k+" label="Happy Customers" delay={0.2} />
          <StatCard value="24/7" label="Monitoring" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
