import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

// Types
export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  category: string;
  isActive: boolean;
}

interface TrackerState {
  transactions: Transaction[];
  budgets: Budget[];
  recurringPayments: RecurringPayment[];
  monthlyBudgetLimit: number;
  sortPreferences?: {
    expenses?: 'newest' | 'oldest';
    income?: 'newest' | 'oldest';
  };
}

// Actions
type TrackerAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'ADD_RECURRING_PAYMENT'; payload: RecurringPayment }
  | { type: 'UPDATE_RECURRING_PAYMENT'; payload: RecurringPayment }
  | { type: 'SET_MONTHLY_BUDGET_LIMIT'; payload: number }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_SORT_PREFERENCE'; payload: { key: 'income' | 'expenses'; value: 'newest' | 'oldest' } }
  | { type: 'SET_STATE'; payload: TrackerState };

// Initial state with sample data
const initialState: TrackerState = {
  transactions: [
    {
      id: '1',
      type: 'expense',
      amount: 50.00,
      description: 'Groceries',
      category: 'Food',
      date: new Date(2025, 8, 20) // Sept 20, 2025
    },
    {
      id: '2',
      type: 'expense',
      amount: 89.50,
      description: 'Gas',
      category: 'Transport',
      date: new Date(2025, 8, 22) // Sept 22, 2025
    },
    {
      id: '3',
      type: 'expense',
      amount: 100.00,
      description: 'Shopping',
      category: 'Entertainment',
      date: new Date(2025, 8, 24) // Sept 24, 2025
    },
    {
      id: '4',
      type: 'income',
      amount: 200.00,
      description: 'Part-time job',
      category: 'Work',
      date: new Date(2025, 8, 21) // Sept 21, 2025
    },
    {
      id: '5',
      type: 'income',
      amount: 200.00,
      description: 'Freelance',
      category: 'Work',
      date: new Date(2025, 8, 15) // Sept 15, 2025
    }
  ],
  budgets: [
    {
      id: '1',
      category: 'Food',
      limit: 200,
      spent: 50,
      month: 8, // September (0-indexed)
      year: 2025
    },
    {
      id: '2',
      category: 'Transport',
      limit: 150,
      spent: 89.50,
      month: 8,
      year: 2025
    }
  ],
  recurringPayments: [
    {
      id: '1',
      name: 'Spotify Premium',
      amount: 17.90,
      dayOfMonth: 7,
      category: 'Entertainment',
      isActive: true
    }
  ],
  monthlyBudgetLimit: 600.00
  ,
  sortPreferences: {
    expenses: 'newest',
    income: 'newest'
  }
};

// Reducer
function trackerReducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    
    case 'ADD_RECURRING_PAYMENT':
      return {
        ...state,
        recurringPayments: [...state.recurringPayments, action.payload]
      };

    case 'UPDATE_RECURRING_PAYMENT':
      return {
        ...state,
        recurringPayments: state.recurringPayments.map(rp => rp.id === action.payload.id ? action.payload : rp)
      };
    
    case 'SET_MONTHLY_BUDGET_LIMIT':
      return {
        ...state,
        monthlyBudgetLimit: action.payload
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      };

    case 'SET_SORT_PREFERENCE':
      return {
        ...state,
        sortPreferences: {
          ...(state.sortPreferences || {}),
          [action.payload.key]: action.payload.value
        }
      };
    
    default:
      return state;
  }
}

// Context
const TrackerContext = createContext<{
  state: TrackerState;
  dispatch: React.Dispatch<TrackerAction>;
  // Helper functions
  getCurrentMonthExpenses: () => number;
  getCurrentMonthIncome: () => number;
  getWeeklyExpenses: () => number[];
  getTotalBudgetUsed: () => number;
  setSortPreference: (key: 'income' | 'expenses', value: 'newest' | 'oldest') => void;
} | undefined>(undefined);

// Provider
export function TrackerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trackerReducer, initialState);

  const STORAGE_KEY = '@tracker_state_v1';

  // Load saved state on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as TrackerState;
          // revive date strings to Date objects for transactions
          parsed.transactions = parsed.transactions.map(t => ({ ...t, date: new Date(t.date) }));
          dispatch({ type: 'SET_STATE', payload: parsed });
        }
      } catch (e) {
        console.warn('Failed to load tracker state', e);
      }
    })();
  }, []);

  // Save state on changes
  useEffect(() => {
    (async () => {
      try {
        // serialize dates to ISO strings
        const toSave = {
          ...state,
          transactions: state.transactions.map(t => ({ ...t, date: t.date instanceof Date ? t.date.toISOString() : t.date }))
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.warn('Failed to save tracker state', e);
      }
    })();
  }, [state]);

  // Helper functions
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return state.transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((total, t) => total + t.amount, 0);
  };

  const getCurrentMonthIncome = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return state.transactions
      .filter(t => 
        t.type === 'income' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((total, t) => total + t.amount, 0);
  };

  const getWeeklyExpenses = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
    
    const weeklyData = Array(7).fill(0);
    
    state.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const daysDiff = Math.floor((transactionDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff < 7) {
          weeklyData[daysDiff] += transaction.amount;
        }
      });
    
    return weeklyData;
  };

  const getTotalBudgetUsed = () => {
    return getCurrentMonthExpenses();
  };

  const value = {
    state,
    dispatch,
    getCurrentMonthExpenses,
    getCurrentMonthIncome,
    getWeeklyExpenses,
    getTotalBudgetUsed
    ,
    setSortPreference: (key: 'income' | 'expenses', value: 'newest' | 'oldest') => {
      dispatch({ type: 'SET_SORT_PREFERENCE', payload: { key, value } });
    }
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
}

// Hook
export function useTracker() {
  const context = useContext(TrackerContext);
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
}