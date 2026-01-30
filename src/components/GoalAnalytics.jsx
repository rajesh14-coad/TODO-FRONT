import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfDay, startOfWeek, startOfMonth, format, isWithinInterval, parseISO } from 'date-fns';

const GoalAnalytics = ({ goals = [] }) => {
  const [filter, setFilter] = useState('week');
  const [chartType, setChartType] = useState('bar');

  const filterData = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (filter) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = new Date(0); // Lifetime
    }

    // Group goals by date
    const groupedData = goals
      .filter(g => {
        const createdDate = g.createdAt ? parseISO(g.createdAt) : new Date();
        return createdDate >= startDate;
      })
      .reduce((acc, goal) => {
        const date = format(goal.createdAt ? parseISO(goal.createdAt) : new Date(), 'MMM dd');
        const existing = acc.find(d => d.date === date);

        if (existing) {
          existing.completed += goal.status === 'completed' ? 1 : 0;
          existing.inProgress += (goal.status === 'in_progress' || goal.status === 'not_started') ? 1 : 0;
          existing.total += 1;
          existing.hours += (goal.timeSpent || 0) / 3600;
        } else {
          acc.push({
            date,
            completed: goal.status === 'completed' ? 1 : 0,
            inProgress: (goal.status === 'in_progress' || goal.status === 'not_started') ? 1 : 0,
            total: 1,
            hours: (goal.timeSpent || 0) / 3600,
          });
        }
        return acc;
      }, []);

    return groupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [goals, filter]);

  const stats = useMemo(() => {
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in_progress' || g.status === 'not_started').length;
    const totalHours = goals.reduce((sum, g) => sum + ((g.timeSpent || 0) / 3600), 0);
    const completionRate = goals.length > 0 ? (completed / goals.length) * 100 : 0;

    return { completed, inProgress, totalHours, completionRate };
  }, [goals]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 shadow-xl">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-xs text-cyan-600 dark:text-cyan-400">Completed: {payload[0].payload.completed}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Active: {payload[0].payload.inProgress}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total: {payload[0].payload.total}</p>
            <p className="text-xs text-green-600 dark:text-green-400">Hours: {payload[0].payload.hours.toFixed(1)}h</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Analytics & History
        </h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Total Hours</span>
          </div>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalHours.toFixed(1)}h</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['today', 'week', 'month', 'lifetime'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl capitalize whitespace-nowrap transition-all ${filter === f
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 shadow-lg'
              : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
          >
            {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : f}
          </button>
        ))}
      </div>

      {/* Chart */}
      {filterData.length > 0 ? (
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completed"
                fill="#06b6d4"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                dataKey="inProgress"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No data for this period</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create goals to see analytics</p>
          </div>
        </div>
      )}

      {/* Completion Rate */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-300">Completion Rate</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.completionRate.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GoalAnalytics;
