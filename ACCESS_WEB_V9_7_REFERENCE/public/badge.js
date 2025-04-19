// Accessibility Badge Script
(function() {
  // Create unique class names to avoid conflicts
  const uniquePrefix = 'wcag-compliance-badge-' + Math.random().toString(36).substring(7);
  const badgeClass = `${uniquePrefix}-badge`;
  const containerClass = `${uniquePrefix}-container`;

  // Create and inject styles with unique selectors
  const style = document.createElement('style');
  style.textContent = `
    /* Container to handle stacking context */
    .${containerClass} {
      position: fixed;
      bottom: 20px;
      left: 20px; /* Moved from right to left */
      z-index: 2147483647; /* Highest possible z-index */
      pointer-events: none; /* Allow clicking through the container */
    }

    /* Badge styles */
    .${badgeClass} {
      display: inline-flex;
      align-items: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      background: #059669;
      color: #ffffff !important; /* Force color to ensure visibility */
      padding: 8px 12px;
      border-radius: 9999px;
      text-decoration: none !important; /* Prevent style overrides */
      transition: transform 0.2s ease, opacity 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
      pointer-events: auto; /* Re-enable pointer events */
      cursor: pointer;
      border: none !important; /* Prevent border overrides */
      max-width: calc(100vw - 40px); /* Prevent overflow */
      box-sizing: border-box; /* Ensure padding is included in width */
      transform-origin: right bottom;
    }

    /* Hover and focus states */
    .${badgeClass}:hover {
      opacity: 0.95;
      transform: translateY(-2px);
      color: #ffffff !important;
      text-decoration: none !important;
      background: #047857;
    }

    .${badgeClass}:focus {
      outline: 2px solid #ffffff;
      outline-offset: 2px;
      opacity: 0.95;
    }

    /* Icon styles */
    .${badgeClass} svg {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      flex-shrink: 0;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Text styles */
    .${badgeClass} span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Mobile optimization */
    @media (max-width: 640px) {
      .${containerClass} {
        bottom: 70px; /* Avoid mobile navigation bars */
        left: 10px; /* Moved from right to left */
      }

      .${badgeClass} {
        font-size: 12px;
        padding: 6px 10px;
      }

      .${badgeClass} svg {
        width: 14px;
        height: 14px;
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .${badgeClass} {
        transition: none;
      }
    }

    /* Print styles */
    @media print {
      .${containerClass} {
        display: none;
      }
    }
  `;

  // Create container for proper stacking context
  const container = document.createElement('div');
  container.className = containerClass;

  // Create badge element
  const badge = document.createElement('a');
  const script = document.currentScript;
  const siteId = script?.getAttribute('data-site-id');
  
  badge.href = `https://wcag-tester.stackblitz.io/verify/${siteId}`;
  badge.className = badgeClass;
  badge.target = '_blank';
  badge.rel = 'noopener noreferrer';
  badge.setAttribute('aria-label', 'WCAG 2.1 Compliance Badge - Click to verify');
  badge.setAttribute('role', 'link');
  
  badge.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>WCAG 2.1 Compliant</span>
  `;

  // Function to inject the badge
  const injectBadge = () => {
    // Remove any existing badges
    const existingContainer = document.querySelector(`.${containerClass}`);
    if (existingContainer) {
      existingContainer.remove();
    }

    // Inject new styles and badge
    if (!document.head.querySelector(`style[data-badge="${uniquePrefix}"]`)) {
      style.setAttribute('data-badge', uniquePrefix);
      document.head.appendChild(style);
    }

    container.appendChild(badge);
    document.body.appendChild(container);
  };

  // Handle badge injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBadge);
  } else {
    injectBadge();
  }

  // Handle dynamic theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'class' && 
          mutation.target === document.documentElement) {
        const isDark = document.documentElement.classList.contains('dark');
        badge.style.background = isDark ? '#059669' : '#059669';
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Expose verification method
  window.verifyWCAGCompliance = async () => {
    try {
      const response = await fetch(`https://wcag-tester.stackblitz.io/api/verify/${siteId}`);
      const data = await response.json();
      return data.isCompliant;
    } catch (error) {
      console.error('Failed to verify WCAG compliance:', error);
      return false;
    }
  };
})();