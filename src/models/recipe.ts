export interface Recipe {
  _id?: string;
  name: string;
  origin?: string;
  ingredients: string[];
  difficulty: number;
  recipe: string[];
  cookingDuration?: string;
  imageUrl?: string;
  createdBy?: string;
  createdByUsername?: string;
  viewCount?: number;
  lastViewedAt?: string;
  visibility?: 'public' | 'private';
}