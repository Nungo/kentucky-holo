import { create } from 'zustand';

export type MenuItem = {
  id: string;
  name: string;
  discovered: boolean;
  clicks: number;
};

interface MenuStore {
  items: MenuItem[];
  totalScore: number;
  genAlphaScore: number;
  genZScore: number;
  millennialScore: number;
  genXScore: number;
  boomerScore: number;
  userGeneration: 'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer' | null;
  setUserGeneration: (gen: 'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer') => void;
  discoverItem: (id: string) => void;
  resetProgress: () => void;
}

const initialItems: MenuItem[] = [
  { id: 'bucket', name: 'Original Recipe Bucket', discovered: false, clicks: 0 },
  { id: 'chicken', name: 'Crispy Chicken Piece', discovered: false, clicks: 0 },
  { id: 'burger', name: 'Zinger Burger', discovered: false, clicks: 0 },
  { id: 'fries', name: 'Colonel Fries', discovered: false, clicks: 0 },
  { id: 'wings', name: 'Hot Wings', discovered: false, clicks: 0 },
];

export const useMenuStore = create<MenuStore>((set) => ({
  items: initialItems,
  totalScore: 0,
  genAlphaScore: 0,
  genZScore: 0,
  millennialScore: 0,
  genXScore: 0,
  boomerScore: 0,
  userGeneration: null,

  setUserGeneration: (gen) => set({ userGeneration: gen }),
  
  discoverItem: (id) => set((state) => {
    const itemIndex = state.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return state;

    const newItems = [...state.items];
    const item = newItems[itemIndex];
    
    const wasDiscovered = item.discovered;
    newItems[itemIndex] = {
      ...item,
      discovered: true,
      clicks: item.clicks + 1,
    };

    const pointsToAdd = wasDiscovered ? 0 : 100;
    
    return {
      items: newItems,
      totalScore: state.totalScore + pointsToAdd,
      genAlphaScore: state.userGeneration === 'genalpha' 
        ? state.genAlphaScore + pointsToAdd 
        : state.genAlphaScore,
      genZScore: state.userGeneration === 'genz' 
        ? state.genZScore + pointsToAdd 
        : state.genZScore,
      millennialScore: state.userGeneration === 'millennial' 
        ? state.millennialScore + pointsToAdd 
        : state.millennialScore,
      genXScore: state.userGeneration === 'genx' 
        ? state.genXScore + pointsToAdd 
        : state.genXScore,
      boomerScore: state.userGeneration === 'boomer' 
        ? state.boomerScore + pointsToAdd 
        : state.boomerScore,
    };
  }),

  resetProgress: () => set({
    items: initialItems,
    totalScore: 0,
    genAlphaScore: 0,
    genZScore: 0,
    millennialScore: 0,
    genXScore: 0,
    boomerScore: 0,
    userGeneration: null,
  }),
}));