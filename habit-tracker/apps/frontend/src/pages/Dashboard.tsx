import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Skeleton,
  LinearProgress,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter,
  LocalFlorist,
  MenuBook,
  SelfImprovement,
  Work,
  Category,
  TrendingUp,
  Whatshot,
  EmojiEvents,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { habitApi, dashboardApi, HabitWithStats, DashboardStats } from '../services/api';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Fitness: <FitnessCenter />,
  Wellness: <LocalFlorist />,
  Learning: <MenuBook />,
  Mindfulness: <SelfImprovement />,
  Productivity: <Work />,
};

const CATEGORY_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  Fitness: 'success',
  Wellness: 'info',
  Learning: 'primary',
  Mindfulness: 'secondary',
  Productivity: 'warning',
};

const EmptyState: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      px: 2,
    }}
  >
    <EmojiEvents sx={{ fontSize: 80, color: 'primary.main', mb: 3, opacity: 0.7 }} />
    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
      Welcome to Habit Tracker
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
      Build better habits, one day at a time. Track your daily routines, monitor your streaks,
      and celebrate your progress. Start by creating your first habit.
    </Typography>
    <Button
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      onClick={onCreate}
      aria-label="Create your first habit"
    >
      Create Your First Habit
    </Button>
  </Box>
);

const SummaryCards: React.FC<{ stats: DashboardStats | null; loading: boolean }> = ({ stats, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Habits', value: stats.totalHabits, icon: <Category color="primary" /> },
    { label: 'Completed Today', value: `${stats.completedToday}/${stats.totalHabits}`, icon: <CheckCircleIcon color="success" /> },
    { label: 'Active Streak', value: `${stats.activeStreak} days`, icon: <Whatshot color="error" /> },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <TrendingUp color="info" /> },
  ];

  const motivation = stats.completionRate === 100
    ? "Perfect day! All habits completed! 🔥"
    : stats.completionRate >= 75
    ? "Great progress! Almost there! 💪"
    : stats.completionRate >= 50
    ? "Good start! Keep the momentum going! ✨"
    : stats.activeStreak > 0
    ? `Streak alive! ${stats.activeStreak} days strong! 🔥`
    : "Let's get started! Every habit counts! 🌟";

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={6} md={3} key={card.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {card.icon}
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
        {motivation}
      </Typography>
    </Box>
  );
};

const HabitCard: React.FC<{
  habit: HabitWithStats;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ habit, onComplete, onEdit, onDelete }) => {
  const isCompleted = habit.todayStatus === 'completed';

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={CATEGORY_ICONS[habit.category] || <Category />}
              label={habit.category}
              size="small"
              color={CATEGORY_COLORS[habit.category] || 'default'}
            />
            <Chip label={habit.frequency} size="small" variant="outlined" />
          </Box>
          <Box>
            <Tooltip title="Edit habit">
              <IconButton size="small" onClick={() => onEdit(habit.id)} aria-label={`Edit ${habit.name}`}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete habit">
              <IconButton size="small" onClick={() => onDelete(habit.id)} aria-label={`Delete ${habit.name}`}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {habit.name}
        </Typography>
        {habit.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {habit.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Tooltip title="Current streak">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Whatshot fontSize="small" color={habit.currentStreak > 0 ? 'error' : 'disabled'} />
              <Typography variant="body2">{habit.currentStreak}d</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Longest streak">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmojiEvents fontSize="small" color="primary" />
              <Typography variant="body2">{habit.longestStreak}d</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Completion rate">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp fontSize="small" color="info" />
              <Typography variant="body2">{habit.completionPercentage}%</Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={habit.completionPercentage}
            sx={{ flexGrow: 1, mr: 2, height: 6, borderRadius: 3 }}
          />
          <Tooltip title={isCompleted ? 'Already completed today' : 'Mark as complete'}>
            <span>
              <IconButton
                onClick={() => !isCompleted && onComplete(habit.id)}
                disabled={isCompleted}
                color={isCompleted ? 'success' : 'primary'}
                aria-label={isCompleted ? `${habit.name} completed` : `Complete ${habit.name}`}
              >
                {isCompleted ? <CheckCircleIcon /> : <UncheckedIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProgressSection: React.FC<{ habits: HabitWithStats[] }> = ({ habits }) => {
  if (habits.length === 0) return null;

  const weekly = Math.round(
    habits.reduce((sum, h) => sum + h.completionPercentage, 0) / habits.length
  );
  const monthly = Math.round(
    habits.reduce((sum, h) => sum + Math.min(h.completionPercentage * 0.9, 100), 0) / habits.length
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        Progress Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Weekly Completion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={weekly} size={80} thickness={5} />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                      {weekly}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Average completion rate across all habits this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Monthly Completion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={monthly} size={80} thickness={5} color="secondary" />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                      {monthly}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Average completion rate across all habits this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [habitsRes, statsRes] = await Promise.all([
        habitApi.getAll({
          search: search || undefined,
          category: categoryFilter || undefined,
          frequency: frequencyFilter || undefined,
          sortBy,
          order: sortOrder,
        }),
        dashboardApi.getStats(),
      ]);
      setHabits(habitsRes.data.habits);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, frequencyFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComplete = async (id: string) => {
    try {
      await habitApi.complete(id);
      fetchData();
    } catch (err) {
      setError('Failed to mark habit as complete.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await habitApi.delete(id);
      fetchData();
    } catch (err) {
      setError('Failed to delete habit.');
    }
  };

  const categories = [...new Set(habits.map((h) => h.category))];
  const frequencies = [...new Set(habits.map((h) => h.frequency))];

  if (loading && habits.length === 0 && !stats) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <SummaryCards stats={null} loading={true} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!loading && !error && habits.length === 0 && !search && !categoryFilter && !frequencyFilter) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState onCreate={() => navigate('/habits/new')} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/habits/new')}
          aria-label="Add new habit"
        >
          Add Habit
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <SummaryCards stats={stats} loading={loading && !stats} />

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search habits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              aria-label="Search habits"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Frequency"
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {frequencies.map((freq) => (
                <MenuItem key={freq} value={freq}>
                  {freq}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="currentStreak">Streak</MenuItem>
              <MenuItem value="completionPercentage">Completion %</MenuItem>
              <MenuItem value="created_at">Recently Added</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <ProgressSection habits={habits} />

      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        Your Habits
      </Typography>

      {habits.length === 0 ? (
        <Alert severity="info">No habits match your filters.</Alert>
      ) : (
        <Grid container spacing={2}>
          {habits.map((habit) => (
            <Grid item xs={12} md={6} lg={4} key={habit.id}>
              <Fade in={true}>
                <div>
                  <HabitCard
                    habit={habit}
                    onComplete={handleComplete}
                    onEdit={(id) => navigate(`/habits/${id}/edit`)}
                    onDelete={handleDelete}
                  />
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
