import type { Receipt, Subscription, UserStats, UserProfile, ReceiptItem } from '../types';

// Mock receipt items with realistic data
const createReceiptItems = (category: string): ReceiptItem[] => {
  if (category === 'groceries') {
    return [
      { id: '1', name: 'Organic Eggs (12ct)', quantity: 1, unitPrice: 6.99, price2022: 4.89, percentChange: 43, isPriceGouging: true },
      { id: '2', name: 'Whole Milk (1gal)', quantity: 1, unitPrice: 4.49, price2022: 3.59, percentChange: 25, isPriceGouging: false },
      { id: '3', name: 'Bread (Whole Wheat)', quantity: 2, unitPrice: 3.99, price2022: 3.29, percentChange: 21, isPriceGouging: false },
      { id: '4', name: 'Ground Beef (1lb)', quantity: 2, unitPrice: 7.99, price2022: 5.49, percentChange: 46, isPriceGouging: true },
      { id: '5', name: 'Fresh Tomatoes', quantity: 1, unitPrice: 4.29, price2022: 3.49, percentChange: 23, isPriceGouging: false },
      { id: '6', name: 'Chicken Breast (1lb)', quantity: 3, unitPrice: 6.49, price2022: 4.99, percentChange: 30, isPriceGouging: true },
      { id: '7', name: 'Orange Juice', quantity: 1, unitPrice: 5.99, price2022: 4.79, percentChange: 25, isPriceGouging: false },
      { id: '8', name: 'Cereal (Family Size)', quantity: 1, unitPrice: 6.49, price2022: 5.29, percentChange: 23, isPriceGouging: false },
    ];
  } else if (category === 'dining') {
    return [
      { id: '1', name: 'Burger Combo', quantity: 2, unitPrice: 14.99, price2022: 12.49, percentChange: 20, isPriceGouging: false },
      { id: '2', name: 'Caesar Salad', quantity: 1, unitPrice: 11.99, price2022: 10.49, percentChange: 14, isPriceGouging: false },
      { id: '3', name: 'Soft Drink', quantity: 3, unitPrice: 3.49, price2022: 2.99, percentChange: 17, isPriceGouging: false },
      { id: '4', name: 'Fries (Large)', quantity: 2, unitPrice: 4.99, price2022: 3.99, percentChange: 25, isPriceGouging: false },
    ];
  } else if (category === 'gas') {
    return [
      { id: '1', name: 'Regular Gas', quantity: 12.5, unitPrice: 3.89, price2022: 2.99, percentChange: 30, isPriceGouging: true },
    ];
  }
  return [];
};

// Generate mock receipts
const generateMockReceipts = (): Receipt[] => {
  const receipts: Receipt[] = [];
  
  // Grocery receipts
  for (let i = 0; i < 8; i++) {
    const items = createReceiptItems('groceries');
    const totalPaid = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const total2022 = items.reduce((sum, item) => sum + (item.price2022 * item.quantity), 0);
    
    receipts.push({
      id: `receipt-${i + 1}`,
      date: new Date(2025, 0, i * 3 + 1).toISOString(),
      storeName: ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Costco'][i % 4],
      category: 'groceries',
      items,
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      total2022: parseFloat(total2022.toFixed(2)),
      overpaid: parseFloat((totalPaid - total2022).toFixed(2)),
    });
  }
  
  // Dining receipts
  for (let i = 0; i < 4; i++) {
    const items = createReceiptItems('dining');
    const totalPaid = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const total2022 = items.reduce((sum, item) => sum + (item.price2022 * item.quantity), 0);
    
    receipts.push({
      id: `receipt-${8 + i + 1}`,
      date: new Date(2025, 0, i * 7 + 2).toISOString(),
      storeName: ['McDonald\'s', 'Chipotle', 'Olive Garden', 'Starbucks'][i % 4],
      category: 'dining',
      items,
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      total2022: parseFloat(total2022.toFixed(2)),
      overpaid: parseFloat((totalPaid - total2022).toFixed(2)),
    });
  }
  
  // Gas receipts
  for (let i = 0; i < 3; i++) {
    const items = createReceiptItems('gas');
    const totalPaid = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const total2022 = items.reduce((sum, item) => sum + (item.price2022 * item.quantity), 0);
    
    receipts.push({
      id: `receipt-${12 + i + 1}`,
      date: new Date(2025, 0, i * 10 + 3).toISOString(),
      storeName: 'Shell',
      category: 'gas',
      items,
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      total2022: parseFloat(total2022.toFixed(2)),
      overpaid: parseFloat((totalPaid - total2022).toFixed(2)),
    });
  }
  
  return receipts;
};

