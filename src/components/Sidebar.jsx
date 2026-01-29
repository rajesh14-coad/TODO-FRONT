import React, { useState } from 'react';
import { Home, Search, User, Settings, ChevronLeft, ChevronRight, Sun, Moon, LogOut, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { mode, toggleMode } = useTheme();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: '/', label: 'Home', icon: Home },
        { id: '/student', label: 'Student Portal', icon: GraduationCap },
        { id: '/profile', label: 'Profile', icon: User },
        { id: '/settings', label: 'Settings', icon: Settings },
    ];

    const currentView = location.pathname;

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? '5rem' : '16rem' }}
                className="sidebar hidden md:flex flex-col h-screen sticky top-0"
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col cursor-pointer"
                                onClick={() => navigate('/')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-indigo-500 dark:to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        S
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Smart Todo</span>
                                </div>
                                {sessionStorage.getItem('offline_mode') === 'true' && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-1 ml-13">
                                        Localized Mode
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="icon-btn ml-auto"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                   w-full flex items-center gap-3 px-3 py-3 rounded-xl
                   transition-all duration-200
                   ${isActive
                                        ? 'bg-primary-100/70 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                                    }
                   ${isCollapsed ? 'justify-center' : ''}
                 `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 space-y-2 border-t border-slate-200/50 dark:border-slate-700/30">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleMode}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium"
                                >
                                    {mode === 'dark' ? 'Dark' : 'Light'} Mode
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* User Profile */}
                    {userInfo && (
                        <div className={`glass-panel p-2.5 ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shadow-inner">
                                {userInfo.profilePicture ? (
                                    <img src={userInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userInfo.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex-1 min-w-0"
                                    >
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {userInfo.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {userInfo.email}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={logout}
                                        className="icon-btn p-2"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-modal rounded-none border-t border-white/20">
                <nav className="flex items-center justify-around px-4 py-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`
                   flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                   ${isActive
                                        ? 'text-primary-700 dark:text-primary-300'
                                        : 'text-slate-600 dark:text-slate-400'
                                    }
                 `}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
