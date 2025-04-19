/**
 * Accessibility Fix Dashboard Component
 * 
 * This component provides an admin interface for managing non-destructive
 * accessibility fixes across websites.
 */

import React, { useState, useEffect } from 'react';
import { 
  fixEngine, 
  FixPayload, 
  Website, 
  WordPressSite,
  FixStatus
} from '../../lib/accessibility-fixes';

interface AccessibilityFixDashboardProps {
  sites?: Website[];
}

/**
 * Dashboard for managing accessibility fixes
 */
export function AccessibilityFixDashboard({ sites = [] }: AccessibilityFixDashboardProps) {
  const [selectedSite, setSelectedSite] = useState<Website | null>(null);
  const [appliedFixes, setAppliedFixes] = useState<FixPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load applied fixes when site is selected
  useEffect(() => {
    if (selectedSite) {
      loadAppliedFixes(selectedSite);
    } else {
      setAppliedFixes([]);
    }
  }, [selectedSite]);
  
  // Load applied fixes for a site
  const loadAppliedFixes = async (site: Website) => {
    setLoading(true);
    setError(null);
    
    try {
      const fixes = await fixEngine.listAppliedFixes(site);
      setAppliedFixes(fixes);
    } catch (err) {
      setError('Failed to load applied fixes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Revert a fix
  const revertFix = async (fixId: string) => {
    if (!selectedSite) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await fixEngine.revertFix(selectedSite, fixId);
      
      if (result.success) {
        setSuccess(`Successfully reverted fix ${fixId}`);
        
        // Reload applied fixes
        loadAppliedFixes(selectedSite);
      } else {
        setError(`Failed to revert fix: ${result.error}`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Sample fix (for demo purposes)
  const applySampleFix = async () => {
    if (!selectedSite) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Create a sample fix for contrast
      const sampleFix: FixPayload = {
        id: `fix-${Date.now()}`,
        targetSelector: 'p, h1, h2, h3, h4, h5, h6',
        cssProperties: [
          { name: 'color', value: '#000000' }
        ],
        wcagCriteria: ['1.4.3'],
        description: 'Sample contrast fix for demonstration',
        createdAt: new Date().toISOString(),
        metadata: {
          sampleFix: true
        }
      };
      
      const result = await fixEngine.applyFix(selectedSite, sampleFix);
      
      if (result.success) {
        setSuccess(`Successfully applied fix ${result.fixId}`);
        
        // Reload applied fixes
        loadAppliedFixes(selectedSite);
      } else {
        setError(`Failed to apply fix: ${result.error}`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Non-Destructive Accessibility Fix Dashboard</h2>
      
      {/* Site Selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Select Website</label>
        <select 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedSite?.id || ''}
          onChange={(e) => {
            const site = sites.find(s => s.id === e.target.value);
            setSelectedSite(site || null);
          }}
        >
          <option value="">-- Select a website --</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>
              {site.name} ({site.url})
            </option>
          ))}
        </select>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {/* Demo Controls */}
      {selectedSite && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Actions</h3>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
            onClick={applySampleFix}
            disabled={loading}
          >
            Apply Sample Fix
          </button>
          
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            onClick={() => loadAppliedFixes(selectedSite)}
            disabled={loading}
          >
            Refresh Fixes
          </button>
        </div>
      )}
      
      {/* Applied Fixes List */}
      {selectedSite && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Applied Fixes</h3>
          
          {loading && <p className="text-gray-500">Loading...</p>}
          
          {!loading && appliedFixes.length === 0 && (
            <p className="text-gray-500">No fixes have been applied to this website yet.</p>
          )}
          
          {!loading && appliedFixes.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WCAG Criteria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appliedFixes.map(fix => (
                    <tr key={fix.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fix.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fix.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fix.wcagCriteria.join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(fix.appliedAt || fix.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          onClick={() => revertFix(fix.id)}
                          disabled={loading}
                        >
                          Revert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* CSS Preview */}
      {selectedSite && appliedFixes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">CSS Preview</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-gray-100 text-sm overflow-x-auto">
              {appliedFixes.map(fix => `
/* WCAG Fix ID: ${fix.id} */
/* Description: ${fix.description} */
/* WCAG Criteria: ${fix.wcagCriteria.join(', ')} */
/* Applied: ${fix.appliedAt || fix.createdAt} */
${fix.targetSelector} {
  ${fix.cssProperties.map(prop => `  ${prop.name}: ${prop.value} !important;`).join('\n')}
}
/* End Fix: ${fix.id} */
              `).join('\n')}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}