import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  Paper,
  FormHelperText,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { habitApi, Habit } from '../services/api';

const FREQUENCIES = ['Daily', 'Weekdays', 'Weekends', 'Weekly', 'Custom'];
const CATEGORIES = ['Fitness', 'Wellness', 'Learning', 'Mindfulness', 'Productivity'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HabitForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      habitApi.getById(id).then((res) => {
        const h = res.data.habit;
        setName(h.name);
        setDescription(h.description || '');
        setCategory(h.category);
        setFrequency(h.frequency);
        setReminderTime(h.reminder_time || '');
        setStartDate(h.start_date);
        setIsActive(h.is_active);
      }).catch(() => setError('Failed to load habit.'));
    }
  }, [isEdit, id]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    else if (name.length > 100) errs.name = 'Max 100 characters';
    if (!category) errs.category = 'Category is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (frequency === 'Custom' && customDays.length === 0) errs.customDays = 'Select at least one day';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: any = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      reminder_time: reminderTime || undefined,
      start_date: startDate,
      is_active: isActive,
    };
    if (frequency === 'Custom') payload.custom_days = customDays;

    setLoading(true);
    try {
      if (isEdit && id) {
        await habitApi.update(id, payload);
      } else {
        await habitApi.create(payload);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save habit.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
          {isEdit ? 'Edit Habit' : 'Add New Habit'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Habit Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={!!errors.category}
                helperText={errors.category}
                required
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                {FREQUENCIES.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {frequency === 'Custom' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Days
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {DAYS.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      clickable
                      color={customDays.includes(day) ? 'primary' : 'default'}
                      onClick={() => toggleDay(day)}
                    />
                  ))}
                </Box>
                {errors.customDays && <FormHelperText error>{errors.customDays}</FormHelperText>}
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reminder Time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'data-testid': 'start-date' }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Habit' : 'Create Habit'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/')} size="large">
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default HabitForm;
