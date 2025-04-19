/**
 * Shopify API Client
 */

import ApiClient, { RequestOptions } from '../../utils/apiClient';
import { ShopifySettings, ShopifyAppResponse, ScanResult } from '../../types/integrations';
import { ValidationError } from '../../utils/apiErrors';

export default class ShopifyApiClient extends ApiClient {
  private accessToken: string;
  private settings: ShopifySettings;

  constructor(settings: ShopifySettings) {
    // Validate required settings
    if (!settings.shopDomain) {
      throw new ValidationError('Shopify shop domain is required');
    }

    if (!settings.accessToken) {
      throw new ValidationError('Shopify access token is required');
    }

    // Format shop domain for API requests
    let domain = settings.shopDomain.trim().toLowerCase();
    // Remove protocol if present
    domain = domain.replace(/^https?:\/\//, '');
    // Remove trailing slash if present
    domain = domain.replace(/\/$/, '');

    // Set up API client with authentication
    super(`https://${domain}/admin/api/2023-10`, {
      'X-Shopify-Access-Token': settings.accessToken,
      'Content-Type': 'application/json',
    });

    this.accessToken = settings.accessToken;
    this.settings = settings;
  }

  /**
   * Verifies the Shopify API connection and app installation
   */
  async verifyConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Test by getting shop information
      const response = await this.get<ShopifyAppResponse>('shop.json');
      return {
        success: true,
        message: 'Connected to Shopify store successfully',
      };
    } catch (error) {
      console.error('Shopify connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to Shopify store',
      };
    }
  }

  /**
   * Get the current theme ID if not already specified in settings
   */
  async getCurrentThemeId(): Promise<string> {
    // If we already have a theme ID in settings, use that
    if (this.settings.currentThemeId) {
      return this.settings.currentThemeId;
    }

    try {
      // Get all themes
      const response = await this.get<{ themes: { id: number; role: string }[] }>('themes.json');
      
      // Find the main theme (published/active)
      const mainTheme = response.themes.find(theme => theme.role === 'main');
      
      if (!mainTheme) {
        throw new Error('No main theme found in Shopify store');
      }
      
      // Update settings with the theme ID
      this.settings.currentThemeId = String(mainTheme.id);
      return this.settings.currentThemeId;
    } catch (error) {
      console.error('Error getting current theme ID:', error);
      throw error;
    }
  }

  /**
   * Scans a Shopify theme for accessibility issues
   */
  async scanTheme(options?: {
    themeId?: string;
    level?: 'A' | 'AA' | 'AAA';
  }): Promise<ScanResult> {
    try {
      // Get the theme ID to scan
      const themeId = options?.themeId || await this.getCurrentThemeId();
      
      // Request a scan from Shopify app
      const scanResponse = await this.post<ShopifyAppResponse>('accessibility/scan', {
        theme_id: themeId,
        level: options?.level || 'AA',
      });

      if (!scanResponse.success) {
        throw new Error(scanResponse.message || 'Failed to start scan');
      }

      const scanId = scanResponse.data?.scan_id;
      if (!scanId) {
        throw new Error('No scan ID returned from Shopify app');
      }

      // For demo purposes, we'll return a pending scan result
      // In a real implementation, we'd poll for the scan status
      return {
        id: scanId,
        url: `https://${this.settings.shopDomain}/`,
        startTime: new Date().toISOString(),
        endTime: '',
        status: 'pending',
        progress: 0,
      };
    } catch (error) {
      console.error('Shopify scan error:', error);
      throw error;
    }
  }

  /**
   * Gets a specific scan result
   */
  async getScanResult(scanId: string): Promise<ScanResult> {
    try {
      const response = await this.get<ShopifyAppResponse>(`accessibility/scan/${scanId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get scan result');
      }

      const scanData = response.data?.scan;
      if (!scanData) {
        throw new Error('No scan data returned from Shopify app');
      }

      // Map the Shopify response to our standard ScanResult format
      return {
        id: scanId,
        url: `https://${this.settings.shopDomain}/`,
        startTime: scanData.start_time || new Date().toISOString(),
        endTime: scanData.end_time || '',
        status: scanData.status as 'pending' | 'running' | 'completed' | 'failed',
        progress: scanData.progress || 0,
        summary: scanData.summary,
        items: scanData.items,
      };
    } catch (error) {
      console.error('Shopify get scan result error:', error);
      throw error;
    }
  }

  /**
   * Fix an accessibility issue in a Shopify theme
   */
  async fixIssue(scanId: string, issueId: string): Promise<{ 
    success: boolean; 
    message: string; 
    fixed: boolean; 
    backup?: string;
  }> {
    try {
      const response = await this.post<ShopifyAppResponse>(`accessibility/fix/${scanId}/${issueId}`, {
        create_backup: this.settings.createBackups || true,
      });
      
      return {
        success: response.success,
        message: response.message || 'Issue fix attempted',
        fixed: response.data?.fixed || false,
        backup: response.data?.backup_theme_id,
      };
    } catch (error) {
      console.error('Shopify fix issue error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fix issue',
        fixed: false,
      };
    }
  }
  
  /**
   * Get a list of available theme backups
   */
  async getBackups(): Promise<{ id: string; name: string; created: string }[]> {
    try {
      const response = await this.get<ShopifyAppResponse>('accessibility/backups');
      
      if (!response.success || !response.data?.backups) {
        return [];
      }
      
      return response.data.backups;
    } catch (error) {
      console.error('Error getting backups:', error);
      return [];
    }
  }
  
  /**
   * Restore a theme from a backup
   */
  async restoreBackup(backupId: string): Promise<{ 
    success: boolean; 
    message: string;
  }> {
    try {
      const response = await this.post<ShopifyAppResponse>('accessibility/restore', {
        backup_id: backupId,
      });
      
      return {
        success: response.success,
        message: response.message || 'Backup restored successfully',
      };
    } catch (error) {
      console.error('Error restoring backup:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to restore backup',
      };
    }
  }

  /**
   * Update Shopify app settings
   */
  async updateSettings(newSettings: Partial<ShopifySettings>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Filter out sensitive settings that can't be updated this way
      const { accessToken, shopDomain, ...updatableSettings } = newSettings;
      
      const response = await this.post<ShopifyAppResponse>('accessibility/settings', updatableSettings);
      
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
      console.error('Shopify update settings error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update settings',
      };
    }
  }
}