import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, categoryService, aiService } from '../services/api';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import Stats from '../components/Stats';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import EditTaskForm from '../components/EditTaskForm';
import Modal from '../components/Modal';
import MobileTabBar from '../components/MobileTabBar';
import { toast } from 'react-hot-toast';
import { Plus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialCategories } from '../constants/initialCategories';
import NotificationService from '../utils/NotificationService';
import useTaskReminders from '../hooks/useTaskReminders';

const HomeScreen = () => {
  const queryClient = useQueryClient();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await taskService.getAll();
      return res.data;
    }
  });

  const { data: categories = initialCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await categoryService.getAll();
        return res.data.length > 0 ? res.data : initialCategories;
      } catch (err) {
        return initialCategories;
      }
    }
  });

  // Request notification permissions on mount
  useEffect(() => {
    const requestNotifications = async () => {
      const granted = await NotificationService.requestPermission();
      if (granted) {
        console.log('Notification permissions granted');
      } else {
        console.log('Notification permissions denied');
      }
    };

    requestNotifications();
  }, []);

  // Activate task reminders
  useTaskReminders(tasks);

  const addTaskMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task added successfully');
      setIsModalOpen(false);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }) => taskService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Only close modal if editing, not for checkbox toggle
      if (isEditModalOpen) {
        setIsEditModalOpen(false);
        setTaskToEdit(null);
        toast.success('Task updated successfully');
      }
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    }
  });

  const handleToggle = (id, completed) => {
    // Optimistic update for instant UI feedback
    queryClient.setQueryData(['tasks'], (oldTasks) =>
      oldTasks?.map(task =>
        (task._id === id || task.id === id) ? { ...task, completed } : task
      ) || []
    );

    // Then update backend
    updateTaskMutation.mutate(
      { id, updates: { completed } },
      {
        onError: () => {
          // Revert on error
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          toast.error('Failed to update task');
        }
      }
    );
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleAIBreakdown = async (task) => {
    const id = task._id || task.id;
    try {
      toast.loading('AI is breaking down your task...', { id: 'ai-loading' });
      const res = await aiService.breakdown(task.title);
      const breakdown = res.data.breakdown;
      const newDescription = task.description
        ? `${task.description}\n\nAI Breakdown:\n${breakdown}`
        : `AI Breakdown:\n${breakdown}`;

      updateTaskMutation.mutate({ id, updates: { description: newDescription } });
      toast.success('AI breakdown added!', { id: 'ai-loading', icon: '🤖' });
    } catch (err) {
      toast.error('AI service unavailable', { id: 'ai-loading' });
    }
  };

  const handleVoiceResult = (transcript) => {
    const text = transcript.toLowerCase().trim();
    if (text.startsWith('add task ')) {
      const taskTitle = transcript.slice(9).trim();
      if (taskTitle) {
        addTaskMutation.mutate({
          title: taskTitle,
          priority: 'normal',
          category: 'General'
        });
        toast.success(`Task added: "${taskTitle}"`, { icon: '✅' });
      }
    } else {
      setSearchQuery(transcript);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const titleMatch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery && !titleMatch) return false;
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });
  }, [tasks, searchQuery, filter]);

  return (
    <div className="flex h-screen bg-transparent text-slate-900 dark:text-white overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <main className="flex-1 overflow-y-auto pb-32 md:pb-10" style={{ overscrollBehaviorY: 'contain' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-8 gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              onVoiceResult={handleVoiceResult}
            />
          </div>

          {/* Stats Overview */}
          <Stats tasks={tasks} />

          {/* Tasks Container */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`btn flex items-center gap-2 ${filter !== 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card p-4 flex gap-2">
                    {['all', 'active', 'completed'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tasks List */}
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onDelete={(id) => deleteTaskMutation.mutate(id)}
              onEdit={handleEdit}
              onAIBreakdown={handleAIBreakdown}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-32 md:bottom-8 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-glass-xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <AddTaskForm
          categories={categories}
          onAddTask={(taskData) => addTaskMutation.mutate(taskData)}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        {taskToEdit && (
          <EditTaskForm
            task={taskToEdit}
            categories={categories}
            onSave={(id, updates) => updateTaskMutation.mutate({ id, updates })}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Mobile Tab Bar - Only visible on mobile */}
      <MobileTabBar />
    </div>
  );
};

export default HomeScreen;
