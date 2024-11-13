import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CashTransaction, CashBalance, CashReport } from '../types/cash';

interface CashStore {
  transactions: CashTransaction[];
  balance: CashBalance;
  
  // Transaction actions
  addTransaction: (transaction: CashTransaction) => Promise<void>;
  updateTransaction: (id: string, transaction: CashTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  
  // Report generation
  generateReport: (startDate: string, endDate: string) => Promise<CashReport>;
}

export const useCashStore = create<CashStore>((set, get) => ({
  transactions: [],
  balance: {
    total: 0,
    lastUpdated: new Date().toISOString()
  },

  loadTransactions: async () => {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const transactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CashTransaction));
    
    // Calculate balance
    const total = transactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 
      0
    );

    set({ 
      transactions,
      balance: {
        total,
        lastUpdated: new Date().toISOString()
      }
    });
  },

  addTransaction: async (transaction) => {
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    const newTransaction = { ...transaction, id: docRef.id };

    set((state) => {
      const newTotal = state.balance.total + (
        transaction.type === 'income' ? transaction.amount : -transaction.amount
      );

      return {
        transactions: [...state.transactions, newTransaction],
        balance: {
          total: newTotal,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  },

  updateTransaction: async (id, transaction) => {
    await updateDoc(doc(db, 'transactions', id), transaction);

    set((state) => {
      const oldTransaction = state.transactions.find(t => t.id === id);
      const otherTransactions = state.transactions.filter(t => t.id !== id);
      
      let balanceAdjustment = 0;
      if (oldTransaction) {
        balanceAdjustment -= (oldTransaction.type === 'income' ? 
          oldTransaction.amount : -oldTransaction.amount);
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

  deleteTransaction: async (id) => {
    await deleteDoc(doc(db, 'transactions', id));

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

  generateReport: async (startDate: string, endDate: string) => {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    const filteredTransactions = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as CashTransaction));

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
    const previousTransactionsQ = query(
      transactionsRef,
      where('date', '<', startDate)
    );
    const previousTransactionsSnapshot = await getDocs(previousTransactionsQ);
    const previousTransactions = previousTransactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CashTransaction));

    report.initialBalance = previousTransactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 
      0
    );

    // Process transactions
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        report.totalIncome += transaction.amount;
      } else {
        report.totalExpense += transaction.amount;
      }

      if (!report.byCategory[transaction.category]) {
        report.byCategory[transaction.category] = { income: 0, expense: 0 };
      }
      report.byCategory[transaction.category][transaction.type] += transaction.amount;

      if (!report.byPaymentMethod[transaction.paymentMethod]) {
        report.byPaymentMethod[transaction.paymentMethod] = { income: 0, expense: 0 };
      }
      report.byPaymentMethod[transaction.paymentMethod][transaction.type] += transaction.amount;
    });

    report.finalBalance = report.initialBalance + report.totalIncome - report.totalExpense;

    return report;
  }
}));