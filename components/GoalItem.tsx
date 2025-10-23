import React, { useState, useMemo, useCallback } from 'react';
import { Goal } from '../types';
import ProgressBar from './ProgressBar';
import AddGoalForm from './AddGoalForm';
import { EditIcon, TrashIcon, PlusIcon, ChevronDownIcon, ChevronRightIcon, SparkleIcon, SpinnerIcon } from './icons';

interface GoalItemProps {
  goal: Goal;
  level: number;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
  onToggleComplete: (id: string) => void;
  onAddSubGoal: (name: string, parentId: string) => void;
  onGenerateSubGoals: (parentId: string, parentName: string) => Promise<void>;
}

const calculateProgress = (goal: Goal): number => {
  if (goal.isCompleted) return 100;
  if (goal.subGoals.length === 0) {
    return 0;
  }
  const totalProgress = goal.subGoals.reduce((sum, subGoal) => sum + calculateProgress(subGoal), 0);
  return totalProgress / goal.subGoals.length;
};

const GoalItem: React.FC<GoalItemProps> = ({ goal, level, onDelete, onUpdateName, onToggleComplete, onAddSubGoal, onGenerateSubGoals }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(goal.name);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isLeaf = goal.subGoals.length === 0;
  const progress = useMemo(() => calculateProgress(goal), [goal]);

  const handleUpdate = useCallback(() => {
    if (editedName.trim()) {
      onUpdateName(goal.id, editedName.trim());
      setIsEditing(false);
    }
  }, [editedName, goal.id, onUpdateName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(goal.name);
    }
  };

  const handleAddSubGoal = (name: string) => {
    onAddSubGoal(name, goal.id);
    setIsAddingSubGoal(false);
    setIsExpanded(true);
  };
  
  const handleGenerateSubGoals = async () => {
    setIsGenerating(true);
    try {
        await onGenerateSubGoals(goal.id, goal.name);
        setIsExpanded(true);
    } catch (error) {
        // Error is handled in the hook
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDelete = () => {
    const message = `Are you sure you want to delete "${goal.name}"?`;
    const confirmationMessage = isLeaf ? message : `${message}\nThis will also delete all of its sub-goals.`;
    if (window.confirm(confirmationMessage)) {
        onDelete(goal.id);
    }
  };

  const marginLeft = `${level * 24}px`;

  return (
    <div className="bg-slate-800 rounded-lg transition-all duration-300">
      <div 
        className="flex items-center gap-2 p-3 group"
        style={{ marginLeft }}
      >
        {!isLeaf && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
            {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
        )}
        {isLeaf && (
           <input
            type="checkbox"
            checked={goal.isCompleted}
            onChange={() => onToggleComplete(goal.id)}
            className="ml-1 w-5 h-5 bg-slate-700 border-slate-600 rounded text-sky-500 focus:ring-sky-600 focus:ring-2 cursor-pointer transition-colors"
          />
        )}
        <div className="flex-grow">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-700 text-slate-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
          ) : (
            <span
              className={`text-slate-300 ${goal.isCompleted ? 'line-through text-slate-500' : ''}`}
              onDoubleClick={() => setIsEditing(true)}
            >
              {goal.name}
            </span>
          )}
          <ProgressBar progress={progress} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isLeaf && (
            <>
              <button
                onClick={handleGenerateSubGoals}
                className="p-2 rounded-md hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                title="Suggest sub-goals with AI"
                disabled={isGenerating}
              >
                {isGenerating ? <SpinnerIcon className="w-4 h-4" /> : <SparkleIcon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsAddingSubGoal(!isAddingSubGoal)}
                className="p-2 rounded-md hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 transition-colors"
                title="Add sub-goal"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-md hover:bg-yellow-500/10 text-slate-400 hover:text-yellow-400 transition-colors"
            title="Edit goal"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete goal"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isAddingSubGoal && !isLeaf &&(
          <div className="pl-12 pr-4 pb-3" style={{ marginLeft }}>
              <AddGoalForm onAddGoal={handleAddSubGoal} placeholder="New sub-goal..." />
          </div>
      )}
      
      {isExpanded && goal.subGoals.map(subGoal => (
        <GoalItem
          key={subGoal.id}
          goal={subGoal}
          level={level + 1}
          onDelete={onDelete}
          onUpdateName={onUpdateName}
          onToggleComplete={onToggleComplete}
          onAddSubGoal={onAddSubGoal}
          onGenerateSubGoals={onGenerateSubGoals}
        />
      ))}
    </div>
  );
};

export default GoalItem;
