import React, { useState } from 'react';
import { Target, Clock, FileText, Sparkles } from 'lucide-react';
import ProfessionalTimePicker from './ProfessionalTimePicker';

const GoalCreationForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || 1);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!totalTime || totalTime <= 0) {
      newErrors.totalTime = 'Total time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      totalTime: parseFloat(totalTime),
    });

    // Reset form only if not editing
    if (!initialData) {
      setName('');
      setDescription('');
      setTotalTime(1);
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Premium Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-slate-400 text-center mb-8">
          अपना Goal चुनें (Choose Your Goal)
        </p>
      </div>

      {/* Goal Name */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-500" />
            Goal Name
          </div>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Study Physics, Learn React, Master Calculus"
          className={`w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 ${errors.name
            ? 'border-red-500'
            : 'border-transparent focus:border-cyan-500'
            } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span> {errors.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-500" />
            Description <span className="text-slate-400 font-normal">(Optional)</span>
          </div>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What do you want to achieve with this goal?"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-cyan-500 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Total Time */}
      <div>
        <ProfessionalTimePicker
          value={totalTime || 1}
          onChange={setTotalTime}
        />
        {errors.totalTime && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span> {errors.totalTime}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
        >
          रद्द करें (Cancel)
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
        >
          {initialData ? 'Update Goal' : 'बनाएं (Create)'}
        </button>
      </div>
    </form>
  );
};

export default GoalCreationForm;
