export interface CashTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix';
  relatedOrderId?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashBalance {
  total: number;
  lastUpdated: string;
}

export interface CashReport {
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactions: CashTransaction[];
  byCategory: {
    [key: string]: {
      income: number;
      expense: number;
    };
  };
  byPaymentMethod: {
    [key: string]: {
      income: number;
      expense: number;
    };
  };
}