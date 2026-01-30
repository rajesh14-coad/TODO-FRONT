import React from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfessionalTimePicker = ({ value, onChange }) => {
  const quickOptions = [
    { label: '30m', hours: 0.5 },
    { label: '1h', hours: 1 },
    { label: '2h', hours: 2 },
    { label: '4h', hours: 4 },
    { label: '8h', hours: 8 },
  ];

  const formatTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Select Buttons */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          <Clock className="w-4 h-4 text-cyan-500" />
          जल्दी चुनें (Quick Select)
        </label>
        <div className="flex gap-2 flex-wrap">
          {quickOptions.map((opt) => (
            <motion.button
              key={opt.hours}
              type="button"
              onClick={() => onChange(opt.hours)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-2.5 rounded-xl font-semibold transition-all backdrop-blur-xl
                ${value === opt.hours
                  ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          <Clock className="w-4 h-4 text-cyan-500" />
          समय दर्ज करें (Manual Input)
        </label>
        <div className="flex gap-3">
          {/* Hours Input with Plus/Minus */}
          <div className="flex-1">
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const hours = Math.max(0, Math.floor(value) - 1);
                  const minutes = (value % 1) * 60;
                  onChange(hours + minutes / 60);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Minus className="w-4 h-4 text-cyan-500" />
              </button>

              <input
                type="number"
                min="0"
                max="23"
                placeholder="0"
                value={Math.floor(value)}
                onChange={(e) => {
                  const hours = Math.max(0, parseInt(e.target.value) || 0);
                  const minutes = (value % 1) * 60;
                  onChange(hours + minutes / 60);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none text-center"
              />

              <button
                type="button"
                onClick={() => {
                  const hours = Math.min(23, Math.floor(value) + 1);
                  const minutes = (value % 1) * 60;
                  onChange(hours + minutes / 60);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-cyan-500" />
              </button>
            </div>
            <span className="text-xs text-slate-500 mt-1 block text-center">घंटे (Hours)</span>
          </div>

          {/* Minutes Input with Plus/Minus */}
          <div className="flex-1">
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const hours = Math.floor(value);
                  const minutes = Math.max(0, Math.round((value % 1) * 60) - 5);
                  onChange(hours + minutes / 60);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Minus className="w-4 h-4 text-cyan-500" />
              </button>

              <input
                type="number"
                min="0"
                max="59"
                step="5"
                placeholder="0"
                value={Math.round((value % 1) * 60)}
                onChange={(e) => {
                  const hours = Math.floor(value);
                  const minutes = Math.max(0, parseInt(e.target.value) || 0);
                  onChange(hours + minutes / 60);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-cyan-500/30 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none text-center"
              />

              <button
                type="button"
                onClick={() => {
                  const hours = Math.floor(value);
                  const minutes = Math.min(59, Math.round((value % 1) * 60) + 5);
                  onChange(hours + minutes / 60);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-cyan-500" />
              </button>
            </div>
            <span className="text-xs text-slate-500 mt-1 block text-center">मिनट (Minutes)</span>
          </div>
        </div>
      </div>

      {/* Custom Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Custom Time
          </label>
          <span className="text-lg font-bold text-cyan-400">
            {formatTime(value)}
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0.5"
            max="12"
            step="0.5"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="
              w-full h-2 rounded-full appearance-none cursor-pointer
              bg-gradient-to-r from-slate-700/30 to-slate-600/30
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-br
              [&::-webkit-slider-thumb]:from-cyan-400
              [&::-webkit-slider-thumb]:to-blue-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-cyan-500/50
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-gradient-to-br
              [&::-moz-range-thumb]:from-cyan-400
              [&::-moz-range-thumb]:to-blue-500
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:shadow-cyan-500/50
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer
            "
          />

          {/* Time markers */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-slate-500">30m</span>
            <span className="text-xs text-slate-500">6h</span>
            <span className="text-xs text-slate-500">12h</span>
          </div>
        </div>
      </div>

      {/* Visual Indicator */}
      <div className="glass-card p-4 border-l-4 border-cyan-500/50">
        <p className="text-sm text-slate-400">
          You'll focus for <span className="font-bold text-cyan-400">{formatTime(value)}</span> on this goal
        </p>
      </div>
    </div>
  );
};

export default ProfessionalTimePicker;
