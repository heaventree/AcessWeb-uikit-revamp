import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accessibility,
  Minimize2,
  Type,
  Contrast,
  MousePointer,
  Moon,
  Volume2,
  X,
  ZoomIn
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
            className="bg-white shadow-xl rounded-2xl p-5 mb-4 border border-gray-100 w-72"
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#e0f5f1] flex items-center justify-center mr-2">
                  <Accessibility className="h-4 w-4 text-[#0fae96]" />
                </div>
                <h3 className="font-bold text-gray-900">Accessibility Tools</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-gray-100" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 mb-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 rounded-xl py-5 px-4 hover:border-[#0fae96] hover:text-[#0fae96]"
              >
                <ZoomIn className="h-4 w-4 mr-3" />
                Increase Font Size
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 rounded-xl py-5 px-4 hover:border-[#0fae96] hover:text-[#0fae96]"
              >
                <Contrast className="h-4 w-4 mr-3" />
                High Contrast Mode
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 rounded-xl py-5 px-4 hover:border-[#0fae96] hover:text-[#0fae96]"
              >
                <MousePointer className="h-4 w-4 mr-3" />
                Highlight Interactive Elements
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 rounded-xl py-5 px-4 hover:border-[#0fae96] hover:text-[#0fae96]"
              >
                <Volume2 className="h-4 w-4 mr-3" />
                Screen Reader Support
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-700 rounded-xl py-5 px-4 hover:border-[#0fae96] hover:text-[#0fae96]"
              >
                <Moon className="h-4 w-4 mr-3" />
                Reduce Motion
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              AccessWebPro provides these tools as part of our commitment to digital accessibility.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="bg-[#0fae96] hover:bg-[#0fae96]/90 text-white p-4 rounded-full shadow-lg"
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
