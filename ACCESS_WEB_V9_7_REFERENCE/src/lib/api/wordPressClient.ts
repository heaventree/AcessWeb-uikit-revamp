/**
 * WordPress API Client
 */

import ApiClient, { RequestOptions } from '../../utils/apiClient';
import { WordPressSettings, WordPressPluginResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/apiErrors';

export default class WordPressApiClient extends ApiClient {
  private apiKey: string;
  private settings: WordPressSettings;

  constructor(settings: WordPressSettings) {
    // Extract site URL with validation
    if (!settings.siteUrl) {
      throw new ValidationError('WordPress site URL is required');
    }

    // Ensure site URL has the right format
    let baseUrl = settings.siteUrl;
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    baseUrl += 'wp-json/accessweb/v1';

    // Set up API client with authentication
    super(baseUrl, {
      'X-API-KEY': settings.apiKey,
      'Content-Type': 'application/json',
    });

    this.apiKey = settings.apiKey;
    this.settings = settings;
  }

  /**
   * Verifies the WordPress API connection and plugin installation
   */
  async verifyConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.get<WordPressPluginResponse>('status');
      return {
        success: response.success,
        message: response.message || 'Connection successful',
      };
    } catch (error) {
      console.error('WordPress connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to WordPress site',
      };
    }
  }

  /**
   * Tests the WordPress site for accessibility issues
   */
  async scanSite(options?: { 
    path?: string;
    level?: 'A' | 'AA' | 'AAA';
    includeHidden?: boolean;
  }): Promise<ScanResult> {
    try {
      // Create a new scan
      const scanResponse = await this.post<WordPressPluginResponse>('scan', {
        path: options?.path || '/',
        level: options?.level || 'AA',
        include_hidden: options?.includeHidden || false,
      });

      if (!scanResponse.success) {
        throw new Error(scanResponse.message || 'Failed to start scan');
      }

      const scanId = scanResponse.data?.scan_id;
      if (!scanId) {
        throw new Error('No scan ID returned from WordPress');
      }

      // For demo purposes, we'll return a pending scan result
      // In a real implementation, we'd poll for the scan status
      return {
        id: scanId,
        url: `${this.settings.siteUrl}${options?.path || '/'}`,
        startTime: new Date().toISOString(),
        endTime: '',
        status: 'pending',
        progress: 0,
      };
    } catch (error) {
      console.error('WordPress scan error:', error);
      throw error;
    }
  }

  /**
   * Gets a specific scan result
   */
  async getScanResult(scanId: string): Promise<ScanResult> {
    try {
      const response = await this.get<WordPressPluginResponse>(`scan/${scanId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get scan result');
      }

      const scanData = response.data?.scan;
      if (!scanData) {
        throw new Error('No scan data returned from WordPress');
      }

      // Map the WordPress response to our standard ScanResult format
      return {
        id: scanId,
        url: scanData.url || this.settings.siteUrl || '',
        startTime: scanData.start_time || new Date().toISOString(),
        endTime: scanData.end_time || '',
        status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
        progress: scanData.progress || 0,
        summary: scanData.summary,
        items: scanData.items,
      };
    } catch (error) {
      console.error('WordPress get scan result error:', error);
      throw error;
    }
  }

  /**
   * Fix an accessibility issue
   */
  async fixIssue(scanId: string, issueId: string): Promise<{ 
    success: boolean; 
    message: string; 
    fixed: boolean;
  }> {
    try {
      const response = await this.post<WordPressPluginResponse>(`fix/${scanId}/${issueId}`, {});
      
      return {
        success: response.success,
        message: response.message || 'Issue fix attempted',
        fixed: response.data?.fixed || false,
      };
    } catch (error) {
      console.error('WordPress fix issue error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fix issue',
        fixed: false,
      };
    }
  }

  /**
   * Update WordPress plugin settings
   */
  async updateSettings(newSettings: Partial<WordPressSettings>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Filter out the API key, which can't be updated this way
      const { apiKey, ...updatableSettings } = newSettings;
      
      const response = await this.post<WordPressPluginResponse>('settings', updatableSettings);
      
      // Update local settings if successful
      if (response.success) {
        this.settings = {
          ...this.settings,
          ...updatableSettings,
        };
      }
      
      return {
        success: response.success,
        message: response.message || 'Settings updated successfully',
      };
    } catch (error) {
      console.error('WordPress update settings error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update settings',
      };
    }
  }
}