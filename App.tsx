import React from 'react';
import { useGoalTree } from './hooks/useGoals';
import AddGoalForm from './components/AddGoalForm';
import { TargetIcon } from './components/icons';
import CategoryItem from './components/CategoryItem';

const App: React.FC = () => {
  const goalTree = useGoalTree();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <div className="bg-sky-500/10 p-3 rounded-lg">
             <TargetIcon className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Goal Tree</h1>
            <p className="text-slate-400">Organize your ambitions into categories and decompose them into manageable tasks.</p>
          </div>
        </header>

        <main>
          <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg border border-slate-700 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-slate-300">Add a New Category</h2>
            <AddGoalForm 
              onAddGoal={goalTree.addCategory} 
              placeholder="e.g., Health & Fitness, Career Development" 
            />
          </div>

          <div className="space-y-6">
            {goalTree.categories.length > 0 ? (
              goalTree.categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onDeleteCategory={goalTree.deleteCategory}
                  onUpdateCategoryName={goalTree.updateCategoryName}
                  onAddGoal={goalTree.addGoal}
                  goalActions={{
                    onDelete: goalTree.deleteGoal,
                    onUpdateName: goalTree.updateGoalName,
                    onToggleComplete: goalTree.toggleGoalCompletion,
                    onAddSubGoal: goalTree.addSubGoal,
                    onGenerateSubGoals: goalTree.generateSubGoals,
                  }}
                />
              ))
            ) : (
              <div className="text-center py-16 px-6 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                <h3 className="text-xl font-semibold text-slate-300">No categories yet!</h3>
                <p className="text-slate-400 mt-2">Create your first category above to start organizing your goals.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by Gemini, React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

export default App;