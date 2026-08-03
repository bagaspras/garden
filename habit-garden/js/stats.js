// Statistics Module
const Stats = {
  init() {
    console.log('Stats initialized');
  },

  // Get habit statistics
  async getHabitStats(habitId) {
    const habit = await Habit.getById(habitId);
    const logs = await Habit.getHabitLogs(habitId);
    const streak = await Habit.getStreak(habitId);

    return {
      habitId,
      habitName: habit.name,
      totalCompletions: logs.length,
      streak: streak,
      longestStreak: this.calculateLongestStreak(logs),
      weeklyAverage: this.calculateWeeklyAverage(logs),
      monthlyAverage: this.calculateMonthlyAverage(logs),
      lastCompleted: logs.length > 0 ? logs[logs.length - 1].completedAt : null
    };
  },

  // Calculate longest streak
  calculateLongestStreak(logs) {
    if (logs.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    logs.forEach(log => {
      const logDate = new Date(log.completedAt);
      const logDateStr = logDate.toLocaleDateString('id-ID');

      if (!lastDate || this.isConsecutiveDay(lastDate, logDate)) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }

      lastDate = logDate;
    });

    return Math.max(maxStreak, currentStreak);
  },

  // Check if dates are consecutive
  isConsecutiveDay(date1, date2) {
    const diff = Math.abs(date1 - date2);
    const oneDayMs = 24 * 60 * 60 * 1000;
    return diff <= oneDayMs;
  },

  // Calculate weekly average
  calculateWeeklyAverage(logs) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekLogs = logs.filter(log => new Date(log.completedAt) >= weekAgo);
    return (weekLogs.length / 7).toFixed(2);
  },

  // Calculate monthly average
  calculateMonthlyAverage(logs) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthLogs = logs.filter(log => new Date(log.completedAt) >= monthAgo);
    return (monthLogs.length / 30).toFixed(2);
  },

  // Get all statistics
  async getAllStats() {
    const habits = await Habit.getAll();
    const allStats = await Promise.all(
      habits.map(habit => this.getHabitStats(habit.id))
    );

    return {
      totalHabits: habits.length,
      activeHabits: habits.filter(h => h.active).length,
      habits: allStats
    };
  },

  // Render stats dashboard
  async render() {
    const stats = await this.getAllStats();
    console.log('Rendering stats dashboard:', stats);
    // TODO: Implement rendering logic
  }
};
