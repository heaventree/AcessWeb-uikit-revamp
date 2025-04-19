import type { WordPressSettings, WordPressPluginResponse, ScanResult } from '../../types/integrations';
import { storageService } from '../storage';

// Cache duration constants (in milliseconds)
const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000,       // 5 minutes
  MEDIUM: 30 * 60 * 1000,     // 30 minutes
  LONG: 24 * 60 * 60 * 1000,  // 24 hours
};

// Cache management helpers
const cacheManager = {
  async get<T>(key: string): Promise<{ data: T; timestamp: number } | null> {
    const cached = await storageService.getItem<{ data: T; timestamp: number }>(key);
    return cached;
  },
  
  async set<T>(key: string, data: T): Promise<void> {
    await storageService.setItem(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  async getWithExpiry<T>(key: string, maxAge: number): Promise<T | null> {
    const cached = await this.get<T>(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > maxAge;
    return isExpired ? null : cached.data;
  },
  
  async invalidate(keyPrefix: string): Promise<void> {
    // This is a simple implementation that would need to be expanded
    // based on how the storage service works
    console.log(`Invalidating cache with prefix: ${keyPrefix}`);
    // In a real implementation, we would list all keys with the prefix and remove them
  }
};

export const wordPressAPI = {
  // Helper function to get base URL
  getBaseUrl(siteUrl: string): string {
    // Ensure URL has proper format
    let baseUrl = siteUrl;
    if (!baseUrl.startsWith('http')) {
      baseUrl = 'https://' + baseUrl;
    }
    // Remove trailing slash if present
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    return baseUrl;
  },

  // Check if WordPress site has the plugin installed
  async checkPluginInstalled(siteUrl: string): Promise<boolean> {
    try {
      // Check for plugin existence via WP REST API
      const baseUrl = this.getBaseUrl(siteUrl);
      const pluginCheckUrl = `${baseUrl}/wp-json/access-web/v1/status`;

      const response = await fetch(pluginCheckUrl, {
        method: 'GET'
      });

      // If we get a 200 response, plugin is installed
      return response.ok;
    } catch (error) {
      console.error('Plugin check error:', error);
      return false;
    }
  },

  // Get WordPress site info with caching
  async getSiteInfo(siteUrl: string, apiKey: string): Promise<any> {
    try {
      // Generate a cache key for this specific site
      const cacheKey = `site_info_${siteUrl}`;
      
      // Try to get data from cache first
      const cachedData = await cacheManager.getWithExpiry<any>(cacheKey, CACHE_DURATIONS.MEDIUM);
      if (cachedData) {
        console.log('Using cached site info');
        return cachedData;
      }
      
      // If not in cache or expired, fetch fresh data
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/wp-json/access-web/v1/site-info`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get site info: ${response.statusText}`);
      }

      // Get the data and store in cache before returning
      const data = await response.json();
      await cacheManager.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Get site info error:', error);
      return null;
    }
  },

  // Enhanced API Key Validation
  async validateAPIKey(apiKey: string, siteUrl?: string): Promise<boolean> {
    // If no siteUrl or apiKey provided, fallback to dev mode validation
    if (!apiKey || !siteUrl) {
      try {
        // Simulate API validation for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      } catch (error) {
        return false;
      }
    }

    try {
      // Build the WordPress REST API URL
      const baseUrl = this.getBaseUrl(siteUrl);
      const url = `${baseUrl}/wp-json/access-web/v1/validate`;

      // Make the request with API key authentication
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`WordPress API responded with status ${response.status}`);
        return false;
      }
      
      const data = await response.json();
      return data?.success === true && data?.data?.valid === true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  },

  // Settings Management - keeps compatibility with existing code
  async saveSettings(settings: WordPressSettings): Promise<WordPressPluginResponse> {
    try {
      // Save settings locally
      await storageService.setItem('wordpress_settings', settings);
      
      // If we have a site URL, try to sync settings with WordPress
      if (settings.siteUrl && settings.apiKey) {
        try {
          const result = await this.apiRequest<any>(
            'POST',
            `${this.getBaseUrl(settings.siteUrl)}/wp-json/access-web/v1/settings`,
            settings.apiKey,
            {
              autofixEnabled: settings.autofixEnabled,
              monitoringEnabled: settings.monitoringEnabled,
              monitoringInterval: settings.monitoringInterval,
              scanLevel: settings.scanLevel,
              notifyOnIssue: settings.notifyOnIssue,
              emailNotifications: settings.emailNotifications
            }
          );
          
          if (result?.success) {
            return {
              success: true,
              message: 'Settings saved and synced with WordPress',
              data: { scan: settings }
            };
          }
        } catch (syncError) {
          console.warn('Could not sync settings with WordPress, saved locally only', syncError);
        }
      }
      
      return {
        success: true,
        message: 'Settings saved successfully',
        data: { scan: settings }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save settings'
      };
    }
  },

  async getSettings(apiKey?: string): Promise<WordPressSettings | null> {
    // Generate a cache key based on the API key if provided, otherwise use a generic one
    const cacheKey = apiKey ? `wordpress_settings_${apiKey}` : 'wordpress_settings';
    
    // Try to get settings from cache first with short expiry time 
    // (short expiry because settings may change frequently)
    const cachedSettings = await cacheManager.getWithExpiry<WordPressSettings>(cacheKey, CACHE_DURATIONS.SHORT);
    if (cachedSettings) {
      console.log('Using cached WordPress settings');
      return cachedSettings;
    }
    
    // If not in cache, get from local storage as a fallback
    const localSettings = await storageService.getItem<WordPressSettings>('wordpress_settings');
    
    // If we have settings and a siteUrl, try to fetch updated settings from WordPress
    if (localSettings && localSettings.siteUrl && localSettings.apiKey) {
      try {
        const result = await this.apiRequest<any>(
          'GET',
          `${this.getBaseUrl(localSettings.siteUrl)}/wp-json/access-web/v1/settings`,
          localSettings.apiKey
        );
        
        if (result?.success && result?.data) {
          // Merge remote settings with local settings
          const mergedSettings: WordPressSettings = {
            ...localSettings,
            ...result.data
          };
          
          // Update both cache and local storage with fresh data
          await cacheManager.set(cacheKey, mergedSettings);
          await storageService.setItem('wordpress_settings', mergedSettings);
          return mergedSettings;
        }
      } catch (error) {
        console.warn('Could not fetch settings from WordPress, using local settings', error);
      }
    }
    
    // If we got here but have local settings, cache them for next time
    if (localSettings) {
      await cacheManager.set(cacheKey, localSettings);
    }
    
    return localSettings || null;
  },

  // Scan Management - maintains compatibility with existing implementations
  async startScan(apiKey: string, url: string): Promise<WordPressPluginResponse> {
    try {
      // Get settings to find site URL
      const settings = await this.getSettings(apiKey);
      
      if (settings && settings.siteUrl) {
        try {
          // Attempt to start scan via WordPress API
          const result = await this.apiRequest<any>(
            'POST',
            `${this.getBaseUrl(settings.siteUrl)}/wp-json/access-web/v1/scan`,
            apiKey,
            { target_url: url }
          );
          
          if (result?.success && result?.data?.scan_id) {
            // Store scan ID for tracking
            await storageService.setItem('current_scan_id', result.data.scan_id);
            
            return {
              success: true,
              message: 'Scan started successfully via WordPress API',
              data: { scan_id: result.data.scan_id }
            };
          }
        } catch (apiError) {
          console.warn('Could not start scan via WordPress API, falling back to simulation', apiError);
        }
      }
      
      // Fallback to simulation for development/testing
      const scanId = Date.now().toString();
      await storageService.setItem('current_scan_id', scanId);
      
      return {
        success: true,
        message: 'Scan started successfully (simulated)',
        data: { scan_id: scanId }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start scan'
      };
    }
  },

  async getScanResults(scanId: string): Promise<ScanResult | null> {
    // Get settings to find site URL and API key
    const settings = await storageService.getItem<WordPressSettings>('wordpress_settings');
    
    if (settings && settings.siteUrl && settings.apiKey) {
      try {
        // Attempt to get scan results from WordPress API
        const result = await this.apiRequest<any>(
          'GET',
          `${this.getBaseUrl(settings.siteUrl)}/wp-json/access-web/v1/scan/${scanId}`,
          settings.apiKey
        );
        
        if (result?.success && result?.data?.scan) {
          // Map API response to ScanResult
          const apiScan = result.data.scan;
          const scanResult: ScanResult = {
            id: scanId,
            url: apiScan.url || '',
            startTime: apiScan.start_time || new Date().toISOString(),
            endTime: apiScan.end_time || '',
            status: apiScan.status || 'pending',
            progress: apiScan.progress || 0,
            summary: apiScan.summary,
            items: apiScan.items
          };
          
          // Cache results
          await storageService.setItem('scan_results', scanResult);
          return scanResult;
        }
      } catch (apiError) {
        console.warn('Could not fetch scan results from WordPress API, falling back to cached data', apiError);
      }
    }
    
    // Fallback to local storage for development/testing
    return storageService.getItem<ScanResult>('scan_results');
  },

  // Auto-Fix Management
  async applyAutoFixes(scanId: string): Promise<WordPressPluginResponse> {
    try {
      // Get settings to find site URL and API key
      const settings = await storageService.getItem<WordPressSettings>('wordpress_settings');
      
      if (settings && settings.siteUrl && settings.apiKey) {
        try {
          // Attempt to apply fixes via WordPress API
          const result = await this.apiRequest<any>(
            'POST',
            `${this.getBaseUrl(settings.siteUrl)}/wp-json/access-web/v1/fix/${scanId}`,
            settings.apiKey
          );
          
          if (result?.success) {
            return {
              success: true,
              message: result.message || 'Auto-fixes applied successfully via WordPress API',
              data: { fixed: true }
            };
          }
        } catch (apiError) {
          console.warn('Could not apply fixes via WordPress API, falling back to simulation', apiError);
        }
      }
      
      // Fallback to simulation for development/testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: 'Auto-fixes applied successfully (simulated)',
        data: { fixed: true }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to apply fixes'
      };
    }
  },

  // Enhanced error handling wrapper for API calls
  async apiRequest<T>(
    method: string,
    endpoint: string,
    apiKey: string,
    body?: any
  ): Promise<T | null> {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        // Log detailed error information
        console.error(`WordPress API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error details:', errorText);

        // Handle specific error statuses
        switch (response.status) {
          case 401:
            throw new Error('Authentication failed. Please check your API key.');
          case 404:
            throw new Error('WordPress site not found or plugin not installed correctly.');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          default:
            throw new Error(`API request failed with status ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`API request error (${method} ${endpoint}):`, error);
      return null;
    }
  },

  // Monitoring Widget - maintained for backward compatibility
  getMonitoringScript(apiKey: string): string {
    return `
      <script>
        window.WCAGMonitor = {
          init: function(config) {
            // Initialize monitoring
            const script = document.createElement('script');
            script.src = '/monitor.js';
            script.dataset.apiKey = '${apiKey}';
            script.async = true;
            document.head.appendChild(script);
          }
        };
      </script>
    `.trim();
  },

  // Badge Management - maintained for backward compatibility
  getBadgeScript(apiKey: string): string {
    return `
      <script>
        window.WCAGBadge = {
          init: function(config) {
            // Initialize badge
            const script = document.createElement('script');
            script.src = '/badge.js';
            script.dataset.apiKey = '${apiKey}';
            script.async = true;
            document.head.appendChild(script);
          }
        };
      </script>
    `.trim();
  }
};