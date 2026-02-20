export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  price2022: number;
  percentChange: number;
  isPriceGouging: boolean;
}

export interface Receipt {
  id: string;
  date: string;
  storeName: string;
  category: 'groceries' | 'dining' | 'gas' | 'other';
  items: ReceiptItem[];
  totalPaid: number;
  total2022: number;
  overpaid: number;
  imageUrl?: string;
}

export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  lastUsed: string;
  category: string;
  isActive: boolean;
}

export interface MonthlySpend {
  month: string;
  amount: number;
  inflationImpact: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

export interface UserStats {
  totalInflationHit: number;
  monthlySpends: MonthlySpend[];
  categoryBreakdown: CategorySpend[];
  rageScore: number;
  receiptsScanned: number;
  subscriptionWaste: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  isPro: boolean;
}
