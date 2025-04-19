import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Github, 
  Send,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f9fdff] pt-24 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Newsletter signup */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-3">Stay updated on accessibility</h3>
                <p className="text-gray-600">
                  Get the latest accessibility news, compliance tips, and product updates delivered to your inbox.
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-full px-5 py-6 border-gray-200 flex-grow"
                    required
                  />
                  <Button type="submit" className="rounded-full bg-[#0fae96] hover:bg-[#0fae96]/90 py-6 whitespace-nowrap">
                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-1 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#e0f5f1] flex items-center justify-center mr-1">
                  <CheckCircle className="w-4 h-4 text-[#0fae96]" />
                </div>
                <span className="text-lg font-bold text-gray-900">AccessWeb<span className="text-[#0fae96]">Pro</span></span>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Making web accessibility compliance simple, automated, and accessible for organizations of all sizes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#f4f7fa] flex items-center justify-center text-gray-500 hover:bg-[#0fae96] hover:text-white transition-colors">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#f4f7fa] flex items-center justify-center text-gray-500 hover:bg-[#0fae96] hover:text-white transition-colors">
                  <Linkedin size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#f4f7fa] flex items-center justify-center text-gray-500 hover:bg-[#0fae96] hover:text-white transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#f4f7fa] flex items-center justify-center text-gray-500 hover:bg-[#0fae96] hover:text-white transition-colors">
                  <Github size={16} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-5">Product</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#features" className="hover:text-[#0fae96] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#0fae96] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-5">Resources</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">WCAG Guidelines</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Accessibility Tools</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Support Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-5">Company</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0fae96] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AccessWebPro. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="text-gray-500 hover:text-[#0fae96] text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-[#0fae96] text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-[#0fae96] text-sm transition-colors">Cookies</a>
              <a href="#" className="text-gray-500 hover:text-[#0fae96] text-sm transition-colors">Accessibility Statement</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
