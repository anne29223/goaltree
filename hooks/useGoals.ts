import { useState, useEffect, useCallback } from 'react';
import { Goal, Category } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const STORAGE_KEY = 'goalTreeData';

let ai: GoogleGenAI | null = null;
try {
    if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
}

// =================================================================
// Recursive Helper Functions (operate on Goal arrays)
// =================================================================

const addSubGoalRecursive = (goals: Goal[], parentId: string, newGoals: Goal[]): Goal[] => {
  return goals.map(goal => {
    if (goal.id === parentId) {
      return { ...goal, subGoals: [...goal.subGoals, ...newGoals] };
    }
    if (goal.subGoals.length > 0) {
        return { ...goal, subGoals: addSubGoalRecursive(goal.subGoals, parentId, newGoals) };
    }
    return goal;
  });
};

const deleteGoalRecursive = (goals: Goal[], goalId: string): Goal[] => {
  return goals
    .filter(goal => goal.id !== goalId)
    .map(goal => ({ ...goal, subGoals: deleteGoalRecursive(goal.subGoals, goalId) }));
};

const updateGoalNameRecursive = (goals: Goal[], goalId: string, newName: string): Goal[] => {
  return goals.map(goal => {
    if (goal.id === goalId) {
      return { ...goal, name: newName };
    }
    return { ...goal, subGoals: updateGoalNameRecursive(goal.subGoals, goalId, newName) };
  });
};

const toggleCompletionRecursive = (goals: Goal[], goalId: string): Goal[] => {
  return goals.map(goal => {
    if (goal.id === goalId) {
      if (goal.subGoals.length === 0) {
        return { ...goal, isCompleted: !goal.isCompleted };
      }
    }
    if (goal.subGoals.length > 0) {
        return { ...goal, subGoals: toggleCompletionRecursive(goal.subGoals, goalId) };
    }
    return goal;
  });
};

const syncCompletionStatusRecursive = (goals: Goal[]): Goal[] => {
    return goals.map(goal => {
        if (goal.subGoals.length === 0) {
            return goal;
        }
        
        const syncedSubGoals = syncCompletionStatusRecursive(goal.subGoals);
        const allSubGoalsCompleted = syncedSubGoals.every(sub => sub.isCompleted);

        return {
            ...goal,
            subGoals: syncedSubGoals,
            isCompleted: allSubGoalsCompleted,
        };
    });
};

// =================================================================
// Main Hook
// =================================================================

export const useGoalTree = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [categories]);
  
  const syncAndSetCategories = useCallback((updater: (cats: Category[]) => Category[]) => {
      setCategories(prevCategories => {
          const newCategories = updater(prevCategories);
          return newCategories.map(category => ({
              ...category,
              goals: syncCompletionStatusRecursive(category.goals)
          }));
      });
  }, []);

  // --- Category Management ---
  const addCategory = useCallback((name: string) => {
    const newCategory: Category = { id: crypto.randomUUID(), name, goals: [] };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category and all its goals?")) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  }, []);

  const updateCategoryName = useCallback((categoryId: string, newName: string) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, name: newName } : c));
  }, []);

  // --- Goal Management ---
  const addGoal = useCallback((name: string, categoryId: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      isCompleted: false,
      subGoals: [],
    };
    setCategories(prev => prev.map(c => 
      c.id === categoryId ? { ...c, goals: [...c.goals, newGoal] } : c
    ));
  }, []);

  const addSubGoal = useCallback((name: string, parentId: string) => {
    const newSubGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      isCompleted: false,
      subGoals: [],
    };
    syncAndSetCategories(cats => cats.map(c => ({
        ...c,
        goals: addSubGoalRecursive(c.goals, parentId, [newSubGoal])
    })));
  }, [syncAndSetCategories]);

  const deleteGoal = useCallback((goalId: string) => {
    syncAndSetCategories(cats => cats.map(c => ({
        ...c,
        goals: deleteGoalRecursive(c.goals, goalId)
    })));
  }, [syncAndSetCategories]);

  const updateGoalName = useCallback((goalId: string, newName: string) => {
    setCategories(prev => prev.map(c => ({
        ...c,
        goals: updateGoalNameRecursive(c.goals, goalId, newName)
    })));
  }, []);

  const toggleGoalCompletion = useCallback((goalId: string) => {
    syncAndSetCategories(cats => cats.map(c => ({
        ...c,
        goals: toggleCompletionRecursive(c.goals, goalId)
    })));
  }, [syncAndSetCategories]);

  const generateSubGoals = useCallback(async (parentId: string, parentName: string) => {
    if (!ai) {
        alert("AI features are disabled. API key not configured.");
        throw new Error("API Key not configured");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Break down the following goal into a few smaller, actionable sub-goals: "${parentName}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subGoals: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        const suggestions: string[] = result.subGoals || [];

        if (suggestions.length > 0) {
            const newSubGoals: Goal[] = suggestions.map((name: string) => ({
                id: crypto.randomUUID(),
                name,
                isCompleted: false,
                subGoals: [],
            }));
            
            syncAndSetCategories(cats => cats.map(c => ({
                ...c,
                goals: addSubGoalRecursive(c.goals, parentId, newSubGoals)
            })));
        }
    } catch (error) {
        console.error("Error generating sub-goals:", error);
        alert("Failed to generate sub-goals. Please check the console for details.");
        throw error;
    }
  }, [syncAndSetCategories]);

  return {
    categories,
    addCategory,
    deleteCategory,
    updateCategoryName,
    addGoal,
    addSubGoal,
    deleteGoal,
    updateGoalName,
    toggleGoalCompletion,
    generateSubGoals,
  };
};
