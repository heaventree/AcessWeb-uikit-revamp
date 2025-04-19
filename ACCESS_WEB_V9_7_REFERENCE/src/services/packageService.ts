import type { Package } from '../types';

// Simulated database
let packages: Package[] = [];

export const packageService = {
  getAll: async (): Promise<Package[]> => {
    return packages;
  },

  getById: async (id: string): Promise<Package | null> => {
    return packages.find(pkg => pkg.id === id) || null;
  },

  create: async (data: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> => {
    const newPackage: Package = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    packages.push(newPackage);
    return newPackage;
  },

  update: async (id: string, data: Partial<Package>): Promise<Package | null> => {
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index === -1) return null;

    packages[index] = {
      ...packages[index],
      ...data,
      updatedAt: new Date()
    };

    return packages[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = packages.length;
    packages = packages.filter(pkg => pkg.id !== id);
    return packages.length < initialLength;
  },

  toggleActive: async (id: string): Promise<Package | null> => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return null;

    pkg.isActive = !pkg.isActive;
    pkg.updatedAt = new Date();
    return pkg;
  }
};