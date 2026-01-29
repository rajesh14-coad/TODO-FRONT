import { LayoutGrid, Briefcase, User, Home, ShoppingBag, Plane, Users } from 'lucide-react';

export const categories = [
  {
    id: 'work',
    label: 'Work',
    icon: Briefcase,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    border: 'border-blue-200 dark:border-blue-800'
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    border: 'border-purple-200 dark:border-purple-800'
  },
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    border: 'border-pink-200 dark:border-pink-800'
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    border: 'border-orange-200 dark:border-orange-800'
  },
  {
    id: 'social',
    label: 'Friends',
    icon: Users,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
];
