import React, { useState } from 'react';
import { Send, Tag, LayoutGrid, Calendar, Clock, Sparkles, Loader2, Target, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../utils';
import { getIcon } from '../utils/icons';
import { aiService } from '../services/api';

const priorities = {
  high: { label: 'High', color: 'text-red-600 bg-red-100/70 dark:bg-red-900/30 border-red-200/50 dark:border-red-800/50' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-100/70 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-800/50' },
  low: { label: 'Low', color: 'text-green-600 bg-green-100/70 dark:bg-green-900/30 border-green-200/50 dark:border-green-800/50' },
  normal: { label: 'Normal', color: 'text-slate-600 bg-slate-100/70 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50' }
};

const AddTaskForm = ({ categories, onAddTask, onClose }) => {
  const { playCompletionSound } = useSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('normal');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'work');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleAISmartCategory = async () => {
    if (!title.trim()) {
      toast.error('Enter a task title first!');
      return;
    }

    setIsAIThinking(true);
    try {
      const categoryLabels = categories.map(c => c.label);
      const res = await aiService.categorize(title, categoryLabels);
      const suggestedLabel = res.data.category;

      const matchedCat = categories.find(c =>
        c.label.toLowerCase() === suggestedLabel.toLowerCase() ||
        suggestedLabel.toLowerCase().includes(c.id.toLowerCase())
      );

      if (matchedCat) {
        setSelectedCategory(matchedCat.id);
        toast.success(`AI suggested: ${matchedCat.label}`, { icon: '✨' });
      }
    } catch (err) {
      toast.error('AI Categorization failed');
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a task title!');
      return;
    }

    const finalDueDate = (dueDate && dueTime) ? `${dueDate}T${dueTime}` : dueDate || '';

    onAddTask({
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
        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-primary-500" />
            Task Title
          </label>
          <button
            type="button"
            onClick={handleAISmartCategory}
            disabled={isAIThinking}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-all border border-primary-100/50 dark:border-primary-800/50"
          >
            {isAIThinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span className="text-[10px] font-bold uppercase tracking-tight">Smart Suggest</span>
          </button>
        </div>
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
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <AlignLeft className="w-3.5 h-3.5 text-primary-500" />
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
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <LayoutGrid className="w-3.5 h-3.5 text-primary-500" />
          Category
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
                    ? "bg-primary-600 text-white border-primary-500 shadow-glow"
                    : "bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "text-white" : "text-primary-500")} />
                <span className="text-xs font-bold truncate tracking-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <Calendar className="w-3.5 h-3.5 text-primary-500" />
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input py-2.5 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <Clock className="w-3.5 h-3.5 text-primary-500" />
            Reminder Time
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
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <Tag className="w-3.5 h-3.5 text-primary-500" />
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
                    : cn(config.color, "hover:scale-105")
                )}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn btn-primary w-full py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-3"
        >
          <Send className="w-4 h-4" />
          Create Task
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
