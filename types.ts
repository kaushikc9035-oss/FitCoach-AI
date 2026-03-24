export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active',
  SuperActive = 'Super Active'
}

export enum FitnessGoal {
  LoseWeight = 'Lose Weight',
  Maintain = 'Maintain Weight',
  GainMuscle = 'Build Muscle'
}

export enum FoodPreference {
  Vegetarian = 'Vegetarian',
  NonVeg = 'Non-Vegetarian',
  Vegan = 'Vegan',
  Keto = 'Keto',
  Paleo = 'Paleo'
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface UserProfile {
  id: string;
  email: string;
  password?: string; // Added password field
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  healthIssues?: string;
  createdAt: string;
  weightLogs?: WeightLog[];
}

export interface MealItem {
  name: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyMealPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  totalCalories: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string; // e.g., "Day 1 - Push"
  exercises: Exercise[];
}

export interface GeneratedPlan {
  dietPlan: {
    dailyMacros: MacroNutrients;
    sampleDay: DailyMealPlan;
    hydrationTips: string;
  };
  workoutPlan: {
    frequency: string;
    routine: WorkoutDay[];
  };
  summary: string;
}