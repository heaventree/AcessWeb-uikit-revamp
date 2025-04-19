import type { PaymentTransaction } from '../types';

// Simulated database
let transactions: PaymentTransaction[] = [];

export const paymentService = {
  getAllTransactions: async (): Promise<PaymentTransaction[]> => {
    return transactions;
  },

  getTransactionById: async (id: string): Promise<PaymentTransaction | null> => {
    return transactions.find(tx => tx.id === id) || null;
  },

  getTransactionsByClient: async (clientId: string): Promise<PaymentTransaction[]> => {
    return transactions.filter(tx => tx.clientId === clientId);
  },

  createTransaction: async (data: Omit<PaymentTransaction, 'id' | 'date'>): Promise<PaymentTransaction> => {
    const newTransaction: PaymentTransaction = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString()
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  updateTransactionStatus: async (
    id: string,
    status: PaymentTransaction['status']
  ): Promise<PaymentTransaction | null> => {
    const transaction = transactions.find(tx => tx.id === id);
    if (!transaction) return null;

    transaction.status = status;
    return transaction;
  },

  getRevenueStats: async (startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageTransactionValue: number;
  }> => {
    const filteredTransactions = transactions.filter(tx => 
      tx.date >= startDate && tx.date <= endDate
    );

    const successful = filteredTransactions.filter(tx => tx.status === 'completed');
    const failed = filteredTransactions.filter(tx => tx.status === 'failed');

    const totalRevenue = successful.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalRevenue,
      successfulTransactions: successful.length,
      failedTransactions: failed.length,
      averageTransactionValue: successful.length ? totalRevenue / successful.length : 0
    };
  }
};