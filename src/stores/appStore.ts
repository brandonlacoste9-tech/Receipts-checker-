import { create } from 'zustand';
import type { Receipt, UserProfile, UserStats } from '../types';
import { mockDataService } from '../services/mockData';

interface AppState {
  receipts: Receipt[];
  currentReceipt: Receipt | null;
  userProfile: UserProfile;
  userStats: UserStats;
  isScanning: boolean;
  
  // Actions
  setCurrentReceipt: (receipt: Receipt | null) => void;
  scanReceipt: (file: File) => Promise<Receipt>;
  addReceipt: (receipt: Receipt) => void;
  setIsScanning: (isScanning: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  receipts: mockDataService.getAllReceipts(),
  currentReceipt: null,
  userProfile: mockDataService.getUserProfile(),
  userStats: mockDataService.getUserStats(),
  isScanning: false,
  
  setCurrentReceipt: (receipt) => set({ currentReceipt: receipt }),
  
  scanReceipt: async (_file: File) => {
    set({ isScanning: true });
    try {
      const receipt = await mockDataService.scanReceipt();
      set({ currentReceipt: receipt, isScanning: false });
      return receipt;
    } catch (error) {
      set({ isScanning: false });
      throw error;
    }
  },
  
  addReceipt: (receipt) => {
    const receipts = [...get().receipts, receipt];
    set({ receipts });
  },
  
  setIsScanning: (isScanning) => set({ isScanning }),
}));
