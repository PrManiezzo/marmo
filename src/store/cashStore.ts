import { create } from 'zustand';
import { CashTransaction, CashBalance, CashReport } from '../types/cash';

interface CashStore {
  transactions: CashTransaction[];
  balance: CashBalance;
  
  // Transaction actions
  addTransaction: (transaction: CashTransaction) => void;
  updateTransaction: (id: string, transaction: CashTransaction) => void;
  deleteTransaction: (id: string) => void;
  
  // Report generation
  generateReport: (startDate: string, endDate: string) => CashReport;
}

export const useCashStore = create<CashStore>((set, get) => ({
  transactions: [],
  balance: {
    total: 0,
    lastUpdated: new Date().toISOString()
  },

  addTransaction: (transaction) => {
    set((state) => {
      const newTotal = state.balance.total + (
        transaction.type === 'income' ? transaction.amount : -transaction.amount
      );

      return {
        transactions: [...state.transactions, transaction],
        balance: {
          total: newTotal,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  },

  updateTransaction: (id, transaction) => {
    set((state) => {
      const oldTransaction = state.transactions.find(t => t.id === id);
      const otherTransactions = state.transactions.filter(t => t.id !== id);
      
      let balanceAdjustment = 0;
      if (oldTransaction) {
        // Remove the effect of the old transaction
        balanceAdjustment -= (oldTransaction.type === 'income' ? 
          oldTransaction.amount : -oldTransaction.amount);
        // Add the effect of the new transaction
        balanceAdjustment += (transaction.type === 'income' ? 
          transaction.amount : -transaction.amount);
      }

      return {
        transactions: [...otherTransactions, transaction],
        balance: {
          total: state.balance.total + balanceAdjustment,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const transaction = state.transactions.find(t => t.id === id);
      if (!transaction) return state;

      const balanceAdjustment = transaction.type === 'income' ? 
        -transaction.amount : transaction.amount;

      return {
        transactions: state.transactions.filter(t => t.id !== id),
        balance: {
          total: state.balance.total + balanceAdjustment,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  },

  generateReport: (startDate, endDate) => {
    const state = get();
    const filteredTransactions = state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && 
             transactionDate <= new Date(endDate);
    });

    const report: CashReport = {
      startDate,
      endDate,
      initialBalance: 0,
      finalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      transactions: filteredTransactions,
      byCategory: {},
      byPaymentMethod: {}
    };

    // Calculate initial balance (all transactions before start date)
    const previousTransactions = state.transactions.filter(transaction => 
      new Date(transaction.date) < new Date(startDate)
    );
    report.initialBalance = previousTransactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 
      0
    );

    // Process transactions
    filteredTransactions.forEach(transaction => {
      // Update totals
      if (transaction.type === 'income') {
        report.totalIncome += transaction.amount;
      } else {
        report.totalExpense += transaction.amount;
      }

      // Update category statistics
      if (!report.byCategory[transaction.category]) {
        report.byCategory[transaction.category] = { income: 0, expense: 0 };
      }
      report.byCategory[transaction.category][transaction.type] += transaction.amount;

      // Update payment method statistics
      if (!report.byPaymentMethod[transaction.paymentMethod]) {
        report.byPaymentMethod[transaction.paymentMethod] = { income: 0, expense: 0 };
      }
      report.byPaymentMethod[transaction.paymentMethod][transaction.type] += transaction.amount;
    });

    report.finalBalance = report.initialBalance + report.totalIncome - report.totalExpense;

    return report;
  }
}));