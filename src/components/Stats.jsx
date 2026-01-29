import React from 'react';
import { CheckCircle2, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'bg-green-500/10 dark:bg-green-400/10',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'bg-amber-500/10 dark:bg-amber-400/10',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'bg-red-500/10 dark:bg-red-400/10',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${stat.bgGradient} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-white/20`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.label === 'Completed' && totalTasks > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100/70 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {completionRate}%
                </span>
              )}
            </div>

            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Stats;
