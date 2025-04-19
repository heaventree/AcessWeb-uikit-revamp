import type { Article } from '../../../types/blog';

export const wordpressIntegrationGuide: Article = {
  id: 'wordpress-integration-guide',
  slug: 'wordpress-integration-guide',
  title: 'WordPress Integration Guide: Step-by-Step Implementation',
  description: 'Complete guide to implementing accessibility testing in your WordPress site using our official plugin.',
  content: `
# WordPress Integration Guide: Step-by-Step Implementation

This comprehensive guide will walk you through setting up and configuring the AccessWeb WordPress plugin to improve the accessibility of your WordPress site. Our integration provides real-time scanning, issue detection, and automated fixes directly within WordPress.

## Quick Start

1. Download the AccessWeb plugin from the [WordPress Plugin Directory](https://wordpress.org/plugins/accessweb/) or upload the zip file directly in your WordPress admin.
2. Activate the plugin in the WordPress admin panel.
3. Navigate to AccessWeb → Settings and enter your API key.
4. Run your first accessibility scan from the AccessWeb dashboard.
5. View issues and apply recommended fixes.

## Detailed Installation Steps

### Manual Installation

1. Download the AccessWeb plugin zip file from our [website](https://accessweb.com/downloads/plugin).
2. Log in to your WordPress admin dashboard.
3. Navigate to Plugins → Add New → Upload Plugin.
4. Choose the downloaded zip file and click "Install Now".
5. After installation completes, click "Activate Plugin".

### Configuration

1. After activation, navigate to AccessWeb → Settings in your WordPress admin sidebar.
2. Enter your AccessWeb API key. If you don't have one, you can [generate an API key](https://app.accessweb.com/account/api-keys) from your AccessWeb account.
3. Configure scanning options:
   - Scan depth (how many pages deep to crawl)
   - Content types to include/exclude
   - Scan frequency
   - Auto-fix settings

4. Save your settings to complete the basic configuration.

### API Endpoints

The plugin adds the following REST API endpoints:

- \`/wp-json/access-web/v1/status\` - Check if the plugin is installed and active
- \`/wp-json/access-web/v1/site-info\` - Get information about the WordPress site
- \`/wp-json/access-web/v1/validate\` - Validate API key authentication
- \`/wp-json/access-web/v1/issues\` - Get all accessibility issues
- \`/wp-json/access-web/v1/issues/{id}\` - Get details for a specific issue
- \`/wp-json/access-web/v1/scan\` - Trigger a new accessibility scan
- \`/wp-json/access-web/v1/scan/{id}\` - Get scan results for a specific scan ID
- \`/wp-json/access-web/v1/stats\` - Get accessibility statistics
- \`/wp-json/access-web/v1/fix/{scan_id}\` - Apply fixes to issues from a specific scan
- \`/wp-json/access-web/v1/settings\` - Get or update plugin settings

## Advanced Features

### Performance Optimization with Response Caching

The AccessWeb integration includes an intelligent caching system to optimize performance and reduce API calls. This feature is particularly useful for large WordPress sites or sites with high traffic.

#### How Caching Works

- **Short-term cache (5 minutes)**: Used for frequently changing data like live scan results
- **Medium-term cache (30 minutes)**: Used for semi-static data like issue reports
- **Long-term cache (24 hours)**: Used for rarely changing data like site configuration

The caching system automatically manages cache invalidation when data is updated, ensuring you always have access to the most current information when needed, while minimizing unnecessary API calls.

### Accessibility Badge

Display your site's accessibility status with a customizable badge:

1. Navigate to AccessWeb → Badge Settings.
2. Choose a badge style and position.
3. Configure visibility options (which pages to show the badge on).
4. Enable or disable the accessibility statement link.
5. Save your changes.

### Content Editor Integration

The plugin adds accessibility checking directly to the WordPress editor:

1. Open any post or page in the WordPress editor.
2. Look for the AccessWeb icon in the editor toolbar.
3. Click it to scan your content for accessibility issues.
4. Review suggestions and apply fixes without leaving the editor.

## Webhook Integration

Set up webhooks to receive notifications when accessibility issues are detected:

1. Navigate to AccessWeb → Webhooks.
2. Click "Add Webhook".
3. Enter a name and the destination URL.
4. Select which events should trigger the webhook (new issues, fixed issues, scan completion).
5. Save your webhook configuration.

Example webhook payload:
\`\`\`json
{
  "event": "issue_detected",
  "site_url": "https://your-wordpress-site.com",
  "issue": {
    "id": "123",
    "type": "missing_alt_text",
    "location": "/about-us/",
    "element": "img",
    "severity": "critical"
  },
  "timestamp": "2024-03-22T14:30:00Z"
}
\`\`\`

## Best Practices

### Regular Scanning

Set up automated scanning to run at least weekly. For content-heavy sites that update frequently, consider daily scans.

### Prioritize Issues

Focus on fixing critical issues first:
1. Navigation problems
2. Form accessibility
3. Keyboard accessibility
4. Screen reader compatibility
5. Color contrast issues

### Test After Major Updates

Always run a scan after:
- Theme updates
- Plugin updates that affect the front end
- Major content changes
- Adding new templates or layout components

### Implement Fixes Incrementally

Rather than trying to fix everything at once:
1. Fix critical issues immediately
2. Schedule medium-severity issues for your next development sprint
3. Document minor issues for future improvements

## Troubleshooting

### Plugin Not Connecting

If the plugin can't connect to AccessWeb services:
- Verify your API key in the plugin settings
- Check if your security plugins are blocking API requests
- Ensure your server can make outbound HTTP requests
- Verify SSL certificate settings if using HTTPS

### Scan Failures

If scans are failing or incomplete:
- Check your server's memory limit (increase if needed)
- Verify permissions settings for the plugin directory
- Disable conflicting plugins temporarily
- Check server error logs for more details

### Caching Issues

If you experience outdated data:
- Clear the AccessWeb cache (AccessWeb → Settings → Maintenance → Clear Cache)
- Verify your WordPress caching plugin settings
- Check if you have object caching enabled that might interfere

## Support Resources

- [AccessWeb Documentation](https://docs.accessweb.com/)
- [WordPress Plugin FAQ](https://docs.accessweb.com/wordpress/faq)
- [Community Forums](https://community.accessweb.com/)
- [Video Tutorials](https://accessweb.com/tutorials)
- Email support: support@accessweb.com
`,
  category: 'best-practices',
  tags: ['WordPress', 'Integration', 'Plugin', 'Implementation', 'Guide'],
  author: {
    name: 'Dr. Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Accessibility Expert'
  },
  publishedAt: '2024-03-19T23:00:00Z',
  readingTime: '15 min read',
  vectorImage: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tableOfContents: [
    { id: 'quick-start', title: 'Quick Start', level: 2 },
    { id: 'detailed-installation-steps', title: 'Detailed Installation Steps', level: 2 },
    { id: 'advanced-features', title: 'Advanced Features', level: 2 },
    { id: 'webhook-integration', title: 'Webhook Integration', level: 2 },
    { id: 'best-practices', title: 'Best Practices', level: 2 },
    { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
    { id: 'support-resources', title: 'Support Resources', level: 2 }
  ]
};