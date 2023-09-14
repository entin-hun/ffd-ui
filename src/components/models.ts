export interface FoodData {
  components: {
    food: FoodComponent[];
    non_food: NonFoodComponent[];
  };
}

type UnitType = 'g' | 'ml';

interface Unit {
  type: UnitType;
  value: number;
}

export interface FoodComponent {
  name: string;
  'FDC ID'?: string;
  unit: Unit;
  color: string;
  nutrients: Nutrient[];
}

interface NonFoodComponent {
  /* ... */
}

interface Nutrient {
  type: string;
  value: number;
}
