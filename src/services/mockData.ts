import type { Receipt, Subscription, UserProfile, MonthlySpend, CategorySpend } from '../types';

export class MockDataService {
  private static receipts: Receipt[] = [
    {
      id: '1',
      date: '2026-02-15',
      vendor: 'Whole Foods Market',
      total: 87.43,
      category: 'groceries',
      items: [
        { name: 'Organic Eggs (12)', quantity: 1, price: 7.99, baselinePrice: 4.59, percentChange: 74 },
        { name: 'Avocados (3)', quantity: 1, price: 8.97, baselinePrice: 5.97, percentChange: 50 },
        { name: 'Chicken Breast (2 lb)', quantity: 1, price: 15.98, baselinePrice: 11.98, percentChange: 33 },
        { name: 'Milk (1 gal)', quantity: 1, price: 6.49, baselinePrice: 4.79, percentChange: 35 },
        { name: 'Bread (Whole Wheat)', quantity: 2, price: 5.98, baselinePrice: 4.38, percentChange: 37 },
        { name: 'Bananas (bunch)', quantity: 1, price: 3.29, baselinePrice: 2.49, percentChange: 32 },
        { name: 'Tomatoes (lb)', quantity: 2, price: 7.98, baselinePrice: 5.98, percentChange: 33 },
        { name: 'Olive Oil', quantity: 1, price: 12.99, baselinePrice: 9.99, percentChange: 30 },
        { name: 'Greek Yogurt (4pk)', quantity: 1, price: 6.49, baselinePrice: 4.99, percentChange: 30 },
        { name: 'Coffee Beans (12oz)', quantity: 1, price: 11.27, baselinePrice: 8.99, percentChange: 25 },
      ],
    },
    {
      id: '2',
      date: '2026-02-14',
      vendor: 'Shell Gas Station',
      total: 78.45,
      category: 'gas',
      items: [
        { name: 'Premium Gasoline (15 gal)', quantity: 15, price: 5.23, baselinePrice: 3.99, percentChange: 31 },
      ],
    },
    {
      id: '3',
      date: '2026-02-13',
      vendor: 'The Local Bistro',
      total: 68.90,
      category: 'dining',
      items: [
        { name: 'Grilled Salmon', quantity: 1, price: 28.00, baselinePrice: 24.00, percentChange: 17 },
        { name: 'Caesar Salad', quantity: 1, price: 14.00, baselinePrice: 11.50, percentChange: 22 },
        { name: 'House Wine (glass)', quantity: 2, price: 24.00, baselinePrice: 20.00, percentChange: 20 },
        { name: 'Tip', quantity: 1, price: 12.90, baselinePrice: 12.90, percentChange: 0 },
      ],
    },
    {
      id: '4',
      date: '2026-02-12',
      vendor: 'Target',
      total: 134.67,
      category: 'groceries',
      items: [
        { name: 'Paper Towels (6pk)', quantity: 1, price: 18.99, baselinePrice: 14.99, percentChange: 27 },
        { name: 'Laundry Detergent', quantity: 1, price: 22.99, baselinePrice: 17.99, percentChange: 28 },
        { name: 'Cereal (2 boxes)', quantity: 2, price: 11.98, baselinePrice: 8.98, percentChange: 33 },
        { name: 'Orange Juice (64oz)', quantity: 2, price: 9.98, baselinePrice: 7.98, percentChange: 25 },
        { name: 'Frozen Pizza (3)', quantity: 3, price: 20.97, baselinePrice: 15.00, percentChange: 40 },
        { name: 'Pasta (5 boxes)', quantity: 5, price: 9.95, baselinePrice: 7.45, percentChange: 34 },
        { name: 'Pasta Sauce (3)', quantity: 3, price: 11.97, baselinePrice: 8.97, percentChange: 33 },
        { name: 'Shampoo', quantity: 1, price: 8.99, baselinePrice: 6.99, percentChange: 29 },
        { name: 'Conditioner', quantity: 1, price: 8.99, baselinePrice: 6.99, percentChange: 29 },
        { name: 'Toothpaste (2)', quantity: 2, price: 9.86, baselinePrice: 7.98, percentChange: 24 },
      ],
    },
    {
      id: '5',
      date: '2026-02-10',
      vendor: 'Starbucks',
      total: 23.45,
      category: 'dining',
      items: [
        { name: 'Grande Latte', quantity: 2, price: 12.50, baselinePrice: 10.00, percentChange: 25 },
        { name: 'Breakfast Sandwich', quantity: 1, price: 6.95, baselinePrice: 5.45, percentChange: 28 },
        { name: 'Tip', quantity: 1, price: 4.00, baselinePrice: 4.00, percentChange: 0 },
      ],
    },
    {
      id: '6',
      date: '2026-02-08',
      vendor: 'Trader Joes',
      total: 56.32,
      category: 'groceries',
      items: [
        { name: 'Almond Butter', quantity: 1, price: 8.99, baselinePrice: 6.99, percentChange: 29 },
        { name: 'Quinoa (2 bags)', quantity: 2, price: 9.98, baselinePrice: 7.98, percentChange: 25 },
        { name: 'Hummus (2)', quantity: 2, price: 7.98, baselinePrice: 5.98, percentChange: 33 },
        { name: 'Spinach (bag)', quantity: 2, price: 5.98, baselinePrice: 4.98, percentChange: 20 },
        { name: 'Sweet Potatoes (2lb)', quantity: 1, price: 3.99, baselinePrice: 2.99, percentChange: 33 },
        { name: 'Trail Mix', quantity: 2, price: 11.98, baselinePrice: 8.98, percentChange: 33 },
        { name: 'Kombucha (4pk)', quantity: 1, price: 7.42, baselinePrice: 5.99, percentChange: 24 },
      ],
    },
    {
      id: '7',
      date: '2026-02-05',
      vendor: 'Chipotle',
      total: 15.89,
      category: 'dining',
      items: [
        { name: 'Burrito Bowl', quantity: 1, price: 12.50, baselinePrice: 9.95, percentChange: 26 },
        { name: 'Chips & Guac', quantity: 1, price: 5.39, baselinePrice: 4.50, percentChange: 20 },
      ],
    },
    {
      id: '8',
      date: '2026-02-03',
      vendor: 'Costco',
      total: 245.78,
      category: 'groceries',
      items: [
        { name: 'Ground Beef (5lb)', quantity: 1, price: 34.95, baselinePrice: 24.95, percentChange: 40 },
        { name: 'Salmon Fillets (2lb)', quantity: 1, price: 29.99, baselinePrice: 22.99, percentChange: 30 },
        { name: 'Rice (20lb bag)', quantity: 1, price: 18.99, baselinePrice: 14.99, percentChange: 27 },
        { name: 'Mixed Nuts (2.5lb)', quantity: 1, price: 22.99, baselinePrice: 16.99, percentChange: 35 },
        { name: 'Cheese (2lb)', quantity: 2, price: 23.98, baselinePrice: 17.98, percentChange: 33 },
        { name: 'Rotisserie Chicken', quantity: 1, price: 5.99, baselinePrice: 4.99, percentChange: 20 },
        { name: 'Bagels (2 dozen)', quantity: 1, price: 8.99, baselinePrice: 6.99, percentChange: 29 },
        { name: 'Butter (4 packs)', quantity: 1, price: 14.99, baselinePrice: 10.99, percentChange: 36 },
        { name: 'Apple Juice (3pk)', quantity: 1, price: 9.99, baselinePrice: 7.99, percentChange: 25 },
        { name: 'Frozen Vegetables (5 bags)', quantity: 1, price: 12.99, baselinePrice: 9.99, percentChange: 30 },
        { name: 'Toilet Paper (30pk)', quantity: 1, price: 32.99, baselinePrice: 24.99, percentChange: 32 },
        { name: 'Dish Soap (3pk)', quantity: 1, price: 13.99, baselinePrice: 10.99, percentChange: 27 },
        { name: 'Granola Bars (48pk)', quantity: 1, price: 15.95, baselinePrice: 12.99, percentChange: 23 },
      ],
    },
    {
      id: '9',
      date: '2026-01-28',
      vendor: 'Pizza Place',
      total: 42.50,
      category: 'dining',
      items: [
        { name: 'Large Pepperoni Pizza', quantity: 1, price: 22.00, baselinePrice: 18.50, percentChange: 19 },
        { name: 'Large Cheese Pizza', quantity: 1, price: 19.00, baselinePrice: 16.00, percentChange: 19 },
        { name: 'Delivery Fee', quantity: 1, price: 5.50, baselinePrice: 4.00, percentChange: 38 },
      ],
    },
    {
      id: '10',
      date: '2026-01-25',
      vendor: 'Safeway',
      total: 93.21,
      category: 'groceries',
      items: [
        { name: 'Strawberries (2 packs)', quantity: 2, price: 11.98, baselinePrice: 7.98, percentChange: 50 },
        { name: 'Blueberries (2 packs)', quantity: 2, price: 13.98, baselinePrice: 9.98, percentChange: 40 },
        { name: 'Bell Peppers (3)', quantity: 3, price: 7.47, baselinePrice: 5.97, percentChange: 25 },
        { name: 'Onions (3lb)', quantity: 1, price: 4.99, baselinePrice: 3.49, percentChange: 43 },
        { name: 'Garlic (2 bulbs)', quantity: 2, price: 3.98, baselinePrice: 2.98, percentChange: 34 },
        { name: 'Lemon (5)', quantity: 5, price: 4.95, baselinePrice: 3.75, percentChange: 32 },
        { name: 'Ground Turkey (2lb)', quantity: 1, price: 11.98, baselinePrice: 8.98, percentChange: 33 },
        { name: 'Ice Cream (2 pints)', quantity: 2, price: 13.98, baselinePrice: 9.98, percentChange: 40 },
        { name: 'Cookies', quantity: 1, price: 4.99, baselinePrice: 3.99, percentChange: 25 },
        { name: 'Soda (12pk)', quantity: 2, price: 15.91, baselinePrice: 11.98, percentChange: 33 },
      ],
    },
    {
      id: '11',
      date: '2026-01-20',
      vendor: 'Shell Gas Station',
      total: 82.15,
      category: 'gas',
      items: [
        { name: 'Premium Gasoline (16 gal)', quantity: 16, price: 5.13, baselinePrice: 3.99, percentChange: 29 },
      ],
    },
    {
      id: '12',
      date: '2026-01-18',
      vendor: 'Panera Bread',
      total: 28.45,
      category: 'dining',
      items: [
        { name: 'Mediterranean Bowl', quantity: 1, price: 13.99, baselinePrice: 11.49, percentChange: 22 },
        { name: 'Broccoli Cheddar Soup', quantity: 1, price: 8.99, baselinePrice: 7.49, percentChange: 20 },
        { name: 'Baguette', quantity: 1, price: 3.49, baselinePrice: 2.99, percentChange: 17 },
        { name: 'Drink', quantity: 1, price: 3.98, baselinePrice: 3.29, percentChange: 21 },
      ],
    },
    {
      id: '13',
      date: '2026-01-15',
      vendor: 'Whole Foods Market',
      total: 76.89,
      category: 'groceries',
      items: [
        { name: 'Organic Chicken (3lb)', quantity: 1, price: 23.97, baselinePrice: 17.97, percentChange: 33 },
        { name: 'Asparagus (bunch)', quantity: 2, price: 9.98, baselinePrice: 7.98, percentChange: 25 },
        { name: 'Brussels Sprouts (lb)', quantity: 1, price: 4.99, baselinePrice: 3.49, percentChange: 43 },
        { name: 'Sweet Corn (4)', quantity: 4, price: 5.96, baselinePrice: 3.96, percentChange: 51 },
        { name: 'Zucchini (3)', quantity: 3, price: 5.97, baselinePrice: 4.47, percentChange: 34 },
        { name: 'Kale (2 bunches)', quantity: 2, price: 7.98, baselinePrice: 5.98, percentChange: 33 },
        { name: 'Coconut Water (6pk)', quantity: 1, price: 9.99, baselinePrice: 7.99, percentChange: 25 },
        { name: 'Protein Bars (12pk)', quantity: 1, price: 16.05, baselinePrice: 12.99, percentChange: 24 },
      ],
    },
    {
      id: '14',
      date: '2026-01-12',
      vendor: 'CVS Pharmacy',
      total: 45.32,
      category: 'other',
      items: [
        { name: 'Pain Reliever', quantity: 1, price: 12.99, baselinePrice: 9.99, percentChange: 30 },
        { name: 'Vitamins', quantity: 1, price: 19.99, baselinePrice: 14.99, percentChange: 33 },
        { name: 'Band-Aids', quantity: 1, price: 6.99, baselinePrice: 5.49, percentChange: 27 },
        { name: 'Hand Sanitizer', quantity: 1, price: 5.35, baselinePrice: 3.99, percentChange: 34 },
      ],
    },
    {
      id: '15',
      date: '2026-01-08',
      vendor: 'In-N-Out Burger',
      total: 19.75,
      category: 'dining',
      items: [
        { name: 'Double-Double (2)', quantity: 2, price: 10.98, baselinePrice: 8.98, percentChange: 22 },
        { name: 'Fries (2)', quantity: 2, price: 5.98, baselinePrice: 4.98, percentChange: 20 },
        { name: 'Shakes (2)', quantity: 2, price: 5.79, baselinePrice: 4.98, percentChange: 16 },
      ],
    },
  ];

