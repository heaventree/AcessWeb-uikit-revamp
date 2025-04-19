import { perceivableArticle } from './wcag-1-perceivable';
import { operableArticle } from './wcag-2-operable';
import { understandableArticle } from './wcag-3-understandable';
import { robustArticle } from './wcag-4-robust';
import { wcagGuideArticle } from './accessibility-standards/wcag-2-1-guide';
import { adaComplianceArticle } from './accessibility-standards/ada-compliance';
import { eaaGuideArticle } from './accessibility-standards/eaa-guide';
import { section508GuideArticle } from './accessibility-standards/section-508-guide';
import { wcagBeginnersGuide } from './wcag/beginners-guide';
import { wcagImplementationTutorial } from './wcag/implementation-tutorial';
import { wcagAuditGuide } from './wcag/audit-guide';
import { wcagMobileAccessibility } from './wcag/mobile-accessibility';
import { wcagColorContrast } from './wcag/color-contrast';
import { implementationGuideArticle } from './best-practices/implementation-guide';
import { wcagBestPractices } from './best-practices/wcag-best-practices';
import { adaBestPractices } from './best-practices/ada-best-practices';
import { eaaBestPractices } from './best-practices/eaa-best-practices';
import { section508BestPractices } from './best-practices/section-508-best-practices';
import { wordpressIntegrationGuide } from './integrations/wordpress-integration-guide';
import { shopifyIntegrationGuide } from './integrations/shopify-integration-guide';
import { customApiGuide } from './integrations/custom-api-guide';
// WCAG Resources (Educational Content)
import { wcagPerceivablePrincipleGuide } from './wcag-resources/wcag-perceivable-principle';
import { wcagResourceArticles, featuredWcagResourceArticles } from './wcag-resources';
import type { Article } from '../../types/blog';

// Regular articles
const regularArticles: Article[] = [
  perceivableArticle,
  operableArticle,
  understandableArticle,
  robustArticle,
  wcagGuideArticle,
  adaComplianceArticle,
  eaaGuideArticle,
  section508GuideArticle,
  wcagBeginnersGuide,
  wcagImplementationTutorial,
  wcagAuditGuide,
  wcagMobileAccessibility,
  wcagColorContrast,
  implementationGuideArticle,
  wcagBestPractices,
  adaBestPractices,
  eaaBestPractices,
  section508BestPractices,
  wordpressIntegrationGuide,
  shopifyIntegrationGuide,
  customApiGuide,
  wcagPerceivablePrincipleGuide
];

// Combine regular articles with WCAG resource articles
export const articles: Article[] = [
  ...regularArticles,
  ...wcagResourceArticles
];

// Featured articles should include a mix of regular and resource articles
export const featuredArticles = [
  // First featured WCAG resource
  featuredWcagResourceArticles[0],
  // Then one of the original featured articles 
  wcagPerceivablePrincipleGuide,
  // Additional featured WCAG resources
  ...featuredWcagResourceArticles.slice(1, 3)
];

export const latestArticles = articles.sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);