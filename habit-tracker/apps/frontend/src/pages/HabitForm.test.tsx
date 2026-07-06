import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HabitForm from '../pages/HabitForm';
import { habitApi } from '../services/api';

jest.mock('../services/api');
const mockedHabitApi = habitApi as jest.Mocked<typeof habitApi>;

const renderForm = (path = '/habits/new') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/habits/new" element={<HabitForm />} />
        <Route path="/habits/:id/edit" element={<HabitForm />} />
      </Routes>
    </MemoryRouter>
  );

describe('HabitForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form', () => {
    renderForm();
    expect(screen.getByText('Add New Habit')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /habit name/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderForm();
    fireEvent.click(screen.getByText('Create Habit'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('submits form successfully', async () => {
    mockedHabitApi.create.mockResolvedValue({ data: { habit: { id: '1' } } } as any);

    renderForm();

    fireEvent.change(screen.getByRole('textbox', { name: /habit name/i }), { target: { value: 'Test Habit' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /category/i }));
    fireEvent.click(await screen.findByRole('option', { name: 'Fitness' }));
    fireEvent.change(screen.getByTestId('start-date'), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByText('Create Habit'));

    await waitFor(() => {
      expect(mockedHabitApi.create).toHaveBeenCalled();
    });
  });

  it('loads habit data in edit mode', async () => {
    const mockHabit = {
      id: '1',
      name: 'Existing Habit',
      description: 'Desc',
      category: 'Fitness',
      frequency: 'Daily',
      reminder_time: '08:00',
      start_date: '2024-01-01',
      is_active: true,
      currentStreak: 5,
      longestStreak: 10,
      totalCompletions: 20,
      completionPercentage: 80,
      todayStatus: 'pending',
    };

    mockedHabitApi.getById.mockResolvedValue({ data: { habit: mockHabit } } as any);
    mockedHabitApi.update.mockResolvedValue({ data: { habit: mockHabit } } as any);

    renderForm('/habits/1/edit');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Habit')).toBeInTheDocument();
    });
  });

  it('shows custom days when frequency is Custom', async () => {
    renderForm();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: /frequency/i }));
    fireEvent.click(await screen.findByRole('option', { name: 'Custom' }));

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });
});
