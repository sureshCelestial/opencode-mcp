import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { habitApi, dashboardApi } from './services/api';

jest.mock('./services/api');
const mockedHabitApi = habitApi as jest.Mocked<typeof habitApi>;
const mockedDashboardApi = dashboardApi as jest.Mocked<typeof dashboardApi>;

describe('App Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard on /', async () => {
    mockedHabitApi.getAll.mockResolvedValue({ data: { habits: [], total: 0 } } as any);
    mockedDashboardApi.getStats.mockResolvedValue({ data: { totalHabits: 0, completedToday: 0, activeStreak: 0, completionRate: 0 } } as any);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome to Habit Tracker')).toBeInTheDocument();
    });
  });

  it('renders add habit form on /habits/new', () => {
    render(
      <MemoryRouter initialEntries={['/habits/new']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Add New Habit')).toBeInTheDocument();
  });
});
