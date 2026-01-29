import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import { CheckCircle2 } from 'lucide-react';

const TaskList = ({ tasks, onToggle, onDelete, onEdit, onAIBreakdown }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Create your first task to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onAIBreakdown={onAIBreakdown}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
