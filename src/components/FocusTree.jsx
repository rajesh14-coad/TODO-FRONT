import React from 'react';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const FocusTree = ({ totalHours = 0, missedGoals = 0 }) => {
  const getTreeStage = (hours) => {
    if (hours < 5) return { name: 'seed', emoji: '🌱', level: 1, next: 5 };
    if (hours < 20) return { name: 'sapling', emoji: '🌿', level: 2, next: 20 };
    if (hours < 50) return { name: 'young', emoji: '🌳', level: 3, next: 50 };
    if (hours < 100) return { name: 'mature', emoji: '🌲', level: 4, next: 100 };
    return { name: 'ancient', emoji: '🎄', level: 5, next: null };
  };

  const stage = getTreeStage(totalHours);
  const hasYellowLeaves = missedGoals > 0;
  const progress = stage.next ? ((totalHours / stage.next) * 100) : 100;

  const getMotivationalMessage = () => {
    if (stage.level === 5) return 'Maximum growth achieved! You are a focus master! 🏆';
    if (hasYellowLeaves) return 'Complete your goals to keep the tree healthy! 🌿';
    if (totalHours < 1) return 'Start your first goal to plant your tree! 🌱';
    return `Keep going! ${(stage.next - totalHours).toFixed(1)}h to reach the next stage!`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-cyan-500/5 pointer-events-none" />

      {/* Header */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            Your Focus Tree
          </h3>
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 dark:border-cyan-400/30">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Level {stage.level}</span>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="relative h-48 flex items-end justify-center mb-6">
          {/* Growth Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`text-8xl transition-all duration-1000 ${hasYellowLeaves ? 'opacity-70 grayscale-[30%]' : 'opacity-100'
              }`}
          >
            {stage.emoji}
          </motion.div>

          {/* Sparkles for max level */}
          {stage.level === 5 && (
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-0 right-1/4 text-4xl"
            >
              ✨
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        {stage.next && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
              <span>Progress to next stage</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Total Focus</span>
            </div>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{totalHours.toFixed(1)}h</p>
          </div>

          <div className={`p-3 rounded-xl border ${hasYellowLeaves
            ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
            : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'
            }`}>
            <div className="flex items-center gap-2 mb-1">
              {hasYellowLeaves ? (
                <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              <span className="text-xs text-slate-600 dark:text-slate-400">Status</span>
            </div>
            <p className={`text-sm font-bold ${hasYellowLeaves ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
              }`}>
              {hasYellowLeaves ? `${missedGoals} Missed` : 'Healthy'}
            </p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className={`p-4 rounded-xl border-l-4 ${hasYellowLeaves
          ? 'bg-yellow-500/5 border-yellow-500/50'
          : 'bg-cyan-500/5 border-cyan-500/50'
          }`}>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Stage Info */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Current Stage:</span>
            <span className="font-bold text-slate-900 dark:text-white capitalize">{stage.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusTree;
