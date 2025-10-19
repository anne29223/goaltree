import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const displayProgress = Math.round(progress);
  
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1 overflow-hidden">
      <div
        className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${displayProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;