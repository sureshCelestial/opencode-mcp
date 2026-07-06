CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at);
CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_completions_habit_date ON habit_completions(habit_id, completion_date);
