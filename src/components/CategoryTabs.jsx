import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Settings2 } from 'lucide-react';
import { cn } from '../utils';
import { getIcon } from '../utils/icons';

const CategoryTabs = ({ categories, selected, onSelect, onManage }) => {
  const scrollRef = useRef(null);

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2 pt-1" ref={scrollRef}>
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={onManage}
          className="p-2 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelect('all')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all duration-300 border",
            selected === 'all'
              ? "bg-gray-800 text-white border-gray-800 shadow-lg shadow-gray-400/20 dark:bg-white dark:text-gray-900"
              : "bg-white/50 text-gray-600 border-gray-200 hover:bg-white dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-sm font-semibold">All</span>
        </button>

        {categories.map((cat) => {
          const Icon = getIcon(cat.icon);
          const isSelected = selected === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all duration-300 border",
                isSelected
                  ? cn(cat.bg, cat.color, cat.border, "border shadow-lg")
                  : "bg-white/50 text-gray-500 border-gray-200 hover:bg-white dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
              )}
            >
              <Icon className={cn("w-4 h-4", isSelected ? "currentColor" : "text-gray-400 dark:text-gray-500")} />
              <span className={cn("text-sm font-semibold", isSelected && "font-bold")}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
