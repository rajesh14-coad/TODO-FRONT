import React, { useState } from 'react';
import { GraduationCap, Plus, Target, Clock, Trophy, Play, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import MobileTabBar from '../components/MobileTabBar';
import Modal from '../components/Modal';
import GoalCreationForm from '../components/GoalCreationForm';
import ShieldMode from '../components/ShieldMode';
import useLocalStorage from '../hooks/useLocalStorage';

const StudentPortal = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [goals, setGoals] = useLocalStorage('student_goals', []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [isShieldMode, setIsShieldMode] = useState(false);

  const handleCreateGoal = (goalData) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goalData,
      createdAt: new Date().toISOString(),
      status: 'not_started',
      timeSpent: 0,
      sessions: [],
    };
    setGoals([...goals, newGoal]);
    setIsCreateModalOpen(false);
  };

  const handleStartGoal = (goal) => {
    setActiveGoal(goal);
    setIsShieldMode(true);
  };

  const handleCompleteSession = (goalId, timeSpent) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const totalTimeSpent = goal.timeSpent + timeSpent;
        const totalTimeGoal = goal.totalTime * 3600;
        const isCompleted = totalTimeSpent >= totalTimeGoal;

        return {
          ...goal,
          timeSpent: totalTimeSpent,
          status: isCompleted ? 'completed' : 'in_progress',
          sessions: [
            ...goal.sessions,
            {
              date: new Date().toISOString(),
              duration: timeSpent,
            }
          ],
        };
      }
      return goal;
    }));
    setIsShieldMode(false);
    setActiveGoal(null);
  };

  const activeGoals = goals.filter(g => g.status === 'in_progress' || g.status === 'not_started');
  const completedGoals = goals.filter(g => g.status === 'completed');

  // Shield Mode renders without navigation
  if (isShieldMode && activeGoal) {
    return (
      <ShieldMode
        goal={activeGoal}
        onComplete={(timeSpent) => handleCompleteSession(activeGoal.id, timeSpent)}
        onExit={() => setIsShieldMode(false)}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Sidebar - Persistent Navigation */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 md:pb-10 relative" style={{ overscrollBehaviorY: 'contain' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight">
                    Student Portal
                  </h1>
                  <p className="text-cyan-400 mt-1 font-medium">
                    Master your goals with focused study sessions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Goal</span>
              </button>
            </div>
          </motion.div>

          {/* Active Goals Section */}
          {activeGoals.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-cyan-400" />
                Active Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal) => (
                  <PremiumGoalCard
                    key={goal.id}
                    goal={goal}
                    onStart={() => handleStartGoal(goal)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Achievements Section */}
          {completedGoals.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {completedGoals.map((goal) => (
                  <AchievementBadge key={goal.id} goal={goal} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {goals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-md bg-white/5 border border-cyan-500/20 rounded-3xl p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
                <GraduationCap className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                Start Your Learning Journey
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                Create your first goal and enter Shield Mode for distraction-free studying
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
              >
                Create Your First Goal
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Tab Bar - Persistent Navigation */}
      <MobileTabBar />

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Goal"
      >
        <GoalCreationForm
          onSubmit={handleCreateGoal}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Premium Goal Card Component
const PremiumGoalCard = ({ goal, onStart }) => {
  const progress = (goal.timeSpent / (goal.totalTime * 3600)) * 100;
  const hoursSpent = Math.floor(goal.timeSpent / 3600);
  const minutesSpent = Math.floor((goal.timeSpent % 3600) / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="backdrop-blur-md bg-white/5 border border-cyan-500/20 rounded-3xl p-6 shadow-xl hover:shadow-cyan-500/20 transition-all group"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {goal.name}
        </h3>
        {goal.description && (
          <p className="text-slate-400 text-sm line-clamp-2">
            {goal.description}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400 font-medium">Progress</span>
          <span className="font-bold text-cyan-400">
            {hoursSpent}h {minutesSpent}m / {goal.totalTime}h
          </span>
        </div>
        <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onStart}
        className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        {goal.status === 'in_progress' ? 'Continue' : 'Start'} Goal
      </button>

      {/* Sessions Info */}
      {goal.sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {goal.sessions.length} session{goal.sessions.length !== 1 ? 's' : ''} completed
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Achievement Badge Component
const AchievementBadge = ({ goal }) => {
  const hoursCompleted = Math.floor(goal.timeSpent / 3600);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="backdrop-blur-md bg-white/5 border border-yellow-500/20 rounded-2xl p-4 text-center shadow-lg hover:shadow-yellow-500/20 transition-all"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
        <Award className="w-6 h-6 text-yellow-400" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
        {goal.name}
      </h4>
      <p className="text-xs text-yellow-400 font-semibold">
        {hoursCompleted}h completed
      </p>
    </motion.div>
  );
};

export default StudentPortal;
