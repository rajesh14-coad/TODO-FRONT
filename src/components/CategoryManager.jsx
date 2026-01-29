import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Plus, Check, X, LayoutGrid } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../utils';
import { iconMap, getIcon } from '../utils/icons';
import { colorOptions } from '../constants/initialCategories';

const CategoryManager = ({ categories, selectedId, onSelect, onUpdateCategories, onClose }) => {
  const [view, setView] = useState('list'); // list, form
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    label: '',
    icon: 'target',
    colorIndex: 0
  });

  const resetForm = () => {
    setFormData({ label: '', icon: 'target', colorIndex: 0 });
    setEditingId(null);
    setView('list');
  };

  const handleEdit = (cat) => {
    const matchedIndex = colorOptions.findIndex(c => c.bg === cat.bg);
    setFormData({
      label: cat.label,
      icon: cat.icon,
      colorIndex: matchedIndex !== -1 ? matchedIndex : 0
    });
    setEditingId(cat.id);
    setView('form');
  };

  const handleDelete = (id) => {
    if (categories.length <= 1) {
      toast.error("You must have at least one category.");
      return;
    }
    const newCats = categories.filter(c => c.id !== id);
    onUpdateCategories(newCats);
    if (selectedId === id) onSelect('all');
    toast.success("Category deleted");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label.trim()) return toast.error("Name is required");

    const colorObj = colorOptions[formData.colorIndex];

    const newCategory = {
      id: editingId || Date.now().toString(),
      label: formData.label.trim(),
      icon: formData.icon,
      color: colorObj.color,
      bg: colorObj.bg,
      border: colorObj.border
    };

    if (editingId) {
      const newCats = categories.map(c => c.id === editingId ? newCategory : c);
      onUpdateCategories(newCats);
      toast.success("Category updated");
    } else {
      onUpdateCategories([...categories, newCategory]);
      toast.success("Category created");
    }
    resetForm();
  };

  const handleSelect = (id) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className="h-[450px] flex flex-col">
      {view === 'list' ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-2 p-1 no-scrollbar">
            {/* All Categories Option */}
            <button
              onClick={() => handleSelect('all')}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                selectedId === 'all'
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800"
                  : "bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 hover:border-indigo-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400")}>
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">All Categories</span>
              </div>
              {selectedId === 'all' && <Check className="w-5 h-5 text-indigo-500" />}
            </button>

            <div className="py-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Your Categories</p>
            </div>

            {categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              const isSelected = selectedId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={cn(
                    "group flex items-center gap-2 p-1 rounded-xl border transition-all duration-200",
                    isSelected
                      ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800"
                      : "bg-white dark:bg-gray-800/50 dark:border-gray-700 hover:border-indigo-200"
                  )}
                >
                  <button
                    onClick={() => handleSelect(cat.id)}
                    className="flex-1 flex items-center gap-3 p-2 text-left"
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", cat.bg, cat.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 flex-1 truncate">{cat.label}</span>
                    {isSelected && <Check className="w-5 h-5 text-indigo-500 shrink-0" />}
                  </button>

                  <div className="flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
                      className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setView('form')}
            className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" /> Create Category
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-1 space-y-4 no-scrollbar">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Category Name</label>
              <input
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Health, Study, Work"
                className="w-full px-4 py-2.5 rounded-xl border dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Pick Icon</label>
              <div className="grid grid-cols-6 gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border dark:border-gray-700">
                {Object.keys(iconMap).map(iconKey => {
                  const Icon = iconMap[iconKey];
                  const isSelected = formData.icon === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconKey })}
                      className={cn(
                        "p-2 rounded-lg flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-indigo-500 text-white shadow-lg scale-110"
                          : "text-gray-500 hover:bg-white dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Color Theme</label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map((opt, idx) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, colorIndex: idx })}
                    className={cn(
                      "h-10 rounded-xl border-2 transition-all flex items-center justify-center",
                      opt.bg,
                      formData.colorIndex === idx ? "border-indigo-600 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    {formData.colorIndex === idx && <Check className={cn("w-5 h-5", opt.color)} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CategoryManager;
