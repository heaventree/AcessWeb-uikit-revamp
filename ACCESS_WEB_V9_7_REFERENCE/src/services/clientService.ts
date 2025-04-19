import type { Client } from '../types';

// Simulated database
let clients: Client[] = [];

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    return clients;
  },

  getById: async (id: string): Promise<Client | null> => {
    return clients.find(client => client.id === id) || null;
  },

  create: async (data: Omit<Client, 'id' | 'joinedDate'>): Promise<Client> => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...data,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    clients.push(newClient);
    return newClient;
  },

  update: async (id: string, data: Partial<Client>): Promise<Client | null> => {
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) return null;

    clients[index] = {
      ...clients[index],
      ...data
    };

    return clients[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = clients.length;
    clients = clients.filter(client => client.id !== id);
    return clients.length < initialLength;
  },

  search: async (query: string): Promise<Client[]> => {
    const lowercaseQuery = query.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      client.company.toLowerCase().includes(lowercaseQuery)
    );
  },

  getClientsByPlan: async (planId: string): Promise<Client[]> => {
    return clients.filter(client => client.plan === planId);
  },

  updateStatus: async (id: string, status: Client['status']): Promise<Client | null> => {
    const client = clients.find(c => c.id === id);
    if (!client) return null;

    client.status = status;
    return client;
  }
};