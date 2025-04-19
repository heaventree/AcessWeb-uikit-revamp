import React, { useState } from 'react';
import { Save, Code, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ShopifySettings } from '../../types/integrations';
import { shopifyAPI } from '../../lib/integrations/shopify';

interface ShopifyThemeEditorProps {
  settings: ShopifySettings;
  file: {
    key: string;
    value: string;
  };
  onSave: () => void;
}

export function ShopifyThemeEditor({ settings, file, onSave }: ShopifyThemeEditorProps) {
  const [content, setContent] = useState(file.value);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${settings.shop}/admin/api/2024-01/themes/${settings.theme.id}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': settings.accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            asset: {
              key: file.key,
              value: content
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      toast.success('Changes saved successfully');
      onSave();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Code className="w-5 h-5 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              {file.key}
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreview(!preview)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {preview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-300px)]">
        {/* Editor */}
        <div className={`${preview ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
          <div className="h-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-50 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="w-1/2">
            <div className="h-full p-4 overflow-auto">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Press Ctrl + S to save
          </div>
          <div className="text-sm text-gray-500">
            {content.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}