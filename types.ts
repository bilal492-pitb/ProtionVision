export type AppView = 'home' | 'details' | 'camera';

export interface VisualObject {
  id: string;
  name: string;
  emoji: string;
  realWorldSize: string;
  dimensions?: string; // Added for modal display
  svgPath?: string;
}

export interface FoodItem {
  id: number | string;
  name: string;
  category: 'Protein' | 'Carbs' | 'Fats' | 'Produce' | 'Sweets' | 'Dairy' | 'Snacks' | 'Beverages';

  // Fields used in App.tsx
  servingGrams?: number;
  servingLabel?: string;
  visualObjects?: string[];

  // Fields used in constants.ts and components
  calories?: number;
  portionSize?: string;
  visualReference?: string;
  referenceIcon?: 'rect' | 'circle' | 'sphere' | 'hand';
  description?: string;
  color?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  foodName: string;
  objectName: string;
  emoji: string;
  calories?: number;  // Added for analytics
  category?: string;  // Added for category breakdown
}