  private static subscriptions: Subscription[] = [
    { id: '1', name: 'Netflix Premium', monthlyCost: 22.99, lastUsed: '2026-02-01', category: 'Entertainment' },
    { id: '2', name: 'Spotify Premium', monthlyCost: 10.99, lastUsed: '2026-02-18', category: 'Music' },
    { id: '3', name: 'Adobe Creative Cloud', monthlyCost: 54.99, lastUsed: '2025-11-15', category: 'Software' },
    { id: '4', name: 'Planet Fitness', monthlyCost: 24.99, lastUsed: '2025-09-22', category: 'Fitness' },
    { id: '5', name: 'HelloFresh', monthlyCost: 89.94, lastUsed: '2026-01-12', category: 'Food' },
    { id: '6', name: 'Audible', monthlyCost: 14.95, lastUsed: '2025-08-03', category: 'Entertainment' },
    { id: '7', name: 'NYTimes Digital', monthlyCost: 17.00, lastUsed: '2026-02-10', category: 'News' },
    { id: '8', name: 'LinkedIn Premium', monthlyCost: 39.99, lastUsed: '2025-06-14', category: 'Professional' },
  ];

  private static userProfile: UserProfile = {
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    joinedDate: '2024-01-15',
    isPro: true,
    avatar: 'AC',
  };

