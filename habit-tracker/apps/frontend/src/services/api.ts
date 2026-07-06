import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: string;
  reminder_time?: string;
  start_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalHabits: number;
  completedToday: number;
  activeStreak: number;
  completionRate: number;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionPercentage: number;
  todayStatus: 'completed' | 'pending' | 'not_due';
}

export const habitApi = {
  getAll: (params?: { search?: string; category?: string; frequency?: string; sortBy?: string; order?: string }) =>
    api.get<{ habits: HabitWithStats[]; total: number }>('/habits', { params }),

  getById: (id: string) => api.get<{ habit: HabitWithStats }>(`/habits/${id}`),

  create: (data: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<{ habit: Habit }>('/habits', data),

  update: (id: string, data: Partial<Habit>) =>
    api.put<{ habit: Habit }>(`/habits/${id}`, data),

  delete: (id: string) => api.delete(`/habits/${id}`),

  complete: (id: string) => api.post(`/habits/${id}/complete`),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard'),
};

export default api;
