# WCAG Accessibility Knowledge Base

## Overview

The Knowledge Base component provides a centralized repository of accessibility resources, guidelines, and best practices sourced from authoritative websites and organizations. This feature allows users to search, filter, and explore accessibility information across multiple dimensions.

## Features

1. **Categorized Resources**: Resources are organized into logical categories including:
   - WCAG Standards
   - Document Accessibility
   - Media Accessibility
   - Mobile Accessibility
   - Regional Compliance
   - Implementation Guides
   - Accessibility Tools

2. **Key Insights**: Condensed information extracted from resources highlighting critical aspects of accessibility in various contexts.

3. **Search Functionality**: Full-text search across all resources and insights.

4. **External Links**: Direct links to authoritative sources for further reading.

## Component Structure

The Knowledge Base consists of:

1. **Data Layer**: 
   - `knowledge-base.ts` - Contains structured data for resources, categories, and insights

2. **UI Layer**:
   - `KnowledgeBasePage.tsx` - Main page component for displaying and interacting with the knowledge base

## How to Extend

### Adding New Resources

To add new resources to the knowledge base, edit the `knowledge-base.ts` file and add entries to the appropriate category within the `externalResources` object:

```typescript
{
  title: "Resource Title",
  url: "https://example.com/resource",
  description: "Brief description of the resource"
}
```

### Adding New Insights

Add new insights to the `keyFindings` array with the following structure:

```typescript
{
  id: "unique-id",
  title: "Insight Title",
  description: "Detailed description of the insight",
  relatedLinks: ["https://example.com/link1", "https://example.com/link2"],
  category: "category-id"
}
```

### Adding New Categories

To add a new category, add an entry to the `knowledgeBaseCategories` array:

```typescript
{
  id: "category-id",
  name: "Category Name",
  description: "Category description",
  iconName: "IconName"
}
```

Then create a new property in the `externalResources` object with the same name (without hyphens).

## Planned Improvements

1. Add ability to bookmark favorite resources
2. Implement tagging system for more granular filtering
3. Add section for downloadable resources (templates, checklists)
4. Create integration with the application's help system
5. Add ability for users to submit new resource suggestions