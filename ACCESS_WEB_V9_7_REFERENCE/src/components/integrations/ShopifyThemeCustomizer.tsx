import React, { useState, useEffect } from 'react';
import { FileCode, Folder, ChevronRight, ChevronDown, RefreshCw, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ShopifySettings } from '../../types/integrations';
import { shopifyAPI } from '../../lib/integrations/shopify';
import { ShopifyThemeEditor } from './ShopifyThemeEditor';

interface ThemeAsset {
  key: string;
  value?: string;
  size?: number;
  content_type?: string;
  public_url?: string;
}

interface ShopifyThemeCustomizerProps {
  settings: ShopifySettings;
}

export function ShopifyThemeCustomizer({ settings }: ShopifyThemeCustomizerProps) {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<ThemeAsset[]>([]);
  const [selectedFile, setSelectedFile] = useState<ThemeAsset | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadThemeAssets();
  }, []);

  const loadThemeAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${settings.shop}/admin/api/2024-01/themes/${settings.theme.id}/assets.json`,
        {
          headers: {
            'X-Shopify-Access-Token': settings.accessToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load theme assets');
      }

      const data = await response.json();
      setAssets(data.assets);
    } catch (error) {
      toast.error('Failed to load theme assets');
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (asset: ThemeAsset) => {
    try {
      const response = await fetch(
        `https://${settings.shop}/admin/api/2024-01/themes/${settings.theme.id}/assets.json?asset[key]=${asset.key}`,
        {
          headers: {
            'X-Shopify-Access-Token': settings.accessToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load file content');
      }

      const data = await response.json();
      setSelectedFile({ ...asset, value: data.asset.value });
    } catch (error) {
      toast.error('Failed to load file content');
    }
  };

  const getFolderStructure = () => {
    const structure: Record<string, ThemeAsset[]> = {};
    
    assets.forEach(asset => {
      const parts = asset.key.split('/');
      const folder = parts.length > 1 ? parts[0] : '';
      
      if (!structure[folder]) {
        structure[folder] = [];
      }
      structure[folder].push(asset);
    });

    return structure;
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = async (asset: ThemeAsset) => {
    if (asset.content_type?.startsWith('text/') || 
        asset.key.endsWith('.js') || 
        asset.key.endsWith('.css') || 
        asset.key.endsWith('.liquid')) {
      await loadFileContent(asset);
    } else {
      toast.error('Binary files cannot be edited');
    }
  };

  const folderStructure = getFolderStructure();

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* File Browser */}
      <div className="w-64 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Theme Files</h3>
        </div>
        
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {/* Root files */}
              {folderStructure['']?.map(asset => (
                <button
                  key={asset.key}
                  onClick={() => handleFileSelect(asset)}
                  className={`w-full text-left px-2 py-1 rounded text-sm ${
                    selectedFile?.key === asset.key
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileCode className="w-4 h-4 inline-block mr-2" />
                  {asset.key}
                </button>
              ))}

              {/* Folders */}
              {Object.entries(folderStructure)
                .filter(([folder]) => folder !== '')
                .map(([folder, files]) => (
                  <div key={folder}>
                    <button
                      onClick={() => toggleFolder(folder)}
                      className="w-full text-left px-2 py-1 rounded text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {expandedFolders.has(folder) ? (
                        <ChevronDown className="w-4 h-4 inline-block mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 inline-block mr-2" />
                      )}
                      <Folder className="w-4 h-4 inline-block mr-2" />
                      {folder}
                    </button>

                    {expandedFolders.has(folder) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {files.map(asset => (
                          <button
                            key={asset.key}
                            onClick={() => handleFileSelect(asset)}
                            className={`w-full text-left px-2 py-1 rounded text-sm ${
                              selectedFile?.key === asset.key
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <FileCode className="w-4 h-4 inline-block mr-2" />
                            {asset.key.split('/').pop()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {selectedFile ? (
          <ShopifyThemeEditor
            settings={settings}
            file={selectedFile}
            onSave={loadThemeAssets}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a file to edit
          </div>
        )}
      </div>
    </div>
  );
}