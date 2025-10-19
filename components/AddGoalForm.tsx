import React, { useState } from 'react';

interface AddGoalFormProps {
  onAddGoal: (name: string) => void;
  placeholder: string;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal, placeholder }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGoal(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="flex-grow bg-slate-700/50 text-slate-200 placeholder-slate-500 px-4 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
      />
      <button
        type="submit"
        className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed transition-colors"
        disabled={!name.trim()}
      >
        Add
      </button>
    </form>
  );
};

export default AddGoalForm;