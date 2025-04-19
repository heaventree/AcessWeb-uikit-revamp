@@ .. @@
 import { ShopifySettings } from '../../../types/integrations';
 import { ShopifyAutoFix } from '../../../components/integrations/ShopifyAutoFix';
 import { ShopifyVisualization } from '../../../components/integrations/ShopifyVisualization';
+import { ShopifyThemeCustomizer } from '../../../components/integrations/ShopifyThemeCustomizer';
 
 interface ShopifyDashboardProps {
   settings: ShopifySettings;
 }
 
 export function ShopifyDashboard({ settings }: ShopifyDashboardProps) {
   const [activeTab, setActiveTab] = useState<'overview' | 'fixes' | 'theme'>('overview');
   
   return (
     <div className="page-container">
       <div className="content-container">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-4">
             Shopify Dashboard
           </h1>
           <p className="text-lg text-gray-600">
             Monitor and improve your Shopify store's accessibility
           </p>
         </div>
         
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
           <div className="border-b border-gray-200">
             <nav className="flex -mb-px">
               <button
                 onClick={() => setActiveTab('overview')}
                 className={`px-6 py-4 text-sm font-medium ${
                   activeTab === 'overview'
                     ? 'border-b-2 border-blue-500 text-blue-600'
                     : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Overview
               </button>
               <button
                 onClick={() => setActiveTab('fixes')}
                 className={`px-6 py-4 text-sm font-medium ${
                   activeTab === 'fixes'
                     ? 'border-b-2 border-blue-500 text-blue-600'
                     : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Auto-Fixes
               </button>
               <button
                 onClick={() => setActiveTab('theme')}
                 className={`px-6 py-4 text-sm font-medium ${
                   activeTab === 'theme'
                     ? 'border-b-2 border-blue-500 text-blue-600'
                     : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Theme Editor
               </button>
             </nav>
           </div>
           
           <div className="p-6">
             {activeTab === 'overview' && <ShopifyVisualization />}
             {activeTab === 'fixes' && <ShopifyAutoFix />}
             {activeTab === 'theme' && <ShopifyThemeCustomizer />}
           </div>
         </div>
       </div>
     </div>
   );
 }