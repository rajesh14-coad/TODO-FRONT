import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '../utils';

const priorities = {
  '!high': 'high',
  '!medium': 'medium',
  '!low': 'low'
};

const TaskInput = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a task title!');
      return;
    }

    let priority = 'normal';
    let cleanTitle = title;

    // Check for priority tags
    Object.keys(priorities).forEach(tag => {
      if (cleanTitle.toLowerCase().includes(tag)) {
        priority = priorities[tag];
        cleanTitle = cleanTitle.replace(new RegExp(tag, 'gi'), '').trim();
      }
    });

    onAddTask({ title: cleanTitle, description: description.trim(), priority });
    setTitle('');
    setDescription('');
    setShowDescription(false);
    toast.success('Task added successfully!');
  };

  const detectedPriority = Object.keys(priorities).find(tag => title.toLowerCase().includes(tag));

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative group z-50",
        "fixed bottom-6 left-4 right-4 md:static md:mb-8"
      )}
    >
      <div className={cn(
        "flex flex-col gap-2 p-2 rounded-2xl transition-all duration-300",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl",
        isFocused && "ring-2 ring-indigo-500/50 shadow-indigo-500/20 transform scale-[1.01]"
      )}>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            animate={{ rotate: showDescription ? 45 : 0 }}
            className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="New Task Title... (Try !high)"
            className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 font-medium h-10"
          />

          <AnimatePresence>
            {detectedPriority && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={cn(
                  "px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide",
                  detectedPriority === '!high' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                  detectedPriority === '!medium' && "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
                  detectedPriority === '!low' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                )}
              >
                {priorities[detectedPriority]}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            type="submit"
            className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional description..."
                className="w-full bg-transparent border-t border-gray-200 dark:border-gray-700/50 p-2 mt-2 text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none resize-none h-20"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper text for desktop */}
      <div className="absolute -bottom-6 left-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        Press + to add description • Use !high for importance
      </div>
    </form>
  );
};

export default TaskInput;
