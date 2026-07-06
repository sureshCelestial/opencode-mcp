import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HabitDetails from '../pages/HabitDetails';
import { habitApi } from '../services/api';

jest.mock('../services/api');
const mockedHabitApi = habitApi as jest.Mocked<typeof habitApi>;

const mockHabit = {
  id: '1',
  name: 'Morning Run',
  description: 'Run 5km',
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
};

const renderDetails = () =>
  render(
    <BrowserRouter>
      <Routes>
        <Route path="/habits/:id" element={<HabitDetails />} />
      </Routes>
    </BrowserRouter>
  );

describe('HabitDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/habits/1');
  });

  it('renders habit details', async () => {
    mockedHabitApi.getById.mockResolvedValue({ data: { habit: mockHabit } } as any);

    renderDetails();

    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });

    expect(screen.getByText('Run 5km')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('handles complete action', async () => {
    mockedHabitApi.getById.mockResolvedValue({ data: { habit: mockHabit } } as any);
    mockedHabitApi.complete.mockResolvedValue({} as any);

    renderDetails();

    await waitFor(() => {
      expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark Complete'));

    await waitFor(() => {
      expect(mockedHabitApi.complete).toHaveBeenCalledWith('1');
    });
  });

  it('handles delete action', async () => {
    mockedHabitApi.getById.mockResolvedValue({ data: { habit: mockHabit } } as any);
    mockedHabitApi.delete.mockResolvedValue({} as any);
    window.confirm = jest.fn(() => true);

    renderDetails();

    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Delete habit'));

    await waitFor(() => {
      expect(mockedHabitApi.delete).toHaveBeenCalledWith('1');
    });
  });

  it('shows error on load failure', async () => {
    mockedHabitApi.getById.mockRejectedValue(new Error('Failed'));

    renderDetails();

    await waitFor(() => {
      expect(screen.getByText('Failed to load habit details.')).toBeInTheDocument();
    });
  });
});
