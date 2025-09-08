export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  servingSize?: number;
};

export type Ingredient = {
  name?: string;
  price: number;
  quantity: number;
  quantityUsed: number;
};
