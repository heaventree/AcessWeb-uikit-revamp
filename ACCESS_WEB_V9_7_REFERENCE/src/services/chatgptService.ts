import { OpenAI } from 'openai';
import { z } from 'zod';
import type { Article } from '../types/blog';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Validation schema for article generation request
const ArticleRequestSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(20).max(200),
  category: z.enum(['wcag', 'accessibility', 'best-practices']),
  tags: z.array(z.string()).min(1).max(5)
});

export type ArticleRequest = z.infer<typeof ArticleRequestSchema>;

const systemPrompt = `You are an expert accessibility consultant specializing in WCAG compliance, ADA requirements, and web accessibility best practices. Write detailed, technically accurate articles that include:

1. Clear explanations of concepts
2. Practical code examples using HTML, CSS, and TypeScript/React
3. Best practices and implementation patterns
4. Testing strategies
5. Resources and references

Format the content in markdown with proper headings (h1-h4) and code blocks.`;

export async function generateArticle(request: ArticleRequest): Promise<Partial<Article>> {
  try {
    // Validate request
    ArticleRequestSchema.parse(request);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Write a comprehensive article about ${request.title}.

Requirements:
- Description: ${request.description}
- Category: ${request.category}
- Tags: ${request.tags.join(', ')}
- Include practical code examples
- Follow proper heading hierarchy
- Include a table of contents
- Minimum 2000 words`
        }
      ],
      temperature: 0.7,
      max_tokens: 3500
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Extract table of contents from the markdown
    const tocItems = content.match(/^#{2,3}\s+(.+)$/gm)?.map(heading => {
      const level = heading.match(/^(#{2,3})/)?.[0].length || 2;
      const title = heading.replace(/^#{2,3}\s+/, '');
      return {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        level
      };
    }) || [];

    return {
      title: request.title,
      description: request.description,
      content,
      category: request.category,
      tags: request.tags,
      tableOfContents: tocItems,
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`
    };
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
}

export async function generateArticleSeries(topic: string, count: number = 3): Promise<Partial<Article>[]> {
  try {
    // First, generate series outline
    const outlineCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create an outline for a ${count}-part article series about ${topic}. For each article, provide:
1. Title
2. Brief description
3. Main points to cover
4. Category (wcag, accessibility, or best-practices)
5. Relevant tags`
        }
      ],
      temperature: 0.7
    });

    const outline = outlineCompletion.choices[0].message.content;
    if (!outline) {
      throw new Error('No outline generated');
    }

    // Parse outline and generate individual articles
    const articles: Partial<Article>[] = [];
    const outlineSegments = outline.split(/(?=Article \d+:)/);

    for (const segment of outlineSegments.slice(1, count + 1)) {
      const titleMatch = segment.match(/Article \d+: (.+)/);
      const descriptionMatch = segment.match(/Description: (.+)/);
      const categoryMatch = segment.match(/Category: (.+)/);
      const tagsMatch = segment.match(/Tags: (.+)/);

      if (titleMatch && descriptionMatch && categoryMatch && tagsMatch) {
        const request: ArticleRequest = {
          title: titleMatch[1].trim(),
          description: descriptionMatch[1].trim(),
          category: categoryMatch[1].trim().toLowerCase() as 'wcag' | 'accessibility' | 'best-practices',
          tags: tagsMatch[1].split(',').map(tag => tag.trim())
        };

        const article = await generateArticle(request);
        articles.push(article);
      }
    }

    return articles;
  } catch (error) {
    console.error('Error generating article series:', error);
    throw error;
  }
}