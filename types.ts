export interface Goal {
  id: string;
  name: string;
  isCompleted: boolean;
  subGoals: Goal[];
}

export interface Category {
  id: string;
  name: string;
  goals: Goal[];
}
