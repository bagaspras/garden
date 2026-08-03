// Habit Module
const Habit = {
  // Create new habit
  async create(data) {
    const habit = {
      name: data.name,
      description: data.description || '',
      category: data.category || 'general',
      frequency: data.frequency || 'daily', // daily, weekly, monthly
      target: data.target || 1,
      unit: data.unit || 'times',
      color: data.color || '#2ecc71',
      icon: data.icon || '🌱',
      xp: data.xp || 10,
      createdAt: new Date().toISOString(),
      active: true
    };

    return await Database.add('habits', habit);
  },

  // Get all habits
  async getAll() {
    return await Database.getAll('habits');
  },

  // Get habit by ID
  async getById(id) {
    return await Database.get('habits', id);
  },

  // Update habit
  async update(id, data) {
    const habit = await this.getById(id);
    const updated = { ...habit, ...data, id };
    return await Database.update('habits', updated);
  },

  // Delete habit
  async delete(id) {
    return await Database.delete('habits', id);
  },

  getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Log habit completion
  async logCompletion(habitId, amount = 1) {
    const now = new Date();
    const log = {
      habitId: habitId,
      amount: amount,
      completedAt: now.toISOString(),
      date: this.getDateKey(now)
    };

    return await Database.add('logs', log);
  },

  // Get logs for habit
  async getHabitLogs(habitId) {
    const allLogs = await Database.getAll('logs');
    return allLogs.filter(log => log.habitId === habitId);
  },

  // Get logs for today
  async getTodayLogs() {
    const today = this.getDateKey();
    const allLogs = await Database.getAll('logs');
    return allLogs.filter(log => log.date === today);
  },

  // Check streak
  async getStreak(habitId) {
    const logs = await this.getHabitLogs(habitId);
    if (logs.length === 0) return 0;

    const completedDates = new Set(logs.map(log => log.date).filter(Boolean));
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateKey = this.getDateKey(currentDate);
      if (!completedDates.has(dateKey)) break;

      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }
};
