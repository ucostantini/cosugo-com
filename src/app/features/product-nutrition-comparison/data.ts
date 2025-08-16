export type Product = {
  name: string;
  price: number;
  weight: number;
  servingSize: number;
  calories: number;
  proteins: number;
};

export type NormalizedProduct = {
  name: string;
  caloriesPer100g: string;
  proteinsPer100g: string;
  caloriesPerCurrency: string;
  proteinsPerCurrency: string;
};
