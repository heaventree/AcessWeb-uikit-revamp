/**
 * WCAG Accessibility Knowledge Base
 * 
 * This file contains a collection of important resources for accessibility guidelines,
 * best practices, and implementation details. These resources can be used for:
 * 
 * 1. Creating help articles and documentation
 * 2. Providing additional information in the UI
 * 3. Informing development decisions
 * 4. Adding to blog or knowledge center
 */

// External resource links organized by category
export const externalResources = {
  wcagGuidelines: [
    {
      title: "WCAG Guidelines Overview",
      url: "https://www.accessibilitychecker.org/guides/wcag/",
      description: "Comprehensive overview of Web Content Accessibility Guidelines"
    },
    {
      title: "WCAG 2.1 Compliance Guide",
      url: "https://accessibe.com/compliance/wcag-21",
      description: "Detailed explanation of WCAG 2.1 standards and implementation"
    },
    {
      title: "What is WCAG",
      url: "https://www.wcag.com/resource/what-is-wcag/",
      description: "Introduction to WCAG standards and importance"
    },
    {
      title: "UK Government WCAG Understanding",
      url: "https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag",
      description: "UK government's guide to understanding and implementing WCAG"
    },
    {
      title: "WCAG for Beginners",
      url: "https://silktide.com/accessibility-guide/the-wcag-standard/wcag-for-beginners/",
      description: "Beginner-friendly introduction to WCAG standards"
    },
    {
      title: "WCAG Checklist",
      url: "https://accessibe.com/blog/knowledgebase/wcag-checklist",
      description: "Actionable checklist for WCAG compliance"
    }
  ],
  
  documentAccessibility: [
    {
      title: "Document Accessibility Guide",
      url: "https://www.accessibilitychecker.org/guides/document-accessibility/",
      description: "Best practices for making documents accessible"
    },
    {
      title: "PDF Accessibility Tools",
      url: "https://www.equalweb.com/11711/11528/pdf_accessibility_tools",
      description: "Tools and techniques for PDF accessibility"
    }
  ],
  
  mediaAccessibility: [
    {
      title: "Media Accessibility Guide",
      url: "https://www.accessibilitychecker.org/guides/media-accessibility/",
      description: "Guidelines for making media content accessible"
    }
  ],
  
  mobileAccessibility: [
    {
      title: "Mobile App Accessibility",
      url: "https://www.accessibilitychecker.org/guides/mobile-apps-accessibility/",
      description: "Best practices for accessible mobile application development"
    }
  ],
  
  regionalCompliance: [
    {
      title: "UK Accessibility Regulations",
      url: "https://accessibe.com/compliance/uk-regulations",
      description: "UK-specific accessibility regulations and compliance information"
    },
    {
      title: "EAA Compliance Guide",
      url: "https://www.accessibilitychecker.org/guides/eaa-compliance/",
      description: "European Accessibility Act compliance information"
    },
    {
      title: "UserWay Compliance Resources",
      url: "https://userway.org/compliance/",
      description: "Comprehensive compliance resources and guides"
    }
  ],
  
  implementationGuides: [
    {
      title: "Accessible Fonts Guide",
      url: "https://www.equalweb.com/11588/11529/accessible_fonts",
      description: "Guidelines for choosing and implementing accessible fonts"
    },
    {
      title: "Web Accessibility Languages",
      url: "https://www.equalweb.com/10330/11529/web_accessibility_languages",
      description: "Information on language handling for accessibility"
    },
    {
      title: "UserWay Installation Tutorials",
      url: "https://userway.org/tutorials/?filter=installations&scrolldown=true",
      description: "Installation guides for accessibility widgets"
    },
    {
      title: "UserWay Developer Framework",
      url: "https://userway.org/udf/",
      description: "Developer framework for accessibility implementation"
    },
    {
      title: "UserWay API Documentation",
      url: "https://userway.org/docs/?gclid=CjwKCAjwwLO_BhB2EiwAx2e-37KpHuUGIyNI3DZ9qjQ_fiUIhqZenKHbt-f6QsxJdTlzfWSBCgD_lhoCCogQAvD_BwE&uId=d5445703-e93b-47a2-af25-61a1f54d9934&abver=g16d&referrer=https%3A%2F%2Fwww.google.com%2F&utm_source=google&utm_medium=cpc&utm_campaign=rated%20geo%20%7C%20search%20%7C%20terrific%20%7C%20desktop%20%7C%20main%20%7C%20lead-get%2Bdeal%2Bwon%20%7C%20max%20conversion&utm_content=wcag&utm_term=wcag&campaign_id=21931116171&adset_id=172321364153&utm_ad=722506205205&ad_id=722506205205&matchtype=p&device=c&network=g&GeoLoc=9217610&keyword_id=kwd-387224701#userway-api",
      description: "API documentation for UserWay accessibility services"
    },
    {
      title: "Hostinger Web Accessibility Tutorial",
      url: "https://www.hostinger.com/tutorials/web-accessibility",
      description: "Practical tutorial for implementing web accessibility"
    },
    {
      title: "Webflow Accessibility Checklist",
      url: "https://webflow.com/accessibility/checklist/when/design",
      description: "Design-focused accessibility checklist for web development"
    }
  ],
  
  tools: [
    {
      title: "Accessibility Statement Generator",
      url: "https://userway.org/accessibility-statement-generator/",
      description: "Tool for generating accessibility statements for websites"
    }
  ]
};

