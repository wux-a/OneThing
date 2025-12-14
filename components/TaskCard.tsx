import React, { useEffect } from 'react';
import { Task } from '../types';
import { Button } from './Button';
import { formatLastDone } from '../utils/time';
import { Check, RefreshCw } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  lastCompletedAt: number | null;
  onComplete: () => void;
  onSkip: () => void;
  isAnimating: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  lastCompletedAt, 
  onComplete, 
  onSkip,
  isAnimating
}) => {
  
  // Enter animation effect
  const containerClass = `
    w-full max-w-sm bg-morandi-card dark:bg-morandi-cardDark 
    rounded-[2rem] shadow-2xl p-8 text-center
    transform transition-all duration-500
    ${isAnimating ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
  `;

  return (
    <div className={containerClass}>
      {/* Icon Area */}
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 bg-morandi-bg dark:bg-stone-800 rounded-full flex items-center justify-center text-5xl shadow-inner">
          {task.icon}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 text-stone-800 dark:text-stone-100">
        {task.title}
      </h2>

      {/* Last Done Info */}
      <div className="h-6 mb-8">
        {lastCompletedAt ? (
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
            上次: {formatLastDone(lastCompletedAt)}
          </p>
        ) : (
          <p className="text-xs font-medium text-transparent select-none">First time</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button onClick={onComplete} className="w-full text-lg">
          <Check size={20} />
          完成
        </Button>
        
        <Button variant="ghost" onClick={onSkip} className="w-full text-sm py-2">
          <RefreshCw size={14} className={isAnimating ? 'animate-spin' : ''} />
          换一个
        </Button>
      </div>
    </div>
  );
};
