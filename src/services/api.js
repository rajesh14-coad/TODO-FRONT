import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for fallback
const getMockTasks = () => {
  const saved = localStorage.getItem('mock_tasks');
  return saved ? JSON.parse(saved) : [
    { _id: '1', title: 'Welcome to Smart Todo! 🚀', completed: false, priority: 'high', category: 'General', createdAt: new Date() },
    { _id: '2', title: 'Start by adding a new task', completed: false, priority: 'medium', category: 'Work', createdAt: new Date() },
    { _id: '3', title: 'Try switching themes in settings', completed: true, priority: 'low', category: 'Personal', createdAt: new Date() },
  ];
};

const saveMockTasks = (tasks) => localStorage.setItem('mock_tasks', JSON.stringify(tasks));

// Sticky offline mode flag for the session
let isBackendOffline = sessionStorage.getItem('offline_mode') === 'true';

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // If we're in sticky offline mode, fail fast to trigger catch blocks immediately
    if (isBackendOffline && !config.url.includes('/users')) {
      return Promise.reject({ code: 'ERR_NETWORK', message: 'Offline Mode Enabled' });
    }

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      if (!isBackendOffline) {
        console.warn('Backend offline - Switching to local mock mode');
        sessionStorage.setItem('offline_mode', 'true');
        isBackendOffline = true;
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const taskService = {
  getAll: async () => {
    try {
      return await api.get('/tasks');
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
        return { data: getMockTasks() };
      }
      throw err;
    }
  },
  create: async (task) => {
    try {
      return await api.post('/tasks', task);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const newTask = { ...task, _id: Date.now().toString(), createdAt: new Date() };
        const tasks = [newTask, ...getMockTasks()];
        saveMockTasks(tasks);
        return { data: newTask };
      }
      throw err;
    }
  },
  update: async (id, updates) => {
    try {
      return await api.put(`/tasks/${id}`, updates);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const tasks = getMockTasks().map(t => t._id === id ? { ...t, ...updates } : t);
        saveMockTasks(tasks);
        return { data: tasks.find(t => t._id === id) };
      }
      throw err;
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/tasks/${id}`);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const tasks = getMockTasks().filter(t => t._id !== id);
        saveMockTasks(tasks);
        return { data: { success: true } };
      }
      throw err;
    }
  },
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  sync: (categories) => api.post('/categories/sync', categories),
};

export const aiService = {
  categorize: (title, categories) => api.post('/ai/categorize', { title, categories }),
  breakdown: async (title) => {
    try {
      return await api.post('/ai/breakdown', { title });
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const mockBreakdown = `1. Analyze: ${title}\n2. Organize resources\n3. Execute primary steps\n4. Review and finalize`;
        return { data: { breakdown: mockBreakdown } };
      }
      throw err;
    }
  },
};

// Student Goals Service
const getMockGoals = () => {
  const saved = localStorage.getItem('student_goals');
  return saved ? JSON.parse(saved) : [];
};

const saveMockGoals = (goals) => localStorage.setItem('student_goals', JSON.stringify(goals));

export const goalService = {
  getAll: async () => {
    try {
      return await api.get('/goals');
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
        return { data: getMockGoals() };
      }
      throw err;
    }
  },
  create: async (goal) => {
    try {
      return await api.post('/goals', goal);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const newGoal = {
          ...goal,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'not_started',
          timeSpent: 0,
          sessions: []
        };
        const goals = [newGoal, ...getMockGoals()];
        saveMockGoals(goals);
        return { data: newGoal };
      }
      throw err;
    }
  },
  update: async (id, updates) => {
    try {
      return await api.put(`/goals/${id}`, updates);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const goals = getMockGoals().map(g => g._id === id || g.id === id ? { ...g, ...updates } : g);
        saveMockGoals(goals);
        return { data: goals.find(g => g._id === id || g.id === id) };
      }
      throw err;
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/goals/${id}`);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const goals = getMockGoals().filter(g => g._id !== id && g.id !== id);
        saveMockGoals(goals);
        return { data: { success: true } };
      }
      throw err;
    }
  },
  addSession: async (id, sessionData) => {
    try {
      return await api.post(`/goals/${id}/sessions`, sessionData);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        const goals = getMockGoals().map(g => {
          if (g._id === id || g.id === id) {
            const newSession = {
              date: new Date().toISOString(),
              duration: sessionData.duration
            };
            return {
              ...g,
              timeSpent: (g.timeSpent || 0) + sessionData.duration,
              sessions: [...(g.sessions || []), newSession]
            };
          }
          return g;
        });
        saveMockGoals(goals);
        return { data: goals.find(g => g._id === id || g.id === id) };
      }
      throw err;
    }
  }
};

export default api;
