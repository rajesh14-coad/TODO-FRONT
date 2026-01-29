import React, { useState, useEffect } from 'react';
import { Save, Tag, LayoutGrid, Calendar, Clock, X, Target, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../utils';
import { getIcon } from '../utils/icons';

const priorities = {
  high: { label: 'High', color: 'text-red-600 bg-red-100/70 dark:bg-red-900/30 border-red-200/50 dark:border-red-800/50' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-100/70 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50' },
  low: { label: 'Low', color: 'text-green-600 bg-green-100/70 dark:bg-green-900/30 border-green-200/50 dark:border-green-800/50' },
  normal: { label: 'Normal', color: 'text-slate-600 bg-slate-100/70 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50' }
};

const EditTaskForm = ({ task, categories, onSave, onClose }) => {
  const { playCompletionSound } = useSettings();
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [selectedPriority, setSelectedPriority] = useState(task.priority || 'normal');
  const [selectedCategory, setSelectedCategory] = useState(task.category || categories[0]?.id || 'work');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  useEffect(() => {
    if (task.dueDate) {
      const dateObj = new Date(task.dueDate);
      if (!isNaN(dateObj)) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);

        const hh = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        setDueTime(`${hh}:${min}`);
      }
    }
  }, [task.dueDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a task title!');
      return;
    }

    const finalDueDate = (dueDate && dueTime) ? `${dueDate}T${dueTime}` : dueDate || '';

    onSave(task._id || task.id, {
      title: title.trim(),
      description: description.trim(),
      priority: selectedPriority,
      category: selectedCategory,
      dueDate: finalDueDate
    });

    playCompletionSound();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
          <Target className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          Edit Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          className="input font-semibold"
        />
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
          <AlignLeft className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any additional context..."
          rows={3}
          className="input py-3 resize-none font-medium text-sm"
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
          <LayoutGrid className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          Department / Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.slice(0, 6).map((cat) => {
            const Icon = getIcon(cat.icon);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-300",
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-indigo-500 dark:to-blue-600 text-white border-blue-400/50 shadow-lg"
                    : "bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "text-white" : "text-blue-500 dark:text-blue-400")} />
                <span className="text-xs font-bold truncate tracking-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            Deadline Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input py-2.5 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
            <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            Remind At
          </label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="input py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Priority Level */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
          <Tag className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          Priority Level
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(priorities).map(([key, config]) => {
            const isSelected = selectedPriority === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPriority(key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
                    : "bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10"
                )}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn btn-secondary text-sm font-bold uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-[2] btn btn-primary py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-3"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
