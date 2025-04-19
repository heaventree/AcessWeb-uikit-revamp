## Debug List

### Version History

#### v2.4 (2024-03-19 23:00:00 UTC)
- Status: Stable backup created
- Components: All core accessibility features implemented
- Database: Clean state after migration consolidation
- Features:
  - WCAG 2.1 Compliance Testing
  - AI-Powered Recommendations
  - Accessibility Reporting
  - Color Contrast Analysis
  - Real-time Monitoring
  - PDF Export
  - Payment Processing
  - User Authentication
  - Admin Dashboard
  - Blog System
  - Help Center
- Standards Support:
  - WCAG 2.1
  - ADA
  - Section 508
  - EN 301 549
  - EAA
- Files Backed Up:
  - All React components
  - All TypeScript utilities
  - All service implementations
  - All hooks and contexts
  - All styles and themes
  - All documentation
  - WordPress plugin
- Database Schema:
  - Users and authentication
  - Scans and results
  - Subscriptions and billing
  - Content management
  - API keys and webhooks

### High Priority
10. Database Migration Issues
   - Current Status: Migrations failing with column name errors
   - Issues:
     - Column name mismatches (published vs is_published)
     - Policy conflicts
     - Migration file naming conflicts
     - Multiple migration attempts
   - TODO:
     - Create single consolidated migration file
     - Use consistent column naming
     - Drop existing tables before recreating
     - Add proper foreign key constraints
     - Implement proper cascading deletes
     - Add proper indexes for performance
     - Add metadata columns for tracking
     - Set up proper RLS policies
     - Add audit logging
     - Create helper functions

1. Dark Mode Implementation (Temporarily Removed)
   - Current Status: Initial implementation causing issues
   - Issues:
     - Theme not applying consistently across components
     - Color contrast issues in dark mode
     - Navigation and layout issues
     - Performance concerns with theme transitions
   - TODO:
     - Re-implement dark mode after fixing core layout issues
     - Review and test all component dark mode styles
     - Implement proper color system for dark mode
     - Add smooth transitions between themes
     - Test across different browsers
     - Ensure proper accessibility in both modes
     - Fix layout issues in dark mode
     - Optimize theme switching performance
     - Add proper system theme detection
     - Persist theme preference
     - Consider using CSS custom properties for theming
     - Implement proper fallbacks for older browsers
     - Add theme toggle with keyboard support
     - Test theme persistence across sessions
     - Add theme transition animations
     - Document theming system

2. Authentication Implementation
   - Current Status: Temporarily disabled for testing
   - Issues:
     - Authentication bypass currently in place
     - Security concerns
     - Direct admin access in navigation
   - TODO:
     - Re-implement authentication system
     - Add proper user session management
     - Implement secure route protection
     - Add role-based access control
     - Set up proper authentication flows
     - Add remember me functionality
     - Implement password reset flow
     - Add session timeout handling
     - Set up proper error handling
     - Remove direct admin access from navigation
     - Implement proper admin access control

3. Admin Dashboard Stats
   - Current Status: Information widgets not updating correctly
   - Issues:
     - Static data in dashboard widgets
     - No real-time updates
     - Missing data refresh mechanism
   - TODO:
     - Implement proper data fetching
     - Add real-time updates
     - Create data refresh mechanism
     - Add loading states
     - Implement error handling
     - Add data caching

4. Payment Gateway Icons Display
   - Current Status: Icons not displaying correctly in admin payment gateways page
   - Issues:
     - SVG icons may need viewBox adjustments
     - Check SVG path data accuracy
     - Verify color values and className applications
     - Test icon sizing and alignment
   - TODO:
     - Review and fix SVG markup
     - Ensure proper icon dimensions
     - Test across different browsers
     - Add fallback icons

5. PDF Export Logo Integration
   - Current Status: Logo not appearing in exported PDFs
   - Need to implement reliable logo embedding in PDF exports
   - Consider using base64 encoded image or CDN-hosted logo

6. Monitoring System Implementation
   - Add daily scan option for premium subscribers
   - Implement rate limiting for API endpoints
   - Add webhook notifications for scan results
   - Implement email notifications
   - Add custom scan schedules
   - Add scan history and trends
   - Implement real-time monitoring dashboard

7. Supabase Policy Conflicts
   - Current Status: Policy creation failing due to existing policies
   - Issues:
     - "Users can manage own API keys" policy already exists
     - Migration failing to apply due to policy conflict
   - TODO:
     - Drop existing policies before creating new ones
     - Use unique policy names to avoid conflicts
     - Add policy existence checks in migrations
     - Implement proper policy versioning
     - Add policy cleanup scripts
    - Suppress policy conflict error reporting
    - Add policy conflict detection
    - Implement policy reconciliation
    - Add policy migration rollback
    - Create policy management dashboard

8. Issue List Border Contrast
   - Current Status: Border contrast not sufficient between open/closed states
   - Issues:
     - Border color difference too subtle
     - Hard to distinguish active state
     - Poor visual hierarchy
   - TODO:
     - Increase border color contrast for active state
     - Add subtle shadow for depth
     - Consider background color adjustment
     - Test contrast ratios
     - Verify with color blindness simulators

9. Subscription System Issues
  - Current Status: Subscription checks failing with 404 errors
  - Issues:
    - Missing RPC functions for subscription status
    - Missing tables for subscription management
    - No proper error handling for subscription checks
    - Usage alerts not working
  - TODO:
    - Create subscription tables and RPC functions
    - Implement proper error handling
    - Add subscription status checks
    - Set up usage tracking
    - Implement alerts system
    - Add subscription analytics
    - Create subscription dashboard
    - Set up billing integration
    - Add usage monitoring
    - Implement notification system
    - Create subscription reports
    - Add subscription management UI
    - Test subscription flows
    - Document subscription system

10. Usage Alerts System
   - Current Status: Alerts endpoints returning 404 errors
   - Issues:
     - Missing alerts table and functions
     - No alert generation system
     - Missing notification integration
     - No alert management UI
   - TODO:
     - Create alerts table
     - Implement alert generation
     - Add notification system
     - Create alert management UI
     - Set up email notifications
     - Add webhook support
     - Implement alert rules
     - Create alert dashboard
     - Add alert history
     - Test alert delivery
     - Document alert system

11. Integration Pages Design Enhancement
   - Current Status: Base content updated, needs additional UI refinement
   - Affected Pages:
     - /integrations/shopify
     - /integrations/api
     - /wordpressint
     - /docs/wordpress
     - /docs/shopify
     - /docs/api
   - TODO:
     - Add section icons for better visual hierarchy
     - Improve responsive design for mobile views
     - Add pagination for long documentation pages
     - Consider adding interactive demos
     - Add copy-to-clipboard functionality for code examples
     - Implement better code syntax highlighting
     - Add table of contents for long documentation
     - Add feedback mechanism at bottom of pages
     - Improve print stylesheets for documentation
     - Add version selector for API documentation

[Rest of debug list remains unchanged...]