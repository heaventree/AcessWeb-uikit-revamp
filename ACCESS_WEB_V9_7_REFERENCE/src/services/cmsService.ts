import type { CMSPage } from '../types';
import slugify from 'slugify';

// Simulated database
let pages: CMSPage[] = [];

export const cmsService = {
  getAllPages: async (): Promise<CMSPage[]> => {
    return pages;
  },

  getPageById: async (id: string): Promise<CMSPage | null> => {
    return pages.find(page => page.id === id) || null;
  },

  getPageBySlug: async (slug: string): Promise<CMSPage | null> => {
    return pages.find(page => page.slug === slug) || null;
  },

  createPage: async (data: Omit<CMSPage, 'id' | 'slug' | 'lastModified' | 'isPublished'>): Promise<CMSPage> => {
    const newPage: CMSPage = {
      id: Date.now().toString(),
      slug: slugify(data.title, { lower: true }),
      lastModified: new Date().toISOString(),
      isPublished: false,
      ...data
    };
    pages.push(newPage);
    return newPage;
  },

  updatePage: async (id: string, data: Partial<CMSPage>): Promise<CMSPage | null> => {
    const index = pages.findIndex(page => page.id === id);
    if (index === -1) return null;

    pages[index] = {
      ...pages[index],
      ...data,
      lastModified: new Date().toISOString(),
      slug: data.title ? slugify(data.title, { lower: true }) : pages[index].slug
    };

    return pages[index];
  },

  deletePage: async (id: string): Promise<boolean> => {
    const initialLength = pages.length;
    pages = pages.filter(page => page.id !== id);
    return pages.length < initialLength;
  },

  togglePublished: async (id: string): Promise<CMSPage | null> => {
    const page = pages.find(p => p.id === id);
    if (!page) return null;

    page.isPublished = !page.isPublished;
    page.lastModified = new Date().toISOString();
    return page;
  },

  searchPages: async (query: string): Promise<CMSPage[]> => {
    const lowercaseQuery = query.toLowerCase();
    return pages.filter(page => 
      page.title.toLowerCase().includes(lowercaseQuery) ||
      page.content.toLowerCase().includes(lowercaseQuery)
    );
  }
};