import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
    const { userInfo, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                phone: userInfo.phone || '',
            });
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile(formData);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserProfile({ profilePicture: reader.result });
                toast.success('Profile photo updated!');
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userInfo) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Not Signed In</h3>
                <p className="text-slate-600 dark:text-slate-400 text-center max-w-xs mb-8">
                    Please sign in to your account to view and manage your profile settings.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary">Sign In</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Profile Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and preferences.</p>
            </div>

            <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-slate-200/50 dark:border-slate-700/30">
                        {/* Profile Avatar */}
                        <div className="relative group">
                            <input
                                type="file"
                                id="profile-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-5xl font-bold shadow-glow group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                                {userInfo.profilePicture ? (
                                    <img src={userInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userInfo.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <label
                                htmlFor="profile-upload"
                                className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-premium border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Edit2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </label>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{userInfo.name}</h3>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm">
                                    <Mail className="w-4 h-4" />
                                    {userInfo.email}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date(userInfo.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-secondary flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="icon-btn"
                                title="Cancel"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <User className="w-4 h-4 text-primary-500" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Mail className="w-4 h-4 text-primary-500" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Phone className="w-4 h-4 text-primary-500" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    Account Creation Date
                                </label>
                                <input
                                    type="text"
                                    value={new Date(userInfo.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    disabled
                                    className="input bg-slate-50/50 dark:bg-slate-800/30 opacity-70"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="pt-4 flex justify-end"
                            >
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn btn-primary px-10 flex items-center gap-3"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileView;
