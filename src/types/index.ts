export interface Receipt {
  id: string;
  date: string;
  vendor: string;
  total: number;
  items: ReceiptItem[];
  category: 'groceries' | 'dining' | 'gas' | 'other';
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  baselinePrice: number; // 2022 price
  percentChange: number;
}

export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  lastUsed: string;
  category: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
  isPro: boolean;
  avatar: string;
}

export interface MonthlySpend {
  month: string;
  amount: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}
