export type MarketZone =
  | 'โซนของสดริมน้ำ'
  | 'โซนสตรีทฟู้ด & กับข้าว'
  | 'โซนผักผลไม้'
  | 'โซนขนม & เครื่องดื่ม';

export type ItemCategory = 'seafood' | 'streetfood' | 'produce' | 'dessert';

export type MealTime = 'morning' | 'lunch' | 'dinner' | 'snack';

export type CravingStyle = 'all' | 'seafood' | 'streetfood' | 'fresh' | 'dessert';

export interface ItemPairing {
  targetId: string;
  reason: string;
  synergyType: 'complement' | 'dipping' | 'drink' | 'bundle';
}

export interface MarketItem {
  id: string;
  name: string;
  stall: string;
  zone: MarketZone;
  category: ItemCategory;
  price: number;
  unit: string;
  prepMinutes: number;
  popularityScore: number;
  image: string;
  description: string;
  inStock: boolean;
  substituteId?: string;
  substituteReason?: string;
  mealTimes: MealTime[];
  tags: string[];
  pairings: ItemPairing[];
}

export interface CartItem {
  item: MarketItem;
  quantity: number;
  note: string;
}

export interface CustomErrandItem {
  id: string;
  name: string;
  stallHint: string;
  zone: MarketZone;
  estimatedPrice: number;
  quantity: number;
  note: string;
}

export interface SuggestionPreferences {
  mealTime: MealTime;
  peopleCount: 1 | 2 | 4;
  budget: 150 | 350 | 700;
  craving: CravingStyle;
}

export interface BundleSuggestion {
  title: string;
  subtitle: string;
  items: { item: MarketItem; quantity: number; role: string }[];
  totalPrice: number;
  zonesUsed: MarketZone[];
  estimatedRunnerFee: number;
  savingsNote: string;
}

export interface PairingSuggestion {
  item: MarketItem;
  reason: string;
  sameZoneFree: boolean;
  pairedWithNames: string[];
}

export type UserRole = 'requester' | 'runner';

export interface RunnerProfile {
  id: string;
  name: string;
  phone: string;
  currentZone: MarketZone;
  activeSlot: string;
  isAvailable: boolean;
  completedTrips: number;
  note: string;
}

export type OrderStatus = 'received' | 'shopping' | 'delivering' | 'completed';

export interface ErrandOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  deliveryPoint: string;
  deliverySlot: string;
  paymentMethod: 'cod' | 'promptpay';
  items: {
    id: string;
    name: string;
    stall: string;
    zone: MarketZone;
    price: number;
    quantity: number;
    note?: string;
    checked?: boolean;
  }[];
  customItems: (CustomErrandItem & { checked?: boolean })[];
  subtotal: number;
  runnerFee: number;
  total: number;
  status: OrderStatus;
  runnerId?: string;
  runnerName: string;
  runnerPhone: string;
  statusNote: string;
  qrDispatch?: {
    sentAt: string;
    mode: 'picklist' | 'promptpay';
    note?: string;
    slipAttachedName?: string;
  };
}
