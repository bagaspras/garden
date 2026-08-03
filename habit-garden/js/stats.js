// Statistics Module
const Stats = {
  init() {
    console.log('Stats initialized');
  },

  async getHabitStats(habitId) {
    const habit = await Habit.getById(habitId);
    const logs = await Habit.getHabitLogs(habitId);
    const streak = await Habit.getStreak(habitId);

    return {
      habitId,
      habitName: habit.name,
      logs,
      totalCompletions: logs.length,
      streak,
      longestStreak: this.calculateLongestStreak(logs),
      weeklyAverage: this.calculateWeeklyAverage(logs),
      monthlyAverage: this.calculateMonthlyAverage(logs),
      lastCompleted: logs.length > 0 ? logs[logs.length - 1].completedAt : null
    };
  },

  calculateLongestStreak(logs) {
    if (!logs || logs.length === 0) return 0;

    const sortedLogs = [...logs]
      .filter(log => log && log.completedAt)
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    if (sortedLogs.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate = null;

    sortedLogs.forEach(log => {
      const currentDate = new Date(log.completedAt);
      currentDate.setHours(0, 0, 0, 0);

      if (!previousDate || this.isConsecutiveDay(previousDate, currentDate)) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }

      previousDate = currentDate;
    });

    return Math.max(maxStreak, currentStreak);
  },

  isConsecutiveDay(date1, date2) {
    const first = new Date(date1);
    const second = new Date(date2);
    first.setHours(0, 0, 0, 0);
    second.setHours(0, 0, 0, 0);
    const diff = Math.abs(second - first);
    const oneDayMs = 24 * 60 * 60 * 1000;
    return diff <= oneDayMs;
  },

  calculateWeeklyAverage(logs) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekLogs = logs.filter(log => new Date(log.completedAt) >= weekAgo);
    return (weekLogs.length / 7).toFixed(2);
  },

  calculateMonthlyAverage(logs) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthLogs = logs.filter(log => new Date(log.completedAt) >= monthAgo);
    return (monthLogs.length / 30).toFixed(2);
  },

  buildWeeklyTrend(habits) {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = Habit.getDateKey(date);
      let count = 0;

      habits.forEach(habit => {
        const logs = habit.logs || [];
        count += logs.filter(log => log.date === key).length;
      });

      days.push({
        label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        dateKey: key,
        count
      });
    }

    return days;
  },

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

  async render() {
    const stats = await this.getAllStats();
    const todayLogs = await Habit.getTodayLogs();
    const completed = todayLogs.length;
    const total = stats.totalHabits;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const bestStreak = stats.habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0);
    const weeklyTrend = this.buildWeeklyTrend(stats.habits);
    const topHabits = [...stats.habits]
      .filter(habit => habit.totalCompletions > 0)
      .sort((a, b) => b.totalCompletions - a.totalCompletions)
      .slice(0, 4);

    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = percentage + '%';
    }

    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${completed} / ${total} Habit Selesai`;
    }

    const totalHabitEl = document.getElementById('totalHabit');
    if (totalHabitEl) {
      totalHabitEl.textContent = total;
    }

    const completedHabitEl = document.getElementById('completedHabit');
    if (completedHabitEl) {
      completedHabitEl.textContent = completed;
    }

    const xpEl = document.getElementById('xp');
    if (xpEl) {
      xpEl.textContent = completed * 10 + ' XP';
    }

    const levelEl = document.getElementById('level');
    if (levelEl) {
      const level = Math.floor((completed * 10) / 50) + 1;
      levelEl.textContent = level;
    }

    const streakEl = document.getElementById('streak');
    if (streakEl) {
      streakEl.textContent = bestStreak + ' Hari';
    }

    const gardenHealthEl = document.getElementById('garden-health');
    if (gardenHealthEl) {
      gardenHealthEl.textContent = Math.min(100, 50 + bestStreak) + '%';
    }

    const treesEl = document.getElementById('trees');
    if (treesEl) {
      treesEl.textContent = Math.floor(completed / 5);
    }

    const todayCompletionEl = document.getElementById('today-completion');
    if (todayCompletionEl) {
      todayCompletionEl.textContent = `${completed} / ${total}`;
    }

    const completionRateEl = document.getElementById('completion-rate');
    if (completionRateEl) {
      completionRateEl.textContent = percentage + '%';
    }

    const bestStreakEl = document.getElementById('best-streak');
    if (bestStreakEl) {
      bestStreakEl.textContent = bestStreak + ' hari';
    }

    const activeHabitsEl = document.getElementById('active-habits');
    if (activeHabitsEl) {
      activeHabitsEl.textContent = stats.activeHabits;
    }

    const weeklyChartEl = document.getElementById('weekly-chart');
    if (weeklyChartEl) {
      const maxCount = Math.max(...weeklyTrend.map(day => day.count), 1);
      weeklyChartEl.innerHTML = weeklyTrend.map(day => {
        const height = day.count === 0 ? 10 : Math.max(18, Math.round((day.count / maxCount) * 100));
        return `
          <div class="week-bar-item">
            <div class="week-bar">
              <div class="week-bar-fill" style="height: ${height}%"></div>
            </div>
            <span class="week-bar-label">${day.label}</span>
            <small>${day.count}</small>
          </div>
        `;
      }).join('');
    }

    const topHabitsEl = document.getElementById('top-habits');
    if (topHabitsEl) {
      if (topHabits.length === 0) {
        topHabitsEl.innerHTML = '<p class="empty-state">Belum ada habit yang selesai.</p>';
      } else {
        topHabitsEl.innerHTML = topHabits.map((habit, index) => `
          <div class="top-habit-item">
            <div>
              <strong>${index + 1}. ${habit.habitName}</strong>
              <p>${habit.totalCompletions} kali selesai</p>
            </div>
            <span class="top-habit-streak">${habit.streak || 0} hari</span>
          </div>
        `).join('');
      }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Stats };
}

if (typeof window !== 'undefined') {
  window.Stats = Stats;
}
