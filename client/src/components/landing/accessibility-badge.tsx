import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accessibility,
  Minimize2,
  Type,
  Contrast,
  MousePointer
} from "lucide-react";

export default function AccessibilityBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 w-64"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Accessibility Tools</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700"
              >
                <Type className="h-4 w-4 mr-2" />
                Increase Font Size
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700"
              >
                <Contrast className="h-4 w-4 mr-2" />
                High Contrast
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700"
              >
                <MousePointer className="h-4 w-4 mr-2" />
                Highlight Links
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility tools"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
