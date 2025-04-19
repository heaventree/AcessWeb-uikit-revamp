import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, FileCode, Check, RotateCcw, Layers, History, Shield, Database, Wrench } from 'lucide-react';

export function NonDestructiveFixPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Non-Destructive Accessibility Fixes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Safe, reversible fixes that make your website accessible without changing your source code
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <Shield className="h-10 w-10 text-emerald-600 mr-4" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-gray-900">Safe Implementation</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Our non-destructive approach means we never modify your website's source code. 
              Instead, we apply carefully crafted CSS fixes that improve accessibility without 
              risking site stability or breaking existing functionality.
            </p>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-800 mb-2">Key Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>No risk of introducing bugs or breaking site functionality</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>Works with any website technology stack or CMS</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>Can be applied immediately without development cycles</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <RotateCcw className="h-10 w-10 text-blue-600 mr-4" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-gray-900">Fully Reversible</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Every accessibility fix we apply can be instantly reversed with a single click. 
              This gives you complete control and confidence, allowing you to revert any change 
              that doesn't meet your expectations or needs.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Reversion Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>One-click reversion of individual fixes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>Detailed fix history with timestamps</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5" aria-hidden="true" />
                  <span>Ability to revert all changes at once if needed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-lg font-medium text-gray-900">The Process</span>
            </div>
          </div>
          
          <div className="mt-10 max-w-4xl mx-auto">
            <ol className="space-y-10">
              <li className="relative pl-10">
                <div className="absolute top-0 left-0 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Issue Detection</h3>
                <p className="text-gray-600 mb-4">
                  Our accessibility scanner identifies WCAG compliance issues on your website, 
                  detecting everything from missing alt text to keyboard navigation problems.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileCode className="h-5 w-5 text-gray-700 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Example Issue:</span>
                  </div>
                  <code className="block text-sm bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    Low contrast text: Text with color #777777 on background #EEEEEE has a contrast ratio of 2.9:1, below the WCAG AA minimum of 4.5:1
                  </code>
                </div>
              </li>
              
              <li className="relative pl-10">
                <div className="absolute top-0 left-0 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fix Generation</h3>
                <p className="text-gray-600 mb-4">
                  Our system generates appropriate CSS-based fixes that address the specific issue 
                  without modifying your HTML, JavaScript, or other source code.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-gray-700 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Generated CSS Fix:</span>
                  </div>
                  <code className="block text-sm bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    /* WCAG Fix ID: contrast-4587 */
{`
.blog-content p {
  color: #333333 !important; /* Improved from #777777 for better contrast */
}
`}
                  </code>
                </div>
              </li>
              
              <li className="relative pl-10">
                <div className="absolute top-0 left-0 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Non-Destructive Implementation</h3>
                <p className="text-gray-600 mb-4">
                  The fix is applied through our platform integrations, injecting the CSS into your site 
                  through our WordPress plugin, Shopify app, or custom API implementation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                    <img src="/images/wordpress-logo.svg" alt="WordPress" className="h-12 mb-3" />
                    <h4 className="font-medium text-gray-900">WordPress Integration</h4>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Uses our custom plugin to add fixes to your theme
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                    <img src="/images/shopify-logo.svg" alt="Shopify" className="h-12 mb-3" />
                    <h4 className="font-medium text-gray-900">Shopify App</h4>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Injects fixes through Liquid theme assets
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                    <Database className="h-12 w-12 text-gray-700 mb-3" aria-hidden="true" />
                    <h4 className="font-medium text-gray-900">Custom API</h4>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      REST API for any custom website implementation
                    </p>
                  </div>
                </div>
              </li>
              
              <li className="relative pl-10">
                <div className="absolute top-0 left-0 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">4</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fix Management & Monitoring</h3>
                <p className="text-gray-600 mb-4">
                  All applied fixes are tracked in our dashboard where you can monitor their effectiveness, 
                  revert individual fixes if needed, and see your site's improved accessibility score.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <History className="h-5 w-5 text-gray-700 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">Fix Management Features:</span>
                  </div>
                  <ul className="space-y-2 mt-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" aria-hidden="true" />
                      <span>Detailed history of all applied fixes</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" aria-hidden="true" />
                      <span>One-click reversion capability</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" aria-hidden="true" />
                      <span>Before/after accessibility score comparison</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Architecture</h2>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <Layers className="h-10 w-10 text-indigo-600 mr-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-gray-900">How Our System Works</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">CSS-Based Fixes</h4>
                <p className="text-gray-600">
                  Our system generates specific CSS rules that target the elements with accessibility issues. 
                  These rules override only the problematic properties while leaving the rest of your styling intact.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Platform Integrations</h4>
                <p className="text-gray-600 mb-4">
                  We use different integration methods depending on your website platform:
                </p>
                <ul className="space-y-4">
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-1">WordPress Integration</h5>
                    <p className="text-gray-600">
                      Our WordPress plugin creates a custom CSS file that's loaded after your theme's 
                      stylesheets, ensuring our fixes take precedence. Each fix is wrapped in comments 
                      for easy identification and management.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-1">Shopify Integration</h5>
                    <p className="text-gray-600">
                      The Shopify app adds a new CSS asset to your theme that's loaded after your 
                      theme's main stylesheet. The asset is managed through Shopify's theme API to 
                      ensure seamless updates.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-1">Custom API Integration</h5>
                    <p className="text-gray-600">
                      Our REST API allows custom websites to fetch the latest accessibility fixes 
                      and apply them via JavaScript, a server-side include, or a CDN-cached resource.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Fix Storage and Versioning</h4>
                <p className="text-gray-600">
                  All fixes are stored in our secure database with full versioning. Each fix is 
                  tagged with metadata including the WCAG criteria addressed, the elements targeted, 
                  and timestamps for when it was created, applied, or reverted.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl shadow-lg p-8 text-white mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Wrench className="h-12 w-12 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-3xl font-bold mb-4">Ready to Fix Your Website's Accessibility?</h2>
            <p className="text-lg mb-8">
              Start improving your website's accessibility today with our non-destructive fix system.
              No code changes required and fully reversible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/pricing" 
                className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow hover:bg-gray-100 transition duration-150"
              >
                View Pricing
              </Link>
              <Link 
                to="/checker" 
                className="px-8 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow border border-indigo-500 hover:bg-indigo-800 transition duration-150"
              >
                Test Your Website
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Will these fixes impact my website's performance?</h3>
              <p className="text-gray-600">
                No. Our CSS fixes are lightweight and optimized for performance. They're typically just a few KB in size 
                and are loaded asynchronously to avoid impacting your website's loading speed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">What happens if I update my website design?</h3>
              <p className="text-gray-600">
                Our system continually monitors your website for changes. If your design changes, we'll detect any new 
                or resolved accessibility issues and update the fixes accordingly. You can also manually trigger a 
                rescan after major updates.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Can these fixes address all WCAG compliance issues?</h3>
              <p className="text-gray-600">
                Many accessibility issues can be addressed with CSS fixes, including contrast problems, text sizing, 
                focus indicators, and spacing issues. Some issues, like missing alt text or ARIA attributes, require 
                HTML changes. For these, our system will provide recommendations for your development team.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Is this approach ADA compliant?</h3>
              <p className="text-gray-600">
                Our non-destructive fixes help improve your website's compliance with WCAG guidelines, which are 
                referenced by the ADA. While no automated solution can guarantee 100% compliance, our approach 
                addresses many common accessibility issues and demonstrates a proactive commitment to accessibility.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">How do the WordPress and Shopify integrations work?</h3>
              <p className="text-gray-600">
                The WordPress plugin adds a custom stylesheet to your site and communicates with our platform API 
                to keep fixes updated. The Shopify app works similarly, adding a stylesheet through Shopify's theme 
                assets. Both can be installed in minutes without technical expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}