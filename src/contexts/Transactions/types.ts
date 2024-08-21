export interface TransactionContextProvider {
  add: (transaction: Transaction) => void;
  edit: () => void;
  delete: () => void;
  retrieve: () => void;
  transactions: TransactionList;
}

export type TransactionType = 'Expense' | 'Income'

export type Transaction = {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export type TransactionProviderProps = {
  children: React.ReactNode
}

export type TransactionList = Array<Transaction>


