import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Whatshot,
  EmojiEvents,
  TrendingUp,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { habitApi, HabitWithStats } from '../services/api';

const HabitDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<HabitWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    habitApi.getById(id)
      .then((res) => setHabit(res.data.habit))
      .catch(() => setError('Failed to load habit details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    if (!id) return;
    try {
      await habitApi.complete(id);
      const res = await habitApi.getById(id);
      setHabit(res.data.habit);
    } catch (err) {
      setError('Failed to mark habit as complete.');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await habitApi.delete(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete habit.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (error || !habit) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        <Alert severity="error">{error || 'Habit not found.'}</Alert>
      </Container>
    );
  }

  const isCompleted = habit.todayStatus === 'completed';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Chip label={habit.category} color="primary" size="small" sx={{ mb: 1 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {habit.name}
              </Typography>
              {habit.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {habit.description}
                </Typography>
              )}
            </Box>
            <Box>
              <Tooltip title="Edit habit">
                <IconButton onClick={() => navigate(`/habits/${habit.id}/edit`)} aria-label="Edit habit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete habit">
                <IconButton onClick={handleDelete} aria-label="Delete habit" color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Whatshot color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {habit.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Streak (days)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <EmojiEvents color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {habit.longestStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Longest Streak (days)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {habit.totalCompletions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Completions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp color="info" sx={{ fontSize: 40 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {habit.completionPercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
            Details
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Frequency" secondary={habit.frequency} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Reminder Time"
                secondary={habit.reminder_time || 'No reminder set'}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Start Date" secondary={habit.start_date} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Status"
                secondary={habit.is_active ? 'Active' : 'Inactive'}
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleComplete}
              disabled={isCompleted}
              color={isCompleted ? 'success' : 'primary'}
            >
              {isCompleted ? 'Completed Today' : 'Mark Complete'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              onClick={() => navigate(`/habits/${habit.id}/edit`)}
            >
              Edit Habit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HabitDetails;
