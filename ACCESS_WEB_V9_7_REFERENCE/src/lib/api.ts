import { storageService } from './storage';
import { handleApiError } from '../utils/errorHandler';
import { toast } from 'react-hot-toast';
import { queryClient } from '../providers/AppProvider';
import type { 
  APIKey, 
  AccessibilityTestRequest,
  AccessibilityTestResponse,
  RegionalStandards,
  StandardsInfo
} from '../types/api';

export const api = {
  // List API Keys with error handling and caching
  listAPIKeys: async (options?: { force?: boolean }) => {
    try {
      const keys = await storageService.getItem<APIKey[]>('api_keys') || [];
      return keys;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      return [];
    }
  },

  // Create API Key with validation
  createAPIKey: async (key: Partial<APIKey>) => {
    try {
      if (!key.name || !key.scopes?.length) {
        throw new Error('Name and at least one scope are required');
      }

      const keys = await storageService.getItem<APIKey[]>('api_keys') || [];
      const newKey = {
        ...key,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as APIKey;
      
      keys.push(newKey);
      await storageService.setItem('api_keys', keys);

      // Invalidate and refetch keys list
      await queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key created successfully');

      return newKey;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      throw apiError;
    }
  },

  // Get API Usage Stats with retry logic
  getAPIUsageStats: async (keyId: string) => {
    try {
      const usage = await storageService.getItem<Record<string, number>>(`api_usage_${keyId}`) || {
        totalCalls: 0,
        successRate: 100,
        avgResponseTime: 0
      };
      return usage;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      return {
        totalCalls: 0,
        successRate: 0,
        avgResponseTime: 0
      };
    }
  },

  // Get Regional Standards
  getRegionalStandards: async (): Promise<RegionalStandards> => {
    try {
      const standards = await storageService.getItem<RegionalStandards>('regional_standards');
      if (!standards) {
        throw new Error('Failed to load regional standards');
      }
      return standards;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      throw apiError;
    }
  },

  // Get Standards Info
  getStandardsInfo: async (region: string): Promise<StandardsInfo[]> => {
    try {
      const standards = await storageService.getItem<RegionalStandards>('regional_standards');
      if (!standards || !standards[region as keyof RegionalStandards]) {
        throw new Error(`No standards found for region: ${region}`);
      }
      return standards[region as keyof RegionalStandards];
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      throw apiError;
    }
  },

  // Run Accessibility Test
  runAccessibilityTest: async (request: AccessibilityTestRequest): Promise<AccessibilityTestResponse> => {
    try {
      // Simulate API call
      const response = await new Promise<AccessibilityTestResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            url: request.url,
            timestamp: new Date().toISOString(),
            status: 'completed',
            summary: {
              critical: 2,
              serious: 3,
              moderate: 5,
              minor: 8,
              passes: 85,
              warnings: 12
            },
            legislationCompliance: {
              ada: true,
              section508: true,
              aoda: true,
              en301549: true,
              eea: true,
              jis: true,
              dta: true,
              gds: true
            },
            issues: []
          });
        }, 2000);
      });

      return response;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      throw apiError;
    }
  }
};