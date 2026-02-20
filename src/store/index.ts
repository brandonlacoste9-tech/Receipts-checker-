import { create } from 'zustand';
import type { Receipt, UserProfile } from '../types';
import { MockDataService } from '../services/mockData';

interface AppState {
  receipts: Receipt[];
  currentReceipt: Receipt | null;
  userProfile: UserProfile;
  isScanning: boolean;
  setCurrentReceipt: (receipt: Receipt | null) => void;
  addReceipt: (receipt: Receipt) => void;
  setIsScanning: (scanning: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  receipts: MockDataService.getReceipts(),
  currentReceipt: null,
  userProfile: MockDataService.getUserProfile(),
  isScanning: false,
  setCurrentReceipt: (receipt) => set({ currentReceipt: receipt }),
  addReceipt: (receipt) => set((state) => ({ receipts: [receipt, ...state.receipts] })),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
}));
