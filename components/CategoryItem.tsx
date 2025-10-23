import React, { useState } from 'react';
import { Category } from '../types';
import AddGoalForm from './AddGoalForm';
import GoalItem from './GoalItem';
import { EditIcon, TrashIcon, FolderIcon, ChevronDownIcon, ChevronRightIcon } from './icons';
import { showAlert } from './CustomAlert';

interface GoalActions {
  onDelete: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  onToggleComplete: (id: string) => void;
  onAddSubGoal: (name: string, parentId: string) => void;
  onGenerateSubGoals: (parentId: string, parentName: string) => Promise<void>;
}

interface CategoryItemProps {
  category: Category;
  onDeleteCategory: (id: string) => void;
  onUpdateCategoryName: (id: string, newName: string) => void;
  onAddGoal: (name: string, categoryId: string) => void;
  goalActions: GoalActions;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
    category, 
    onDeleteCategory, 
    onUpdateCategoryName, 
    onAddGoal, 
    goalActions 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = () => {
    if (editedName.trim() && editedName.trim() !== category.name) {
      onUpdateCategoryName(category.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUpdate();
    else if (e.key === 'Escape') {
      setEditedName(category.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-slate-800/70 rounded-xl shadow-md border border-slate-700/50">
      <header className="flex items-center p-4 border-b border-slate-700/50 group">
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-slate-400 hover:text-slate-200 mr-2">
            {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
        </button>
        <FolderIcon className="w-6 h-6 text-sky-400/80 mr-3" />
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-slate-700 text-slate-100 rounded-md px-2 py-1 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
        ) : (
          <h2 onDoubleClick={() => setIsEditing(true)} className="flex-grow text-xl font-bold text-slate-200 cursor-pointer">
            {category.name}
          </h2>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => setIsEditing(true)} className="p-2 rounded-md hover:bg-yellow-500/10 text-slate-400 hover:text-yellow-400 transition-colors" title="Edit category name">
                <EditIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => showAlert({
                    title: "Delete Category",
                    message: "Are you sure you want to delete this category and all its goals?",
                    onConfirm: () => onDeleteCategory(category.id)
                })} 
                className="p-2 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" 
                title="Delete category"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
      </header>
      
      {isExpanded && (
        <div className="p-4">
            <div className="pl-4 mb-4">
                <AddGoalForm 
                    onAddGoal={(name) => onAddGoal(name, category.id)}
                    placeholder="Add a new main goal..."
                />
            </div>
            <div className="space-y-2">
                {category.goals.length > 0 ? (
                    category.goals.map(goal => (
                        <GoalItem
                            key={goal.id}
                            goal={goal}
                            level={0}
                            {...goalActions}
                        />
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-4">This category has no goals yet.</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