// Mock subscriptions
const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix Premium', monthlyCost: 19.99, lastUsed: '2025-01-15', category: 'Entertainment', isActive: true },
  { id: '2', name: 'Spotify Family', monthlyCost: 16.99, lastUsed: '2025-01-20', category: 'Entertainment', isActive: true },
  { id: '3', name: 'Adobe Creative Cloud', monthlyCost: 54.99, lastUsed: '2024-11-10', category: 'Software', isActive: true },
  { id: '4', name: 'Planet Fitness', monthlyCost: 10.99, lastUsed: '2024-09-05', category: 'Fitness', isActive: true },
  { id: '5', name: 'Disney+', monthlyCost: 11.99, lastUsed: '2024-08-20', category: 'Entertainment', isActive: true },
  { id: '6', name: 'HelloFresh', monthlyCost: 69.99, lastUsed: '2024-12-01', category: 'Food', isActive: true },
  { id: '7', name: 'Audible', monthlyCost: 14.95, lastUsed: '2024-07-15', category: 'Books', isActive: true },
  { id: '8', name: 'New York Times Digital', monthlyCost: 17.99, lastUsed: '2024-06-30', category: 'News', isActive: true },
];

// Mock user stats
const generateMockStats = (receipts: Receipt[]): UserStats => {
  const totalInflationHit = receipts.reduce((sum, r) => sum + r.overpaid, 0);
  
  const monthlySpends = [
    { month: 'Aug 2024', amount: 856, inflationImpact: 178 },
    { month: 'Sep 2024', amount: 923, inflationImpact: 192 },
    { month: 'Oct 2024', amount: 1045, inflationImpact: 217 },
    { month: 'Nov 2024', amount: 987, inflationImpact: 205 },
    { month: 'Dec 2024', amount: 1234, inflationImpact: 256 },
    { month: 'Jan 2025', amount: 1089, inflationImpact: 226 },
  ];
  
  const groceriesTotal = receipts.filter(r => r.category === 'groceries').reduce((sum, r) => sum + r.totalPaid, 0);
  const diningTotal = receipts.filter(r => r.category === 'dining').reduce((sum, r) => sum + r.totalPaid, 0);
  const gasTotal = receipts.filter(r => r.category === 'gas').reduce((sum, r) => sum + r.totalPaid, 0);
  const total = groceriesTotal + diningTotal + gasTotal;
  
  const categoryBreakdown = [
    { category: 'Groceries', amount: groceriesTotal, percentage: (groceriesTotal / total) * 100 },
    { category: 'Dining', amount: diningTotal, percentage: (diningTotal / total) * 100 },
    { category: 'Gas', amount: gasTotal, percentage: (gasTotal / total) * 100 },
  ];
  
  const subscriptionWaste = mockSubscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
  
  return {
    totalInflationHit: parseFloat(totalInflationHit.toFixed(2)),
    monthlySpends,
    categoryBreakdown,
    rageScore: Math.min(100, Math.round((totalInflationHit / 1000) * 85)),
    receiptsScanned: receipts.length,
    subscriptionWaste: parseFloat(subscriptionWaste.toFixed(2)),
  };
};

// Mock user profile
const mockUserProfile: UserProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  joinedDate: '2024-01-15T00:00:00.000Z',
  isPro: true,
};

class MockDataService {
  private receipts: Receipt[];
  private stats: UserStats;
  
  constructor() {
    this.receipts = generateMockReceipts();
    this.stats = generateMockStats(this.receipts);
  }
  
  getAllReceipts(): Receipt[] {
    return this.receipts;
  }
  
  getReceiptById(id: string): Receipt | undefined {
    return this.receipts.find(r => r.id === id);
  }
  
  getSubscriptions(): Subscription[] {
    return mockSubscriptions;
  }
  
  getUserStats(): UserStats {
    return this.stats;
  }
  
  getUserProfile(): UserProfile {
    return mockUserProfile;
  }
  
  // Simulate scanning a receipt
  async scanReceipt(): Promise<Receipt> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return a random receipt from our mock data
    const randomIndex = Math.floor(Math.random() * this.receipts.length);
    return this.receipts[randomIndex];
  }
  
  // Get top price gouging items
  getTopPriceGougingItems(limit: number = 5): ReceiptItem[] {
    const allItems: ReceiptItem[] = [];
    this.receipts.forEach(receipt => {
      receipt.items.forEach(item => allItems.push(item));
    });
    
    return allItems
      .filter(item => item.isPriceGouging)
      .sort((a, b) => b.percentChange - a.percentChange)
      .slice(0, limit);
  }
}

export const mockDataService = new MockDataService();
