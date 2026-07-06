import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { habitApi, dashboardApi } from '../services/api';

jest.mock('../services/api');
const mockedHabitApi = habitApi as jest.Mocked<typeof habitApi>;
const mockedDashboardApi = dashboardApi as jest.Mocked<typeof dashboardApi>;

const mockHabits = [
  {
    id: '1',
    name: 'Morning Run',
    description: 'Run 5km every morning',
    category: 'Fitness',
    frequency: 'Daily',
    reminder_time: '06:00',
    start_date: '2024-01-01',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    currentStreak: 5,
    longestStreak: 10,
    totalCompletions: 50,
    completionPercentage: 85,
    todayStatus: 'pending' as const,
  },
  {
    id: '2',
    name: 'Read Book',
    category: 'Learning',
    frequency: 'Daily',
    start_date: '2024-01-01',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    currentStreak: 3,
    longestStreak: 7,
    totalCompletions: 30,
    completionPercentage: 75,
    todayStatus: 'completed' as const,
  },
];

const mockStats = {
  totalHabits: 2,
  completedToday: 1,
  activeStreak: 5,
  completionRate: 50,
};

const renderDashboard = () =>
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no habits', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: [], total: 0 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: { totalHabits: 0, completedToday: 0, activeStreak: 0, completionRate: 0 } } as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Welcome to Habit Tracker')).toBeInTheDocument();
    });
    expect(screen.getByText('Create Your First Habit')).toBeInTheDocument();
  });

  it('renders summary cards and habit list', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: mockHabits, total: 2 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: mockStats } as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Habits')).toBeInTheDocument();
    });

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders habit cards with correct data', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: mockHabits, total: 2 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: mockStats } as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });

    expect(screen.getByText('Read Book')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('Learning')).toBeInTheDocument();
  });

  it('handles habit completion', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: mockHabits, total: 2 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: mockStats } as any);
    mockedHabitApi.complete.mockResolvedValue({} as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });

    const completeButtons = screen.getAllByLabelText(/Complete/);
    fireEvent.click(completeButtons[0]);

    await waitFor(() => {
      expect(mockedHabitApi.complete).toHaveBeenCalledWith('1');
    });
  });

  it('handles search filtering', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: mockHabits, total: 2 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: mockStats } as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search habits...');
    fireEvent.change(searchInput, { target: { value: 'Run' } });

    await waitFor(() => {
      expect(mockedHabitApi.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Run' })
      );
    });
  });

  it('shows error alert on API failure', async () => {
    mockedHabitApi.getAll.mockRejectedValue(new Error('API Error'));
    mockedDashboardApi.getStats.mockRejectedValue(new Error('API Error'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data. Please try again.')).toBeInTheDocument();
    });
  });

  it('navigates to add habit page', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: [], total: 0 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: { totalHabits: 0, completedToday: 0, activeStreak: 0, completionRate: 0 } } as any);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Create Your First Habit')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Your First Habit'));
    expect(window.location.pathname).toBe('/habits/new');
  });
});
