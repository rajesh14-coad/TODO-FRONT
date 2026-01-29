import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Trophy, Target, Zap, Activity, BarChart2, Calendar,
  PieChart as PieChartIcon, TrendingUp, Clock
} from 'lucide-react';
import { cn } from '../utils';

const InsightsDashboard = ({ tasks, categories }) => {
  const [timeFilter, setTimeFilter] = useState('week'); // 'week' | 'month'

  const stats = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    const completedTasks = tasks.filter(t => t.completed);
    const completionRate = (completedTasks.length / tasks.length) * 100;

    // Calculate Streak (Simulated based on completedAt or createdAt)
    // For a real streak, we'd need sequential days of completions.
    // For now, let's check unique days in the last 30 days.
    const uniqueDays = new Set(
      completedTasks.map(t => new Date(t.completedAt || t.createdAt).toDateString())
    );
    const streak = uniqueDays.size; // Simple count of active days

    // Most Active Category
    const catCounts = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    const mostActiveCatId = Object.keys(catCounts).reduce((a, b) => catCounts[a] > catCounts[b] ? a : b, '');
    const mostActiveCat = categories.find(c => c.id === mostActiveCatId)?.label || 'None';

    return {
      total: tasks.length,
      completionRate: completionRate.toFixed(1),
      streak,
      mostActiveCat
    };
  }, [tasks, categories]);

  const weeklyData = useMemo(() => {
    // Last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const count = tasks.filter(t => {
        const tDate = new Date(t.completedAt || t.createdAt);
        return t.completed && tDate.toDateString() === d.toDateString();
      }).length;
      data.push({ name: dayName, completed: count });
    }
    return data;
  }, [tasks]);

  const monthlyData = useMemo(() => {
    // Current month trend (e.g., 4 weeks)
    const data = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const weekLabel = `Week ${4 - i}`;
      const start = new Date();
      start.setDate(now.getDate() - (i + 1) * 7);
      const end = new Date();
      end.setDate(now.getDate() - i * 7);

      const count = tasks.filter(t => {
        const tDate = new Date(t.completedAt || t.createdAt);
        return t.completed && tDate >= start && tDate <= end;
      }).length;
      data.push({ name: weekLabel, completed: count });
    }
    return data;
  }, [tasks]);

  const categoryBreakdown = useMemo(() => {
    const data = categories.map(cat => ({
      name: cat.label,
      value: tasks.filter(t => t.category === cat.id).length,
      color: cat.color.includes('indigo') ? '#6366f1' :
        cat.color.includes('purple') ? '#a855f7' :
          cat.color.includes('green') ? '#22c55e' :
            cat.color.includes('red') ? '#ef4444' : '#6366f1'
    })).filter(d => d.value > 0);
    return data;
  }, [tasks, categories]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
          <Activity className="w-12 h-12 text-indigo-500 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No Data Available Yet</h3>
        <p className="text-gray-500 mt-2 max-w-xs">Start completing tasks to see your productivity insights and trends!</p>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 pb-10">
      {/* Time Filter Toggle */}
      <div className="flex justify-center">
        <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex">
          <button
            onClick={() => setTimeFilter('week')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              timeFilter === 'week' ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-400"
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              timeFilter === 'month' ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-400"
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: Target, color: 'text-indigo-500' },
          { label: 'Completion', value: `${stats.completionRate}%`, icon: Trophy, color: 'text-amber-500' },
          { label: 'Active Days', value: stats.streak, icon: Zap, color: 'text-purple-500' },
          { label: 'Top Dept', value: stats.mostActiveCat, icon: Activity, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="glass-card p-4 rounded-3xl flex flex-col items-center text-center group hover:scale-105 transition-transform"
          >
            <div className={cn("p-2 rounded-xl mb-3 bg-white/50 dark:bg-gray-800/50", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Progress Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 rounded-[32px] rgb-animate min-h-[300px]"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Efficiency Trend</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {timeFilter === 'week' ? (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={20} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWave)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-[32px] rgb-animate min-h-[350px] overflow-visible"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-purple-500" />
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Focus Areas</h4>
          </div>
          <div className="w-full h-[300px]">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                No Category Data
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Productivity Motivation */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Productivity Score</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">You are more active in {stats.mostActiveCat} tasks recently. Keep it up!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