  private static monthlySpend: MonthlySpend[] = [
    { month: 'Aug', amount: 1847 },
    { month: 'Sep', amount: 2134 },
    { month: 'Oct', amount: 1923 },
    { month: 'Nov', amount: 2456 },
    { month: 'Dec', amount: 2891 },
    { month: 'Jan', amount: 2234 },
    { month: 'Feb', amount: 1567 },
  ];

  static getReceipts(): Receipt[] {
    return this.receipts;
  }

  static getReceipt(id: string): Receipt | undefined {
    return this.receipts.find(r => r.id === id);
  }

  static getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  static getUserProfile(): UserProfile {
    return this.userProfile;
  }

  static getMonthlySpend(): MonthlySpend[] {
    return this.monthlySpend;
  }

  static getCategorySpend(): CategorySpend[] {
    const categories = this.receipts.reduce((acc, receipt) => {
      const category = receipt.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += receipt.total;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

    return Object.entries(categories).map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount,
      percentage: Math.round((amount / total) * 100),
    }));
  }

  static getTotalInflationHit(): number {
    return this.receipts.reduce((total, receipt) => {
      const receiptInflation = receipt.items.reduce((sum, item) => {
        const difference = (item.price - item.baselinePrice) * item.quantity;
        return sum + difference;
      }, 0);
      return total + receiptInflation;
    }, 0);
  }

  static getYearToDateInflation(): number {
    return 1247;
  }

  static getRageScore(): number {
    const avgInflation = this.getTotalInflationHit() / this.receipts.length;
    return Math.min(100, Math.round(avgInflation * 5));
  }

  static getMostOverpricedItems(): Array<{ name: string; vendor: string; percentChange: number }> {
    const allItems: Array<{ name: string; vendor: string; percentChange: number }> = [];
    
    this.receipts.forEach(receipt => {
      receipt.items.forEach(item => {
        if (item.percentChange > 0) {
          allItems.push({
            name: item.name,
            vendor: receipt.vendor,
            percentChange: item.percentChange,
          });
        }
      });
    });

    return allItems
      .sort((a, b) => b.percentChange - a.percentChange)
      .slice(0, 5);
  }

  static simulateScan(): Receipt {
    const randomIndex = Math.floor(Math.random() * this.receipts.length);
    return this.receipts[randomIndex];
  }
}
