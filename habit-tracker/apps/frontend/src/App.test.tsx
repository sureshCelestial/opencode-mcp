import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Routing', () => {
  it('renders dashboard placeholder on /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard placeholder/i)).toBeInTheDocument();
  });

  it('renders add habit placeholder on /habits/new', () => {
    render(
      <MemoryRouter initialEntries={['/habits/new']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Add Habit placeholder/i)).toBeInTheDocument();
  });
});
