/**
 * Custom API Client for AccessWeb API
 */

import ApiClient, { RequestOptions } from '../../utils/apiClient';
import { CustomAPISettings, CustomAPIResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/apiErrors';

export default class CustomApiClient extends ApiClient {
  private apiKey: string;
  private settings: CustomAPISettings;

  constructor(settings: CustomAPISettings) {
    // Validate required settings
    if (!settings.baseUrl) {
      throw new ValidationError('API base URL is required');
    }

    if (!settings.apiKey) {
      throw new ValidationError('API key is required');
    }

    // Set up API client with authentication
    super(settings.baseUrl, {
      'X-API-KEY': settings.apiKey,
      'Content-Type': 'application/json',
    });

    this.apiKey = settings.apiKey;
    this.settings = settings;
  }

  /**
   * Verifies the API connection with the provided key
   */
  async verifyConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.get<CustomAPIResponse>('verify');
      return {
        success: response.success,
        message: response.message || 'API connection verified successfully',
      };
    } catch (error) {
      console.error('API connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify API connection',
      };
    }
  }

  /**
   * Get API usage information
   */
  async getUsage(): Promise<{ 
    totalRequests: number; 
    remainingRequests: number;
    resetAt: string;
  }> {
    try {
      const response = await this.get<CustomAPIResponse>('usage');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get API usage information');
      }

      return {
        totalRequests: response.data.total_requests || 0,
        remainingRequests: response.data.remaining_requests || 0,
        resetAt: response.data.reset_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting API usage:', error);
      throw error;
    }
  }

  /**
   * Start a scan on a specific URL
   */
  async scanUrl(url: string, options?: {
    level?: 'A' | 'AA' | 'AAA';
    includeHidden?: boolean;
    maxDepth?: number;
    ignoreRobots?: boolean;
  }): Promise<ScanResult> {
    try {
      // Validate URL
      if (!url) {
        throw new ValidationError('URL to scan is required');
      }

      // Start the scan
      const scanResponse = await this.post<CustomAPIResponse>('scan', {
        url,
        level: options?.level || 'AA',
        include_hidden: options?.includeHidden || false,
        max_depth: options?.maxDepth || 1,
        ignore_robots: options?.ignoreRobots || false,
      });

      if (!scanResponse.success) {
        throw new Error(scanResponse.message || 'Failed to start scan');
      }

      const scanId = scanResponse.data?.scan_id;
      if (!scanId) {
        throw new Error('No scan ID returned from API');
      }

      // For demo purposes, we'll return a pending scan result
      // In a real implementation, we'd poll for the scan status
      return {
        id: scanId,
        url,
        startTime: new Date().toISOString(),
        endTime: '',
        status: 'pending',
        progress: 0,
      };
    } catch (error) {
      console.error('Error starting scan:', error);
      throw error;
    }
  }

  /**
   * Get scan result by ID
   */
  async getScanResult(scanId: string): Promise<ScanResult> {
    try {
      const response = await this.get<CustomAPIResponse>(`scans/${scanId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get scan result');
      }

      const scanData = response.data?.scan;
      if (!scanData) {
        throw new Error('No scan data returned from API');
      }

      // Map the API response to our standard ScanResult format
      return {
        id: scanId,
        url: scanData.url || '',
        startTime: scanData.start_time || new Date().toISOString(),
        endTime: scanData.end_time || '',
        status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
        progress: scanData.progress || 0,
        summary: scanData.summary,
        items: scanData.items,
      };
    } catch (error) {
      console.error('Error getting scan result:', error);
      throw error;
    }
  }

  /**
   * Get all completed scans
   */
  async getScans(options?: { 
    limit?: number; 
    offset?: number;
    status?: 'pending' | 'running' | 'completed' | 'failed';
  }): Promise<{
    scans: ScanResult[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await this.get<CustomAPIResponse>('scans', {
        limit: options?.limit || 10,
        offset: options?.offset || 0,
        status: options?.status,
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get scans');
      }

      return {
        scans: response.data.scans || [],
        total: response.data.total || 0,
        hasMore: response.data.has_more || false,
      };
    } catch (error) {
      console.error('Error getting scans:', error);
      throw error;
    }
  }

  /**
   * Register a webhook
   */
  async registerWebhook(url: string, events: string[]): Promise<{ 
    id: string; 
    secret: string;
  }> {
    try {
      // Validate parameters
      if (!url) {
        throw new ValidationError('Webhook URL is required');
      }

      if (!events || events.length === 0) {
        throw new ValidationError('At least one event must be specified');
      }

      // Register the webhook
      const response = await this.post<CustomAPIResponse>('webhooks', {
        url,
        events,
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to register webhook');
      }

      return {
        id: response.data.webhook_id,
        secret: response.data.secret,
      };
    } catch (error) {
      console.error('Error registering webhook:', error);
      throw error;
    }
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<boolean> {
    try {
      const response = await this.delete<CustomAPIResponse>(`webhooks/${webhookId}`);
      return response.success;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      return false;
    }
  }

  /**
   * List all webhooks
   */
  async getWebhooks(): Promise<{ 
    id: string; 
    url: string; 
    events: string[];
    active: boolean;
    created: string;
  }[]> {
    try {
      const response = await this.get<CustomAPIResponse>('webhooks');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get webhooks');
      }

      return response.data.webhooks || [];
    } catch (error) {
      console.error('Error getting webhooks:', error);
      return [];
    }
  }
}