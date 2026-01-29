import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Save, Camera, Upload, Mail, Lock, Eye, EyeOff, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings, soundOptions } from '../context/SettingsContext';
import { cn } from '../utils';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { soundEnabled, setSoundEnabled, selectedSound, setSelectedSound } = useSettings();
  const fileInputRef = useRef(null);
  const [showPassSection, setShowPassSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    password: '',
    confirmPassword: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare data to send (don't send confirmPassword or empty password)
    const updateData = { ...formData };
    delete updateData.confirmPassword;
    if (!updateData.password) delete updateData.password;

    const success = await updateProfile(updateData);
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[40px] shadow-3xl border border-white/10 dark:border-gray-800 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Identity Settings</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your digital presence</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white dark:border-gray-800 transition-transform active:scale-95">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 p-2.5 rounded-full border-2 border-white dark:border-gray-800 shadow-xl text-white">
                  <Upload className="w-4 h-4" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact No.</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Account</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Password Toggle section */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPassSection(!showPassSection)}
                className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider hover:text-indigo-600 transition-colors"
              >
                {showPassSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showPassSection ? 'Hide Security Settings' : 'WANT TO CHANGE PASSWORD?'}
              </button>
            </div>

            <AnimatePresence>
              {showPassSection && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none text-sm transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-red-500/10 outline-none text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification Sound Settings */}
            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-800/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Alert Sounds</h4>
                    <p className="text-[10px] text-gray-500 font-medium">Notification voice on task deadline</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                    soundEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
                  )}
                >
                  <motion.div
                    animate={{ x: soundEnabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {soundEnabled && (
                <div className="space-y-2 pt-2 border-t border-indigo-100/50 dark:border-indigo-800/50">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Select Ringtone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {soundOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          setSelectedSound(option.url);
                          new Audio(option.url).play().catch(() => { });
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-black border transition-all truncate uppercase tracking-tighter",
                          selectedSound === option.url
                            ? "bg-indigo-600 text-white border-transparent"
                            : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-indigo-300"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="p-8 pt-4 shrink-0 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 rounded-b-[40px]">
          <button
            form="profile-form"
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-black flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] group"
          >
            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Synchronize Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