// Knowledge base categories for organizing information in the application
export const knowledgeBaseCategories = [
  {
    id: "wcag-standards",
    name: "WCAG Standards",
    description: "Information about Web Content Accessibility Guidelines",
    iconName: "BookOpen"
  },
  {
    id: "document-accessibility",
    name: "Document Accessibility",
    description: "Making documents accessible to all users",
    iconName: "FileText"
  },
  {
    id: "media-accessibility",
    name: "Media Accessibility",
    description: "Guidelines for accessible media content",
    iconName: "Video"
  },
  {
    id: "mobile-accessibility",
    name: "Mobile Accessibility",
    description: "Accessibility for mobile applications",
    iconName: "Smartphone"
  },
  {
    id: "regional-compliance",
    name: "Regional Compliance",
    description: "Region-specific accessibility regulations",
    iconName: "Globe"
  },
  {
    id: "implementation-guides",
    name: "Implementation Guides",
    description: "Technical guides for implementing accessibility features",
    iconName: "Code"
  },
  {
    id: "tools",
    name: "Accessibility Tools",
    description: "Tools to assist with accessibility implementation",
    iconName: "Tool"
  }
];

// Feature discovery - key information extracted from resources
export const keyFindings = [
  {
    id: "pdf-accessibility",
    title: "PDF Accessibility",
    description: "PDF files require specific accessibility considerations including proper tagging, reading order, alternative text for images, and accessible forms.",
    relatedLinks: ["https://www.equalweb.com/11711/11528/pdf_accessibility_tools", "https://www.accessibilitychecker.org/guides/document-accessibility/"],
    category: "document-accessibility"
  },
  {
    id: "mobile-specific-features",
    title: "Mobile-Specific Accessibility",
    description: "Mobile apps have unique accessibility considerations beyond web, including touch target size, gesture alternatives, and device orientation support.",
    relatedLinks: ["https://www.accessibilitychecker.org/guides/mobile-apps-accessibility/"],
    category: "mobile-accessibility"
  },
  {
    id: "media-captioning",
    title: "Media Captioning & Audio Description",
    description: "Video content requires closed captions and audio descriptions for accessibility compliance.",
    relatedLinks: ["https://www.accessibilitychecker.org/guides/media-accessibility/"],
    category: "media-accessibility"
  },
  {
    id: "font-accessibility",
    title: "Font Accessibility Guidelines",
    description: "Guidelines for font selection including size, style, contrast and spacing for maximum readability.",
    relatedLinks: ["https://www.equalweb.com/11588/11529/accessible_fonts"],
    category: "implementation-guides"
  },
  {
    id: "regional-differences",
    title: "Regional Compliance Differences",
    description: "Different regions have specific accessibility requirements beyond WCAG, such as the EAA in Europe and specific UK regulations.",
    relatedLinks: ["https://accessibe.com/compliance/uk-regulations", "https://www.accessibilitychecker.org/guides/eaa-compliance/"],
    category: "regional-compliance"
  },
  {
    id: "automated-tools",
    title: "Accessibility Testing Automation",
    description: "Various automated tools can help identify and fix common accessibility issues, though manual testing is still required.",
    relatedLinks: ["https://userway.org/docs/", "https://userway.org/tutorials/?filter=installations&scrolldown=true"],
    category: "tools"
  },
  {
    id: "accessibility-statements",
    title: "Accessibility Statement Requirements",
    description: "Organizations should provide an accessibility statement detailing compliance level, limitations, and contact information for accessibility issues.",
    relatedLinks: ["https://userway.org/accessibility-statement-generator/"],
    category: "implementation-guides"
  },
  {
    id: "wcag-2.2-updates",
    title: "WCAG 2.2 Key Updates",
    description: "WCAG 2.2 introduces new success criteria focusing on mobile accessibility, cognitive disabilities, and low vision requirements.",
    relatedLinks: ["https://www.accessibilitychecker.org/guides/wcag/", "https://accessibe.com/compliance/wcag-21"],
    category: "wcag-standards"
  }
];