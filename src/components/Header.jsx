import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, CheckSquare, User, LogOut, Settings, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

const Header = ({ onOpenInsights }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
          TaskMaster
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Auth Section */}
        <div className="relative">
          {user ? (
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-1.5 sm:px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-white/80 transition-all shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white overflow-hidden border-2 border-white dark:border-gray-800">
                  {user.avatar ? (
                    <img src={user.avatar} alt="P" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 hidden sm:inline">{user.name}</span>
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-60 bg-white dark:bg-gray-900 rounded-[28px] shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace Member</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white mt-1 truncate">{user.name}</p>
                      {user.phone && <p className="text-[10px] font-medium text-indigo-500 dark:text-indigo-400 mt-0.5">{user.phone}</p>}
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { onOpenInsights(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <BarChart2 className="w-4 h-4 text-indigo-500" />
                        My Insights
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(true); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              Sign In
            </motion.button>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-colors shrink-0"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </motion.button>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
};

export default Header;
