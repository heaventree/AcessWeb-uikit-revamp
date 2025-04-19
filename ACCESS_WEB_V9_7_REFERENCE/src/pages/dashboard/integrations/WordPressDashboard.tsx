@@ .. @@
 import { WordPressSettings } from '../../../types/integrations';
 import { WordPressAutoFix } from '../../../components/integrations/WordPressAutoFix';
 import { WordPressVisualization } from '../../../components/integrations/WordPressVisualization';
+import { WordPressPluginSetup } from '../../../components/integrations/WordPressPluginSetup';
 
 interface WordPressDashboardProps {
   settings: WordPressSettings;
 }
 
 export function WordPressDashboard({ settings }: WordPressDashboardProps) {
   const [activeTab, setActiveTab] = useState<'overview' | 'fixes' | 'plugin'>('overview');
   
   return (
     <div className="page-container">
       <div className="content-container">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-4">
             WordPress Dashboard
           </h1>
           <p className="text-lg text-gray-600">
             Monitor and improve your WordPress site's accessibility
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
                 onClick={() => setActiveTab('plugin')}
                 className={`px-6 py-4 text-sm font-medium ${
                   activeTab === 'plugin'
                     ? 'border-b-2 border-blue-500 text-blue-600'
                     : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Plugin Setup
               </button>
             </nav>
           </div>
           
           <div className="p-6">
             {activeTab === 'overview' && <WordPressVisualization />}
             {activeTab === 'fixes' && <WordPressAutoFix />}
             {activeTab === 'plugin' && <WordPressPluginSetup />}
           </div>
         </div>
       </div>
     </div>
   );
 }