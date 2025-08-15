export type Product = {
  name: string;
  price: number;
  servingSize: number;
  calories: number;
  proteins: number;
};

export type ProductNutritionFactsComparison = {
  name: string;
  caloriesPer100g: string;
  proteinsPer100g: string;
  caloriesPerCurrency: string;
  proteinsPerCurrency: string;
};
