import React from 'react';
import { Bell, Volume2, Moon, Sun, Palette, Globe, ArrowLeft, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const SettingsView = ({ onBack }) => {
    const { soundEnabled, setSoundEnabled, notificationSound, setNotificationSound, soundOptions } = useSettings();
    const { mode, theme, themeConfig, toggleMode, changeTheme, availableThemes } = useTheme();

    const sections = [
        {
            id: 'appearance',
            title: 'Appearance',
            description: 'Customize how the application looks to you.',
            icon: Palette,
            items: [
                {
                    id: 'dark-mode',
                    label: 'Dark Mode',
                    description: 'Toggle between light and dark themes.',
                    type: 'toggle',
                    icon: mode === 'dark' ? Moon : Sun,
                    value: mode === 'dark',
                    onChange: toggleMode,
                }
            ]
        },
        {
            id: 'themes',
            title: 'Theme Selection',
            description: 'Choose from our professionally curated color palettes.',
            icon: Palette,
            isThemeSelector: true,
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your notification preferences and sounds.',
            icon: Bell,
            items: [
                {
                    id: 'sound-enabled',
                    label: 'Sound Notifications',
                    description: 'Play a sound alert when a task reminder is triggered.',
                    type: 'toggle',
                    icon: Volume2,
                    value: soundEnabled,
                    onChange: () => setSoundEnabled(!soundEnabled),
                },
                {
                    id: 'sound-type',
                    label: 'Notification Sound',
                    description: 'Select the alert sound for your notifications.',
                    type: 'select',
                    icon: Volume2,
                    value: notificationSound,
                    onChange: (e) => setNotificationSound(e.target.value),
                    options: soundOptions.notification,
                    disabled: !soundEnabled,
                }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto pb-20"
        >
            {/* Header with Floating Back Button */}
            <div className="flex items-center gap-6 mb-10 relative">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="floating-btn"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className={onBack ? "ml-2" : ""}>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">App Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your experience and personalization preferences.</p>
                </div>
            </div>

            <div className="space-y-8">
                {sections.map((section, sectionIdx) => {
                    const SectionIcon = section.icon;

                    if (section.isThemeSelector) {
                        return (
                            <motion.section
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sectionIdx * 0.1 }}
                                className="glass-card p-8"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-primary-100/50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-200/50 dark:border-primary-800/50">
                                        <SectionIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">{section.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {availableThemes.map((themeOption) => {
                                        const isSelected = theme === themeOption.id;
                                        return (
                                            <button
                                                key={themeOption.id}
                                                onClick={() => changeTheme(themeOption.id)}
                                                className={cn(
                                                    "relative p-5 rounded-2xl border-2 transition-all text-left group overflow-hidden",
                                                    isSelected
                                                        ? "border-primary-500 bg-primary-100/50 dark:bg-primary-900/20 shadow-glow"
                                                        : "border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                                                )}
                                            >
                                                {/* Background Accent */}
                                                <div
                                                    className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                                                    style={{ backgroundColor: themeOption.colors.primary }}
                                                />

                                                <div className="flex items-center justify-between mb-4 relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-xl shadow-premium group-hover:scale-110 transition-transform"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${themeOption.colors.primary} 0%, ${themeOption.colors.primaryLight} 100%)`,
                                                            }}
                                                        />
                                                        <span className="font-bold text-slate-900 dark:text-white">{themeOption.name}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white animate-scale-in">
                                                            <Check className="w-4 h-4 stroke-[3px]" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 relative z-10">
                                                    {[themeOption.colors.primary, themeOption.colors.primaryLight, themeOption.colors.accent].map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-8 h-2 rounded-full border border-white/20"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        );
                    }

                    return (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIdx * 0.1 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                                    <SectionIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{section.description}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item) => {
                                    const ItemIcon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 transition-opacity",
                                                item.disabled && "opacity-50 pointer-events-none"
                                            )}
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/80 text-slate-500 mt-0.5">
                                                    <ItemIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{item.label}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="ml-6">
                                                {item.type === 'toggle' && (
                                                    <button
                                                        onClick={item.onChange}
                                                        className={cn(
                                                            "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-primary-500/50",
                                                            item.value ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-700"
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                                                item.value ? "translate-x-6" : "translate-x-1"
                                                            )}
                                                        />
                                                    </button>
                                                )}

                                                {item.type === 'select' && (
                                                    <select
                                                        value={item.value}
                                                        onChange={item.onChange}
                                                        className="input py-2 px-4 text-sm font-medium pr-10 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                                    >
                                                        {item.options.map((opt) => (
                                                            <option key={opt.url} value={opt.url}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    );
                })}

                {/* About Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-8 group overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Information</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Version</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">2.1.0 Cloud</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Runtime</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">React + Vite</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interface</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">SaaS Modal</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">JWT + RSA</p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default SettingsView;
