import React from 'react';
import { Home, CheckSquare, Settings, GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/student', label: 'Student', icon: GraduationCap },
    { id: '/profile', label: 'Profile', icon: CheckSquare },
    { id: '/settings', label: 'Settings', icon: Settings },
  ];

  const currentPath = location.pathname;

  return (
    <div className="mobile-tab-bar md:hidden">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center gap-1 px-6 py-2 rounded-2xl
                transition-all duration-300 relative
                ${isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400'
                }
              `}
            >
              {/* RGB Glow Effect for Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-indigo-500/20 dark:to-blue-600/20 rounded-2xl"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <Icon
                className={`w-6 h-6 relative z-10 ${isActive ? 'animate-bounce-gentle' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Label */}
              <span className={`text-xs font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileTabBar;
