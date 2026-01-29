import {
  Briefcase, User, Home, ShoppingBag, Plane, Users,
  Heart, Star, Music, Coffee, Book, Gamepad,
  Dumbbell, Sun, Moon, Cloud, Zap, Flag,
  Target, Award, Gift, Smartphone, Monitor
} from 'lucide-react';

export const iconMap = {
  briefcase: Briefcase,
  user: User,
  home: Home,
  shopping: ShoppingBag,
  plane: Plane,
  social: Users,
  heart: Heart,
  star: Star,
  music: Music,
  coffee: Coffee,
  book: Book,
  gamepad: Gamepad,
  dumbbell: Dumbbell,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  zap: Zap,
  flag: Flag,
  target: Target,
  award: Award,
  gift: Gift,
  mobile: Smartphone,
  monitor: Monitor
};

export const getIcon = (name) => {
  return iconMap[name] || iconMap.target; // Default to Target if not found
};
