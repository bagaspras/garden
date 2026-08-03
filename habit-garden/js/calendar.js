// Calendar Module
const Calendar = {
  init() {
    console.log('Calendar initialized');
  },

  // Get current month calendar
  getCurrentMonth(year = new Date().getFullYear(), month = new Date().getMonth()) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
      year,
      month,
      daysInMonth,
      startingDayOfWeek,
      monthName: this.getMonthName(month)
    };
  },

  // Get month name
  getMonthName(month) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month];
  },

  // Get days for habit in month
  async getHabitDaysInMonth(habitId, year, month) {
    const logs = await Habit.getHabitLogs(habitId);
    const days = {};

    logs.forEach(log => {
      const logDate = new Date(log.completedAt);
      if (logDate.getFullYear() === year && logDate.getMonth() === month) {
        const day = logDate.getDate();
        days[day] = (days[day] || 0) + 1;
      }
    });

    return days;
  },

  // Get completion percentage for month
  async getMonthCompletion(habitId, year, month) {
    const monthData = this.getCurrentMonth(year, month);
    const habitDays = await this.getHabitDaysInMonth(habitId, year, month);

    const completedDays = Object.keys(habitDays).length;
    const percentage = (completedDays / monthData.daysInMonth) * 100;

    return {
      completedDays,
      totalDays: monthData.daysInMonth,
      percentage: Math.round(percentage)
    };
  },

  // Render calendar view
  async render(habitId) {
    const today = new Date();
    const monthData = this.getCurrentMonth(today.getFullYear(), today.getMonth());
    const habitDays = await this.getHabitDaysInMonth(
      habitId,
      monthData.year,
      monthData.month
    );

    console.log('Rendering calendar for', monthData.monthName, monthData.year);
    console.log('Habit completion days:', habitDays);
    // TODO: Implement rendering logic
  }
};
