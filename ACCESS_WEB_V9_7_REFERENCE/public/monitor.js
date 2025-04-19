// Accessibility Monitor Script
(function() {
  class AccessibilityMonitor {
    constructor(config) {
      this.apiKey = config.apiKey;
      this.siteId = config.siteId;
      this.baseUrl = 'https://api.wcag-tester.stackblitz.io';
      this.interval = config.interval || 'weekly';
      this.initialized = false;
    }

    async init() {
      if (this.initialized) return;
      
      try {
        // Register page load
        await this.sendHeartbeat();
        
        // Set up mutation observer for dynamic content
        this.setupMutationObserver();
        
        // Set up periodic checks
        this.setupPeriodicChecks();
        
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize accessibility monitor:', error);
      }
    }

    async sendHeartbeat() {
      try {
        const response = await fetch(`${this.baseUrl}/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({
            siteId: this.siteId,
            url: window.location.href,
            timestamp: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error('Heartbeat failed');
        }
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }

    setupMutationObserver() {
      // Debounce function to prevent too many API calls
      let timeout;
      const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.sendHeartbeat(), 2000);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    setupPeriodicChecks() {
      // Store last check time in localStorage
      const lastCheck = localStorage.getItem(`wcag_last_check_${this.siteId}`);
      const now = new Date().getTime();

      if (!lastCheck || this.shouldCheck(lastCheck, now)) {
        this.requestFullScan();
      }
    }

    shouldCheck(lastCheck, now) {
      const timeDiff = now - parseInt(lastCheck);
      switch (this.interval) {
        case 'daily':
          return timeDiff >= 24 * 60 * 60 * 1000;
        case 'weekly':
          return timeDiff >= 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return timeDiff >= 30 * 24 * 60 * 60 * 1000;
        default:
          return false;
      }
    }

    async requestFullScan() {
      try {
        const response = await fetch(`${this.baseUrl}/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({
            siteId: this.siteId,
            url: window.location.href
          })
        });

        if (response.ok) {
          localStorage.setItem(
            `wcag_last_check_${this.siteId}`, 
            new Date().getTime().toString()
          );
        }
      } catch (error) {
        console.error('Failed to request scan:', error);
      }
    }
  }

  // Initialize the monitor
  window.WCAGMonitor = {
    init: function(config) {
      const monitor = new AccessibilityMonitor(config);
      monitor.init();
    }
  };
})();