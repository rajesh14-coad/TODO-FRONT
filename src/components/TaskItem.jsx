import React from 'react';
import { Check, Trash2, Edit2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const TaskItem = ({ task, onToggle, onDelete, onEdit, onAIBreakdown, index = 0 }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));
  const isDueTomorrow = task.dueDate && isTomorrow(new Date(task.dueDate));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100/70 dark:bg-red-900/30 border-red-200/50 dark:border-red-800/50';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100/70 dark:bg-green-900/30 border-green-200/50 dark:border-green-800/50';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50';
    }
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;
    if (isToday(new Date(task.dueDate))) return 'Today';
    if (isTomorrow(new Date(task.dueDate))) return 'Tomorrow';
    return format(new Date(task.dueDate), 'MMM dd, yyyy');
  };

  // Swipe gesture handler for mobile
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;

    if (info.offset.x > swipeThreshold) {
      // Swipe right - mark as complete
      onToggle(task._id, true);
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left - delete
      onDelete(task._id || task.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={`
        glass-card p-5 md:p-6 group cursor-grab active:cursor-grabbing
        ${task.completed ? 'opacity-60' : ''}
        ${isOverdue ? 'ring-2 ring-red-500/30' : ''}
      `}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(task._id, !task.completed)}
          className="mt-0.5 relative"
        >
          <div
            className={`
              w-6 h-6 rounded-lg border-2 transition-all duration-300
              ${task.completed
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-indigo-500 dark:to-blue-600 border-blue-400/50 shadow-lg'
                : 'border-slate-300 dark:border-white/20 bg-white/40 dark:bg-white/5 hover:border-blue-400'
              }
            `}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-5 h-5 text-white absolute top-0.5 left-0.5" strokeWidth={3} />
              </motion.div>
            )}
          </div>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-base font-semibold mb-2
              ${task.completed
                ? 'line-through text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-white'
              }
            `}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Badge */}
            {task.category && (
              <span className="badge badge-primary flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {task.category}
              </span>
            )}

            {/* Priority Badge */}
            {task.priority && task.priority !== 'normal' && (
              <span className={`badge ${getPriorityColor(task.priority)} flex items-center gap-1.5`}>
                <AlertCircle className="w-3 h-3" />
                {task.priority}
              </span>
            )}

            {/* Due Date Badge */}
            {task.dueDate && (
              <span
                className={`
                  badge flex items-center gap-1.5
                  ${isOverdue
                    ? 'badge-danger'
                    : isDueToday
                      ? 'badge-warning'
                      : 'bg-slate-100/70 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'
                  }
                `}
              >
                <Calendar className="w-3 h-3" />
                {getDueDateText()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="icon-btn p-2"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id || task.id)}
            className="icon-btn p-2 hover:bg-red-100/70 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
