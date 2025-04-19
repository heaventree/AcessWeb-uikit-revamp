/**
 * Platform-specific implementations for applying accessibility fixes
 */

import { 
  ApplyResult, 
  FixPayload, 
  FixStatus, 
  PlatformImplementation, 
  RevertResult, 
  Website, 
  WordPressSite 
} from './types';

/**
 * Get the platform-specific implementation based on the website platform
 */
export function getPlatformImplementation(platform: string): PlatformImplementation {
  switch (platform) {
    case 'wordpress':
      return new WordPressImplementation();
    case 'generic':
      return new GenericImplementation();
    default:
      return new GenericImplementation();
  }
}

/**
 * WordPress-specific implementation
 */
export class WordPressImplementation implements PlatformImplementation {
  /**
   * Apply an accessibility fix to a WordPress site
   */
  async applyFix(site: Website, fix: FixPayload): Promise<ApplyResult> {
    // Ensure site is a WordPress site
    if (site.platform !== 'wordpress') {
      return { 
        success: false, 
        error: 'Site is not a WordPress site' 
      };
    }
    
    const wpSite = site as WordPressSite;
    
    try {
      // Get existing custom CSS
      const existingCSS = await this.getCustomCSS(wpSite);
      
      // Generate the CSS for the fix
      const fixCSS = this.generateFixCSS(fix);
      
      // Append the fix CSS to the existing CSS
      const newCSS = existingCSS + '\n\n' + fixCSS;
      
      // Update the custom CSS
      const result = await this.updateCustomCSS(wpSite, newCSS);
      
      if (result.success) {
        // Track the fix application in our system
        await this.trackFixApplication(wpSite, fix);
        
        return {
          success: true,
          fixId: fix.id
        };
      } else {
        return {
          success: false,
          error: result.error || 'Unknown error updating custom CSS'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Revert an accessibility fix from a WordPress site
   */
  async revertFix(site: Website, fixId: string): Promise<RevertResult> {
    // Ensure site is a WordPress site
    if (site.platform !== 'wordpress') {
      return { 
        success: false, 
        error: 'Site is not a WordPress site' 
      };
    }
    
    const wpSite = site as WordPressSite;
    
    try {
      // Get existing custom CSS
      const existingCSS = await this.getCustomCSS(wpSite);
      
      // Define a regex pattern to match the fix block
      const fixPattern = new RegExp(
        `\\/\\* WCAG Fix ID: ${fixId} \\*\\/[\\s\\S]*?\\/\\* End Fix: ${fixId} \\*\\/`,
        'g'
      );
      
      // Check if the fix exists in the CSS
      if (!fixPattern.test(existingCSS)) {
        return {
          success: false,
          error: `Fix with ID ${fixId} not found in custom CSS`
        };
      }
      
      // Remove the fix block from the CSS
      const newCSS = existingCSS.replace(fixPattern, '');
      
      // Update the custom CSS
      const result = await this.updateCustomCSS(wpSite, newCSS);
      
      if (result.success) {
        // Track the fix reversion in our system
        await this.trackFixReversion(wpSite, fixId);
        
        return {
          success: true,
          fixId
        };
      } else {
        return {
          success: false,
          error: result.error || 'Unknown error updating custom CSS'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * List all fixes applied to a WordPress site
   */
  async listAppliedFixes(site: Website): Promise<FixPayload[]> {
    // Ensure site is a WordPress site
    if (site.platform !== 'wordpress') {
      return [];
    }
    
    const wpSite = site as WordPressSite;
    
    try {
      // Get existing custom CSS
      const existingCSS = await this.getCustomCSS(wpSite);
      
      // Extract all fix blocks
      const fixes: FixPayload[] = [];
      const fixBlockRegex = /\/\* WCAG Fix ID: ([\w-]+) \*\/[\s\S]*?\/\* Description: (.*?) \*\/[\s\S]*?\/\* WCAG Criteria: (.*?) \*\/[\s\S]*?\/\* Applied: (.*?) \*\/[\s\S]*?([\s\S]*?)\/\* End Fix: \1 \*\//g;
      
      let match;
      while ((match = fixBlockRegex.exec(existingCSS)) !== null) {
        const [fullMatch, id, description, criteriaStr, appliedAt, cssContent] = match;
        
        // Extract the selector and properties from the CSS content
        const selectorRegex = /([\s\S]*?)\s*\{([\s\S]*?)\}/;
        const cssMatch = selectorRegex.exec(cssContent.trim());
        
        if (cssMatch) {
          const [, selector, propertiesStr] = cssMatch;
          
          // Extract CSS properties
          const propertiesRegex = /\s*([\w-]+)\s*:\s*(.*?)\s*(!important)?;/g;
          const cssProperties = [];
          
          let propMatch;
          while ((propMatch = propertiesRegex.exec(propertiesStr)) !== null) {
            const [, name, value] = propMatch;
            cssProperties.push({ name, value });
          }
          
          // Create the fix payload
          fixes.push({
            id,
            targetSelector: selector.trim(),
            cssProperties,
            wcagCriteria: criteriaStr.split(',').map(c => c.trim()),
            description,
            createdAt: appliedAt, // Using appliedAt as createdAt since we don't store creation time separately
            appliedAt,
            metadata: {}
          });
        }
      }
      
      return fixes;
    } catch (error) {
      console.error('Error listing applied fixes:', error);
      return [];
    }
  }
  
  /**
   * Get the status of a fix on a WordPress site
   */
  async getFixStatus(site: Website, fixId: string): Promise<FixStatus> {
    // Ensure site is a WordPress site
    if (site.platform !== 'wordpress') {
      return FixStatus.ERROR;
    }
    
    const wpSite = site as WordPressSite;
    
    try {
      // Get existing custom CSS
      const existingCSS = await this.getCustomCSS(wpSite);
      
      // Check if the fix exists in the CSS
      const fixPattern = new RegExp(
        `\\/\\* WCAG Fix ID: ${fixId} \\*\\/`,
        'g'
      );
      
      if (fixPattern.test(existingCSS)) {
        return FixStatus.APPLIED;
      } else {
        return FixStatus.NOT_APPLIED;
      }
    } catch (error) {
      console.error('Error getting fix status:', error);
      return FixStatus.ERROR;
    }
  }
  
  /**
   * Generate CSS with comments for a fix
   */
  private generateFixCSS(fix: FixPayload): string {
    return `
/* WCAG Fix ID: ${fix.id} */
/* Description: ${fix.description} */
/* WCAG Criteria: ${fix.wcagCriteria.join(', ')} */
/* Applied: ${fix.appliedAt || new Date().toISOString()} */
${fix.targetSelector} {
  ${fix.cssProperties.map(prop => `${prop.name}: ${prop.value} !important;`).join('\n  ')}
}
/* End Fix: ${fix.id} */
`.trim();
  }
  
  /**
   * Get custom CSS from a WordPress site
   */
  private async getCustomCSS(site: WordPressSite): Promise<string> {
    // In a real implementation, this would use the WordPress REST API
    // to get the existing custom CSS. For now, we'll simulate it.
    
    // TODO: Replace with actual WordPress REST API call
    // Example:
    // const response = await fetch(`${site.apiUrl}/wp/v2/settings`, {
    //   headers: {
    //     Authorization: `Basic ${btoa(`${site.credentials.username}:${site.credentials.applicationPassword}`)}`
    //   }
    // });
    // const settings = await response.json();
    // return settings.custom_css || '';
    
    // Simulate API call for now
    return localStorage.getItem(`wp_custom_css_${site.id}`) || '';
  }
  
  /**
   * Update custom CSS for a WordPress site
   */
  private async updateCustomCSS(site: WordPressSite, newCSS: string): Promise<{success: boolean, error?: string}> {
    // In a real implementation, this would use the WordPress REST API
    // to update the custom CSS. For now, we'll simulate it.
    
    // TODO: Replace with actual WordPress REST API call
    // Example:
    // const response = await fetch(`${site.apiUrl}/wp/v2/settings`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Basic ${btoa(`${site.credentials.username}:${site.credentials.applicationPassword}`)}`
    //   },
    //   body: JSON.stringify({
    //     custom_css: newCSS
    //   })
    // });
    
    // if (response.ok) {
    //   return { success: true };
    // } else {
    //   const error = await response.json();
    //   return { success: false, error: error.message || 'Unknown error' };
    // }
    
    // Simulate API call for now
    try {
      localStorage.setItem(`wp_custom_css_${site.id}`, newCSS);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Track fix application in our system
   */
  private async trackFixApplication(site: WordPressSite, fix: FixPayload): Promise<void> {
    // In a real implementation, this would track the fix in a database
    // For now, we'll simulate it using localStorage
    
    const trackingKey = `fix_tracking_${site.id}`;
    const tracking = JSON.parse(localStorage.getItem(trackingKey) || '{}');
    
    tracking[fix.id] = {
      fixId: fix.id,
      siteId: site.id,
      appliedAt: fix.appliedAt || new Date().toISOString(),
      status: 'applied'
    };
    
    localStorage.setItem(trackingKey, JSON.stringify(tracking));
  }
  
  /**
   * Track fix reversion in our system
   */
  private async trackFixReversion(site: WordPressSite, fixId: string): Promise<void> {
    // In a real implementation, this would track the fix reversion in a database
    // For now, we'll simulate it using localStorage
    
    const trackingKey = `fix_tracking_${site.id}`;
    const tracking = JSON.parse(localStorage.getItem(trackingKey) || '{}');
    
    if (tracking[fixId]) {
      tracking[fixId].status = 'reverted';
      tracking[fixId].revertedAt = new Date().toISOString();
    }
    
    localStorage.setItem(trackingKey, JSON.stringify(tracking));
  }
}

/**
 * Generic implementation for non-WordPress sites
 */
export class GenericImplementation implements PlatformImplementation {
  async applyFix(site: Website, fix: FixPayload): Promise<ApplyResult> {
    // Implementation for generic sites would go here
    // For now, return a not implemented error
    return {
      success: false,
      error: 'Generic site implementation not yet available'
    };
  }
  
  async revertFix(site: Website, fixId: string): Promise<RevertResult> {
    // Implementation for generic sites would go here
    // For now, return a not implemented error
    return {
      success: false,
      error: 'Generic site implementation not yet available'
    };
  }
  
  async listAppliedFixes(site: Website): Promise<FixPayload[]> {
    // Implementation for generic sites would go here
    // For now, return an empty array
    return [];
  }
  
  async getFixStatus(site: Website, fixId: string): Promise<FixStatus> {
    // Implementation for generic sites would go here
    // For now, return not applied
    return FixStatus.NOT_APPLIED;
  }
}